const { where } = require("sequelize");
const authConfig = require("../../config/authConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const AuthClient = require("../../models/AuthClient");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const AccessToken = require("../../models/AccessToken");
const AuthenticationError = require("../../Errors/ErrorTypes/AuthenticationError");
const bcrypt = require("bcryptjs");
const RefreshToken = require("../../models/RefreshToken");

class ApiAuth {
  #guard = authConfig.defaults.defaultGuard;
  constructor() {
    return (ApiAuth.instance ??= this);
  }

  async setup() {
    await this.#defineClients();
  }

  withGuard(guard) {
    if (guard) {
      this.#guard = guard;
    }
    return this;
  }

  // #relations(){
  //     AuthClient.hasMany(AccessToken, {
  //         foreignKey: "client_id",
  //       });

  //       AccessToken.belongsTo(AuthClient, {
  //         foreignKey: "client_id",
  //       });

  //       AuthClient.hasMany(RefreshToken, {
  //         foreignKey: "client_id",
  //       });

  //       RefreshToken.belongsTo(AuthClient, {
  //         foreignKey: "client_id",
  //       });

  //       RefreshToken.hasMany(AccessToken,{
  //         foreignKey: "refresh_id",
  //       })

  //       AccessToken.belongsTo(RefreshToken,{
  //         foreignKey: "refresh_id",
  //       });
  // }

  applyApiAuth(model) {
    // model.prototype.apiLogout = async function () {
    //   const authClient = await AuthClient.findOne({
    //     where: { guard: this.guard },
    //   });
    //   await AccessToken.update(
    //     { revoked: true },
    //     { where: { user_id: this.id, client_id: authClient.id } }
    //   );
    //   return true;
    // };
    // model.prototype.apiLogoutCurrentSession = async function (signature) {
    //   const authClient = await AuthClient.findOne({
    //     where: { guard: this.guard },
    //   });
    //   await AccessToken.update(
    //     { revoked: true },
    //     { where: { user_id: this.id, client_id: authClient.id, signature } }
    //   );
    //   return true;
    // };
  }
  async #generateAccess(
    user,
    refreshInstance,
    revokeAllPrev = false,
    revokePrevForSameRefresh = false
  ) {
    const authClient = await AuthClient.findOne({
      where: { guard: user.guard, type: "access", revoked: false },
    });
    const accessToken = jwt.sign({ id: user.id }, authClient.secret);
    const signature = accessToken.split(".")[2];
    const expiresAt = Date.now() + 1 * 60 * 1000; // 15 min

    if (revokeAllPrev) {
      await AccessToken.update(
        { revoked: true },
        { where: { user_id: user.id, client_id: authClient.id } }
      );
    } else if (revokePrevForSameRefresh) {
      await AccessToken.update(
        { revoked: true },
        {
          where: {
            user_id: user.id,
            client_id: authClient.id,
            refresh_id: refreshInstance.id,
          },
        }
      );
    }
    const accessInstance = await AccessToken.create({
      user_id: user.id,
      client_id: authClient.id,
      signature,
      expiresAt,
      refresh_id: refreshInstance.id,
    });
    return { accessInstance, accessToken };
  }
  
  async #generateRefresh(user, revokePrev = false) {
    const authClient = await AuthClient.findOne({
      where: { guard: user.guard, type: "refresh", revoked: false },
    });
    const refreshToken = jwt.sign({ id: user.id }, authClient.secret);
    const signature = refreshToken.split(".")[2];
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 day

    if (revokePrev) {
      await RefreshToken.update(
        { revoked: true },
        { where: { user_id: user.id, client_id: authClient.id } }
      );
    }
    const refreshInstance = await RefreshToken.create({
      user_id: user.id,
      client_id: authClient.id,
      signature,
      expiresAt,
    });
    return { refreshInstance, refreshToken };
  }

  async jwtLogin(req,res,revokePrev = false) {
    const password = req.body.password;
    delete req.body.password;
    const guardObj = authConfig.guards[this.#guard];
    if (!guardObj.drivers.includes("token")) {
      throw new BadRequestError("Proccess Not Allowed");
    }
    const model = authConfig.providers[guardObj.provider]?.model;
    const user = await model
      .scope("withPassword")
      .findOne({ where: { ...req.body } });
    if (!user) throw new AuthenticationError("Wrong Credintials");
    const isMatched = bcrypt.compareSync(password, user.password);
    if (!isMatched) throw new AuthenticationError("Wrong Password");
    const { refreshInstance, refreshToken } = await this.#generateRefresh(
      user,
      revokePrev
    );
    
    const { accessToken } = await this.#generateAccess(
      user,
      refreshInstance,
      revokePrev
    );
    // add refresh token for cookie
    res.cookie('refresh',refreshToken,{httpOnly:true,sameSite:'None',secure:false,maxAge:30 * 24 * 60 * 60 * 1000})
    const userInstance = await model.findOne({ where: { ...req.body } });
    return { accessToken, refreshToken, user: userInstance };
  }

  async refresh(req) {
    const { cookies } = req;
    const { refresh } = cookies;
    if (refresh) {
      const signature = refresh.split(".")[2];
      if (signature) {
        const refreshToken = await RefreshToken.findOne({
          where: { signature, revoked: false },
        });
        if (refreshToken) {
          if (refreshToken.expiresAt >= Date.now()) {
            const authClient = await AuthClient.findOne({
              where: { id: refreshToken.client_id, revoked: false },
            });
            if (authClient) {
              let payload = null;
              try {
                payload = jwt.verify(refresh, authClient.secret); // throws an error
              } catch (error) {
                throw new AuthenticationError(
                  "Unathorized, Invalid Refresh Token"
                );
              }
              if (payload?.id == refreshToken.user_id) {
                const { guard } = authClient;
                const guardObj = authConfig.guards[guard];
                const model = authConfig.providers[guardObj.provider].model;
                const user = await model.findByPk(refreshToken.user_id);
                if (user) {
                  // generate new Access token
                  const { accessToken } = await this.#generateAccess(
                    user,
                    refreshToken,
                    false,
                    true
                  );
                  return { accessToken, user };
                }
              }
            }
          }
        }
      }
    }
    throw new AuthenticationError();
  }

  async logout(req, res) {
    const { cookies } = req;
    const { refresh } = cookies;
    if (refresh) {
      const signature = refresh.split(".")[2];
      if (signature) {
        const refreshToken = await RefreshToken.findOne({
          where: { signature },
        });
        if (refreshToken) {
          await refreshToken.update({ revoked: true });
          await AccessToken.update(
            { revoked: true },
            { where: { refresh_id: refreshToken.id } }
          );
        }
      }
      res.clearCookie('refresh',{httpOnly:true,sameSite:'None',secure:false});
    } else if (req.user && req.signature) {
      // there is access token without refresh token
      const { signature } = req;
      await AccessToken.update({ revoked: true }, { where: { signature } });
    }
  }

  async generateTokenWithOauth(userData, revokePrev = false) {
    const guardObj = authConfig.guards[this.#guard];
    if (!guardObj.drivers.includes("token")) {
      throw new BadRequestError("Proccess Not Allowed");
    }
    const model = authConfig.providers[guardObj.provider]?.model;
    const user = await model.findOne({
      where: { ...userData, guard: this.#guard },
    });
    if (!user)
      throw new AuthenticationError(
        `no user "${this.#guard}" with this email "${
          userData.email
        }", try to register`
      );
    const { accessInstance, accessToken: token } = await this.#generateAccess(
      user,
      revokePrev
    );
    return token;
  }

  async #defineClients() {
    for (let guardName in authConfig.guards) {
      const guardObj = authConfig.guards[guardName];
      if (guardObj.drivers.includes("token")) {
        const count = await AuthClient.count({ where: { guard: guardName } });
        if (!count) {
          const accessSecret = this.#generateSecret();
          await AuthClient.create({
            guard: guardName,
            secret: accessSecret,
            type: "access",
          });
          const refreshSecret = this.#generateSecret();
          await AuthClient.create({
            guard: guardName,
            secret: refreshSecret,
            type: "refresh",
          });
        }
      }
    }
  }

  #generateSecret() {
    const secret = crypto.randomBytes(32).toString("hex");
    return crypto.createHash("sha256").update(secret).digest("hex");
  }
}

module.exports = ApiAuth;

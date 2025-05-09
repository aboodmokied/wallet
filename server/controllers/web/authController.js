const authConfig = require("../../config/authConfig");
const pagesConfig = require("../../config/pagesConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const NotFoundError = require("../../Errors/ErrorTypes/NotFoundError");
const CreateByAdminRequest = require("../../models/CreateByAdminRequest");
// const VerifyEmailToken = require("../../models/VerifyEmailToken");
const Authenticate = require("../../services/authentication/Authenticate");
const PasswordReset = require("../../services/password-reset/PasswordReset");
const ByAdminRegister = require("../../services/registration/ByAdminRegister");
const Register = require("../../services/registration/Register");
const tryCatch = require("../../util/tryCatch");

exports.getLogin = (req, res, next) => {
  // Before: guard and user data validation required.
  const guards = Object.keys(authConfig.guards).filter((guard) =>
    authConfig.guards[guard].drivers.includes("session")
  );
  const { guard } = req.params;
  req.session.pagePath = req.originalUrl;
  const guardObj = authConfig.guards[guard];
  res.render(pagesConfig.authentication.login.page, {
    pageTitle: `${guard[0].toUpperCase()}${guard.slice(1)} Login`,
    guards,
    currentGuard: guard,
    guardObj,
  });
};

exports.getQuickLogin = tryCatch(async (req, res, next) => {
  if (!req.session.targetUser) {
    throw new BadRequestError();
  }
  const { email, guard, name } = req.session.targetUser;
  req.session.pagePath = req.originalUrl;
  res.render("auth/quick-login", {
    pageTitle: "Quick Login",
    email,
    guard,
    name,
  });
});

exports.postLogin = tryCatch(async (req, res, next) => {
  const { guard } = req.body;
  const { passed, error } = await new Authenticate()
    .withGuard(guard)
    .attemp(req);
  if (!passed) {
    return res
      .with("old", req.body)
      .with("errors", [{ msg: error }])
      .redirect(req.session.pagePath);
  }
  res.redirect("/web");
});

exports.logout = (req, res, next) => {
  const { guard } = req.user;
  new Authenticate().logout(req);
  req.user = undefined;
  res.redirect(pagesConfig.authentication.login.path(guard));
};

exports.getRegister = (req, res, next) => {
  // Before: guard and user data validation required.
  const { guard } = req.params;
  const guards = Object.keys(authConfig.guards).filter(
    (guard) =>
      authConfig.guards[guard].registeration == "global" &&
      authConfig.guards[guard].drivers.includes("session")
  );
  const guardObj = authConfig.guards[guard];
  req.session.pagePath = req.originalUrl;
  res.render("auth/register", {
    pageTitle: `${guard[0].toUpperCase()}${guard.slice(1)} Register`,
    currentGuard: guard,
    guards,
    guardObj,
  });
};

exports.postRegister = tryCatch(async (req, res, next) => {
  // Before: guard and user data validation required, check if user exist.
  const { guard } = req.body;
  const user = await new Register().withGuard(guard).create(req);
  // res.with('old',{email:req.body.email}).redirect(pagesConfig.authentication.login.path(guard))
  req.session.targetUser = user;
  res.redirect("/web/auth/quick-login");
});

// register by admin
exports.getRegisterByAdminRequest = tryCatch(async (req, res, next) => {
  const { guard } = req.params;
  req.session.pagePath = req.originalUrl;
  res.render("auth/by-admin-request", {
    pageTitle: `Create ${guard} Request`,
    guard,
  });
});
exports.postRegisterByAdminRequest = tryCatch(async (req, res, next) => {
  const byAdmin = new ByAdminRegister();
  const message = await byAdmin.request(req);
  if (req.isApiRequest) {
    return res.send({
      status: true,
      result: {
        message,
      },
    });
  }
  res
    .with("message", message)
    .redirect(`/web/auth/register-by-admin/request/${req.body.guard}`);
});

exports.getRegisterByAdminCreate = tryCatch(async (req, res, next) => {
  const { email } = req.query;
  const { token } = req.params;
  const createByAdminRequest = await CreateByAdminRequest.findOne({
    where: { token, revoked: false },
  });
  if (!createByAdminRequest) {
    throw new BadRequestError(
      "Invalid request or the process was revoked by the system."
    );
  }
  if (email !== createByAdminRequest.email) {
    throw new BadRequestError("Invalid Email");
  }
  const { guard } = createByAdminRequest;
  req.session.pagePath = req.originalUrl;
  res.render("auth/by-admin-create", {
    pageTitle: `Create ${guard} Account`,
    token,
    email,
    guard,
  });
});
exports.postRegisterByAdminCreate = tryCatch(async (req, res, next) => {
  const byAdmin = new ByAdminRegister();
  const newUser = await byAdmin.create(req);
  if (newUser.guard == "admin") {
    req.session.targetUser = newUser;
    return res.redirect("/web/auth/quick-login");
  }
  res.render("auth/message", {
    message: "User Created Successfully, try to login",
  });
});

// password reset

exports.getPasswordResetRequest = (req, res, next) => {
  const { guard } = req.params;
  req.session.pagePath = req.originalUrl;
  res.render("auth/request-reset", {
    pageTitle: "Request Password Reset",
    guard,
  });
};
exports.postPasswordResetRequest = tryCatch(async (req, res, next) => {
  const { email, guard } = req.body;
  const passReset = new PasswordReset();
  const wasSent = await passReset.withEmail(email).withGuard(guard).request();
  res
    .with("message", "Mail was sent, check your email box")
    .redirect(`/web/auth/password-reset/${guard}/request`);
});

exports.getPasswordReset = (req, res, next) => {
  // BEFORE: verifyPasswordResetToken Middleware
  const { token } = req.params;
  const { email } = req.query;
  const queryParams = req.query;
  const fullPathWithQueryParams = `${req.originalUrl}?${new URLSearchParams(
    queryParams
  ).toString()}`;
  req.session.pagePath = fullPathWithQueryParams;
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    email,
    token,
  });
};

exports.postPasswordReset = tryCatch(async (req, res, next) => {
  const updatedUser = await new PasswordReset().update(req);
  req.session.targetUser = updatedUser;
  res.redirect("/web/auth/quick-login");
});

// verify account

exports.verifyEmailRequest = tryCatch(async (req, res, next) => {
  const message = await req.user.verifyEmail();
  // send a page with form to submit the code
  res.render("auth/message", {
    pageTitle: "Message",
    message,
  });
});

exports.verifyEmail = tryCatch(async (req, res, next) => {
  // const {token}=req.params;
  // const {email}=req.query;
  // const verifyEmailToken=await VerifyEmailToken.findOne({where:{token,revoked:false}});
  // if(verifyEmailToken){
  //     if(verifyEmailToken.email==email){
  //         const {guard}=verifyEmailToken;
  //         const guardObj=authConfig.guards[guard];
  //         const model=authConfig.providers[guardObj.provider]?.model;
  //         if(model){
  //             // await model.update({verified:true},{where:{email,guard}});
  //             const user=await model.findOne({where:{email,guard}});
  //             if(!user){
  //                 throw new NotFoundError('user not found');
  //             }
  //             await user.update({verified:true});
  //             await verifyEmailToken.update({revoked:true});
  //             req.session.targetUser=user;
  // res.redirect('/auth/quick-login');
  // }
  // }
  // }
  // throw new BadRequestError('Invalid Token');
  // if(req.isApi)
  // req.session.targetUser=req.targetUser;
  // res.redirect('/auth/quick-login');
  res.status(200).send({ status: true, result: { message: "Email Verified" } });
});

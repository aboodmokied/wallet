// const authConfig = require("../../../config/authConfig");
const BadRequestError = require("../../../Errors/ErrorTypes/BadRequestError");
const ValidationError = require("../../../Errors/ErrorTypes/ValidationError");
// const NotFoundError = require("../../../Errors/ErrorTypes/NotFoundError");
const VerifyEmailToken = require("../../../models/VerifyEmailToken");
const tryCatch = require("../../../util/tryCatch");

const verifyEmailToken = tryCatch(async (req, res, next) => {
  // const {token}=req.params;
  // const {email}=req.query;
  const { code } = req.body;
  const {email,guard}=req.user;
  const verifyEmailToken = await VerifyEmailToken.findOne({
    where: {
      email,
      code,
      revoked: false,
      guard
    },
  });
  if (verifyEmailToken) {
    // if(verifyEmailToken.email==email){
    // const { guard } = verifyEmailToken;
    // const guardObj = authConfig.guards[guard];
    // const model = authConfig.providers[guardObj.provider]?.model;
    // if (model) {
      // await model.update({verified:true},{where:{email,guard}});
    //   const user = await model.findOne({ where: { email, guard } });
    //   if (!user) {
    //     throw new NotFoundError("user not found");
    //   }
      await req.user.update({ verified: true });
      await verifyEmailToken.update({ revoked: true });
      req.targetUser = req.user;
      return next();
    // }
    // }
  }
  // throw new BadRequestError("Invalid Token");
  throw new ValidationError([{path:'code',msg:'Invalid Code'}]);
});

module.exports = verifyEmailToken;

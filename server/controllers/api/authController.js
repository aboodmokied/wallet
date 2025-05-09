const AccessToken = require("../../models/AccessToken");
const ApiAuth = require("../../services/api-authentication/ApiAuth");
const CodePasswordReset = require("../../services/code-password-reset/CodePasswordReset");
const PasswordReset = require("../../services/password-reset/PasswordReset");
const Register = require("../../services/registration/Register");
const tryCatch = require("../../util/tryCatch");

exports.register = tryCatch(async (req, res, next) => {
  // Before: guard and user data validation required, check if user exist.
  const { guard } = req.body;
  const user = await new Register().withGuard(guard).create(req);
  res.status(201).send({ status: true, result: { user } });
});

exports.login = tryCatch(async (req, res, next) => {
  const { guard } = req.body;
  const { accessToken, user } = await new ApiAuth()
    .withGuard(guard)
    .jwtLogin(req, res);
  res.send({ status: true, result: { accessToken, user } });
});

exports.logout = tryCatch(async (req, res, next) => {
  await new ApiAuth().logout(req, res);
  res.send({ status: true });
});

exports.refresh = tryCatch(async (req, res, next) => {
  const { accessToken, user } = await new ApiAuth().refresh(req);
  res.send({ status: true, result: { accessToken, user } });
});

exports.getCurrentUser = (req, res, next) => {
  return res.send({
    status: true,
    result: {
      user: req.user,
    },
  });
};

// exports.logout=tryCatch(async(req,res,next)=>{
//     // const {user,userSignature}=req;
//     // await user.apiLogoutCurrentSession(userSignature);
//     // res.status(200).send({status:true});

// })

// exports.logoutAll=tryCatch(async(req,res,next)=>{
//     const {user}=req;
//     await user.apiLogout();
//     res.status(200).send({status:true});
// })

// pass reset
exports.postCodePasswordResetRequest = tryCatch(async (req, res, next) => {
  const { email, guard } = req.body;
  const codePassReset = new CodePasswordReset();
  // const wasSent=await passReset.withEmail(email).withGuard(guard).request(process.env.FRONT_HOST);
  await codePassReset
    .withEmail(email)
    .withGuard(guard)
    .request();
  res.send({
    status: true,
    result: {
      message: "Code was sent, check your email box",
    },
  });
});

exports.postCodePasswordResetVerification=tryCatch(async(req,res,next)=>{
  const passReset = new CodePasswordReset();
  await passReset.verify(req,res);
  res.status(200).send({status:true,result:{message:'Code Verified Successfully, verification_token was added to the client Cookies, sent the new password with credintials..'}})
});


exports.postCodePasswordReset = tryCatch(async (req, res, next) => {
  // BEFORE: verifyPasswordResetToken Middleware
  const updatedUser = await new CodePasswordReset().update(req,res);
  res.send({
    status: true,
    result: {
      message: "Password Updated Succefully, try to login",
      user: updatedUser,
    },
  });
});

// verify email
exports.verifyEmailRequest = tryCatch(async (req, res, next) => {
  // const message=await req.user.verifyEmail(process.env.FRONT_HOST);
  const message = await req.user.verifyEmail();
  res.send({
    status: true,
    result: {
      message,
    },
  });
});

exports.verifyEmail = (req, res, next) => {
  res.send({
    status: true,
    result: {
      message: "Email verified",
      user: req.targetUser,
    },
  });
};

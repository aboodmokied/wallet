const express = require("express");
const tryCatch = require("../util/tryCatch");
const apiRoutes = express.Router();
const authController = require("../controllers/api/authController");
const transactionController = require("../controllers/api/transactionController");
const categoryController = require("../controllers/api/categoryController");
const companyController = require("../controllers/api/companyController");
const oAuthController = require("../controllers/oAuthController");
const verifyToken = require("../services/api-authentication/middlewares/verifyToken");
const validateRequest = require("../validation/middlewares/validateRequest");
const verifyEmailToken = require("../services/mail/middlewares/verifyEmailToken");
const verifyPassResetToken = require("../services/password-reset/middlewares/verifyPassResetToken");
const isVerified = require("../middlewares/isVerified");
const QueryFeatures = require("../util/QueryFeatures");
const { body } = require("express-validator");
const Category = require("../models/Category");
const userCanVerifyTransaction = require("../middlewares/userCanVerifyTransaction");

apiRoutes.post("/login", validateRequest("api-login"), authController.login);
apiRoutes.post(
  "/register",
  validateRequest("api-register"),
  authController.register
);
apiRoutes.get("/logout", verifyToken, authController.logout);
// apiRoutes.get('/logout/all',verifyToken,authController.logout);
// Oauth
apiRoutes.get(
  "/auth/google/:process/:guard",
  validateRequest("oauth-request"),
  oAuthController.googleAuthRequest
);
apiRoutes.get("/auth/google/callback", oAuthController.googleAuthResponse);

apiRoutes.post(
  "/test",
  tryCatch(async (req, res, next) => {
    // const {data,respronseMetaDate}=await new QueryFeatures(req).findAllWithFeatures(Student);
    // console.log('asdasd',{data,respronseMetaDate})
    // res.send({status:true,result:{data},...respronseMetaDate});
    await Category.create({name:req.body.name});
    res.status(200).send({ status: true });
  })
);

// password reset
apiRoutes.post(
  "/auth/password-reset/request",
  validateRequest("request-reset"),
  authController.postPasswordResetRequest
);
apiRoutes.post(
  "/auth/password-reset",
  validateRequest("reset"),
  verifyPassResetToken("body"),
  authController.postPasswordReset
);

// email verification
apiRoutes.get(
  "/auth/verify-email/request",
  verifyToken,
  authController.verifyEmailRequest
);
apiRoutes.get(
  "/auth/verify-email/:token",
  validateRequest("verify-email"),
  verifyEmailToken,
  authController.verifyEmail
);


// transfer
apiRoutes.post(
  "/transfer",
  validateRequest('transfer'),
  verifyToken,
  isVerified,
  transactionController.transfer
);

// => verified by source user

// payment
apiRoutes.post(
  "/payment",
  validateRequest('payment'),
  verifyToken,
  isVerified,
  transactionController.payment
);
// => verified by source user

// charging
apiRoutes.post(
  "/charging",
  verifyToken,
  isVerified,
  transactionController.charging
);
// => verified by charging point

apiRoutes.post(
  "/verify-transaction",
  verifyToken,
  userCanVerifyTransaction,
  transactionController.verifyTransaction
);


// category
apiRoutes.get('/category',categoryController.index);
apiRoutes.get('/category/:category_id',categoryController.getCategoryCompanies);



// company
apiRoutes.get('/company/:company_id',companyController.show);



// => role: systemOwner
// transaction

apiRoutes.get('/transaction/:transaction_id',transactionController.show);

// user transactions
apiRoutes.get('/user-transaction/:user_id',transactionController.userTransactions);

// company transactions
apiRoutes.get('/company-transaction/:company_id',transactionController.companyTransactions);
apiRoutes.get('/company-transaction/:transaction_id',transactionController.showCompanyTransaction);


// loggedin user transactions
apiRoutes.get('/current-user-transaction',verifyToken,transactionController.currentUserTransactions);
apiRoutes.get('/current-user-transaction/:transaction_id',verifyToken,transactionController.showCurrentUserTransaction);



module.exports = apiRoutes;

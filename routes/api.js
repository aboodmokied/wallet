const express = require("express");
const tryCatch = require("../util/tryCatch");
const apiRoutes = express.Router();
const authController = require("../controllers/api/authController");
const transactionController = require("../controllers/api/transactionController");
const userController = require("../controllers/api/userController");
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
const authorizePermission = require("../services/authorization/middlewares/authorizePermission");

apiRoutes.post("/login", validateRequest("api-login"), authController.login);
apiRoutes.get("/refresh", authController.refresh);
apiRoutes.post(
  "/register",
  validateRequest("api-register"),
  authController.register
);
apiRoutes.get("/logout",verifyToken,authController.logout);
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
  verifyToken,
  tryCatch(async (req, res, next) => {
    // const {data,respronseMetaDate}=await new QueryFeatures(req).findAllWithFeatures(Student);
    // console.log('asdasd',{data,respronseMetaDate})
    // res.send({status:true,result:{data},...respronseMetaDate});
    // await Category.create({ name: req.body.name });
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
apiRoutes.post(
  "/auth/verify-email",
  verifyToken,
  validateRequest("verify-email"),
  verifyEmailToken,
  authController.verifyEmail
);

// *** transaction operations

// transfer
// user
apiRoutes.get(
  "/user/:user_phone",
  verifyToken,
  isVerified,
  userController.getUserByPhone
);
apiRoutes.post(
  "/transfer",
  verifyToken,
  isVerified,
  authorizePermission("can-transfer"),
  validateRequest("transfer"),
  transactionController.transfer
);

// payment
// category
apiRoutes.get("/category", categoryController.index);
apiRoutes.get(
  "/category-companies/:category_id",
  verifyToken,
  isVerified,
  validateRequest("category-companies"),
  categoryController.getCategoryCompanies
);
// company
apiRoutes.get(
  "/company/:company_id",
  verifyToken,
  isVerified,
  validateRequest("get-company"),
  companyController.show
);
// operation
apiRoutes.post(
  "/payment",
  verifyToken,
  isVerified,
  authorizePermission("can-payment"),
  validateRequest("payment"),
  transactionController.payment
);

apiRoutes.post(
  "/verify-transaction",
  verifyToken,
  userCanVerifyTransaction,
  validateRequest("verify-transaction"),
  transactionController.verifyTransaction
);

// loggedin user transactions
apiRoutes.get(
  "/current-user-transaction",
  verifyToken,
  isVerified,
  authorizePermission("has-transactions"),
  transactionController.currentUserTransactions
);
apiRoutes.get(
  "/current-user-transaction/:transaction_id",
  verifyToken,
  isVerified,
  authorizePermission("has-transactions"),
  validateRequest("show-transaction"),
  transactionController.showCurrentUserTransaction
);

// => role: systemOwner
// transaction

// apiRoutes.get('/transaction/:transaction_id',transactionController.show);

// // user transactions
// apiRoutes.get('/user-transaction/:user_id',transactionController.userTransactions);

// // company transactions
// apiRoutes.get('/company-transaction/:company_id',transactionController.companyTransactions);
// apiRoutes.get('/company-transaction/:transaction_id',transactionController.showCompanyTransaction);

module.exports = apiRoutes;

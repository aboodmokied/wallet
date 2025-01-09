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
const { body, param } = require("express-validator");
const Category = require("../models/Category");
const userCanVerifyTransaction = require("../middlewares/userCanVerifyTransaction");
const authorizePermission = require("../services/authorization/middlewares/authorizePermission");
const verifyCodePassResetToken = require("../services/code-password-reset/middlewares/verifyCodePassResetToken");
const {
  validateLoginPassword,
  validateRegisterPassword,
  validateConfirmPassword,
} = require("../validation/validations/passwordValidations");
const {
  validateGuard,
  validateOauthGuard,
} = require("../validation/validations/guardValidations");
const {
  validateEmail,
  validateEmailExistence,
  validateEmailIsFound,
} = require("../validation/validations/emailValidations");
const { validateName } = require("../validation/validations/nameValidations");
const {
  customUserRegisterationValidations,
  customCompanyRegisterationValidations,
  validateOauthProcess,
  validateAmount,
  validateCode,
  validateVerificationCode,
} = require("../validation/validations/otherValidations");
const {
  validateTargetPhone,
  validateTargetCompanyPhone,
  validateTargetPhoneInParam,
  validateTargetPhoneIsNotForTheSameUser,
} = require("../validation/validations/phoneValidations");
const {
  validateCategoryIsFound,
} = require("../validation/validations/categoryValidations");
const Company = require("../models/Company");
const Transaction = require("../models/Transaction");
const {
  validateTransactionInParam,
  validateTransaction,
} = require("../validation/validations/transactionsValidations");
const {
  validateCompany,
} = require("../validation/validations/companyValidations");
const Wallet = require("../models/Wallet");
const CompanyWallet = require("../models/CompanyWallet");

apiRoutes.post(
  "/login",
  validateRequest([
    validateEmail,
    validateGuard("body", false, false, true),
    validateLoginPassword,
  ]),
  authController.login
);

apiRoutes.get("/refresh", authController.refresh);
apiRoutes.post(
  "/register",
  validateRequest([
    validateEmail,
    validateEmailExistence,
    validateName,
    validateGuard("body", true, false, true),
    validateRegisterPassword,
    validateConfirmPassword,
    ...customUserRegisterationValidations,
    ...customCompanyRegisterationValidations,
  ]),
  authController.register
);
apiRoutes.get("/logout", verifyToken, authController.logout);
// apiRoutes.get('/logout/all',verifyToken,authController.logout);
// Oauth
apiRoutes.get(
  "/auth/google/:process/:guard",
  validateRequest([validateOauthProcess, validateOauthGuard]),
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
  "/password-reset/request",
  validateRequest([validateGuard(), validateEmailIsFound]),
  authController.postCodePasswordResetRequest
);
apiRoutes.post(
  "/password-reset/verify",
  validateRequest([validateGuard(), validateEmailIsFound, validateCode]),
  authController.postCodePasswordResetVerification
);
apiRoutes.post(
  "/password-reset",
  validateRequest([validateRegisterPassword, validateConfirmPassword]),
  verifyCodePassResetToken,
  authController.postCodePasswordReset
);

// email verification
apiRoutes.get(
  "/verify-email/request",
  verifyToken,
  authController.verifyEmailRequest
);
apiRoutes.post(
  "/verify-email",
  verifyToken,
  validateRequest([validateCode]),
  verifyEmailToken,
  authController.verifyEmail
);

// user wallet
apiRoutes.get(
  "/current-user-wallet",
  verifyToken,
  tryCatch(async (req, res, next) => {
    const { id, guard } = req.user;
    let wallet;
    if (guard == "user") {
      wallet = await Wallet.findOne({ where: { user_id: id } });
    } else if (guard == "company") {
      wallet = await CompanyWallet.findOne({ where: { company_id: id } });
    }
    res.status(200).send({ status: true, result: { wallet } });
  })
);

// *** transaction operations

// transfer
// user
apiRoutes.post(
  "/target-user",
  verifyToken,
  isVerified,
  validateRequest([
    validateTargetPhone,
    validateTargetPhoneIsNotForTheSameUser,
  ]),
  userController.getUserByPhone
);
apiRoutes.post(
  "/transfer",
  verifyToken,
  isVerified,
  authorizePermission("can-transfer"),
  validateRequest([
    validateTargetPhone,
    validateTargetPhoneIsNotForTheSameUser,
    validateAmount,
  ]),
  transactionController.transfer
);

// payment
// category
apiRoutes.get("/category", categoryController.index);
apiRoutes.get(
  "/category-companies/:category_id",
  verifyToken,
  isVerified,
  validateRequest([validateCategoryIsFound]),
  categoryController.getCategoryCompanies
);
// company
apiRoutes.get(
  "/company/:company_id",
  verifyToken,
  isVerified,
  validateRequest([validateCompany]),
  companyController.show
);

// operation
apiRoutes.post(
  "/payment",
  verifyToken,
  isVerified,
  authorizePermission("can-payment"),
  validateRequest([validateTargetCompanyPhone, validateAmount]),
  transactionController.payment
);

apiRoutes.post(
  "/verify-transaction",
  verifyToken,
  userCanVerifyTransaction,
  validateRequest([validateTransaction, validateVerificationCode]),
  transactionController.verifyTransaction
);

// loggedin user transactions
apiRoutes.get(
  "/current-user-transactions",
  verifyToken,
  isVerified,
  // authorizePermission("has-transactions"),
  transactionController.currentUserTransactions
);
apiRoutes.get(
  "/current-user-transaction/:transaction_id",
  verifyToken,
  isVerified,
  // authorizePermission("has-transactions"),
  validateRequest([validateTransactionInParam]),
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

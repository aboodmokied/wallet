const express = require("express");
const tryCatch = require("../util/tryCatch");
const apiRoutes = express.Router();
const authController = require("../controllers/api/authController");
const webAuthController = require("../controllers/web/authController");
const transactionController = require("../controllers/api/transactionController");
const userController = require("../controllers/web/userController");
const categoryController = require("../controllers/api/categoryController");
// const roleController = require("../controllers/web/roleController");
const companyController = require("../controllers/api/companyController");
const walletUserController = require("../controllers/api/walletUserController");
const chPointController = require("../controllers/api/chPointController");
const reportController = require("../controllers/api/reportController");
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
  validateRegisterByAdminGuard,
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
  validateTiming,
} = require("../validation/validations/otherValidations");
const {
  validateTargetPhone,
  validateTargetCompanyPhone,
  validateTargetPhoneInParam,
  validateTargetPhoneIsNotForTheSameUser,
} = require("../validation/validations/phoneValidations");
const {
  validateCategoryIsFound,
  validateCategoryName,
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
const { validateRoleName, validateRoleExistance } = require("../validation/validations/roleValidations");
const { validatePermissionExistance } = require("../validation/validations/permissionValidations");
const { validateUserExistance, validateUserInParam } = require("../validation/validations/userValidations");
const authorizeSuperAdmin = require("../services/authorization/middlewares/authorizeSuperAdmin");
const { validateChargingPointIsFound } = require("../validation/validations/chargingPointValidations");

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
  "/auth/google/request/:guard",
  validateRequest([validateOauthGuard]),
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
  walletUserController.getUserByPhone
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
// charging
apiRoutes.post(
  "/charging",
  verifyToken,
  isVerified,
  authorizePermission("can-charge"),
  validateRequest([
    validateAmount,
    validateTargetPhone
]),
  transactionController.charging
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

// //  Admin Routes
//   // role
//   apiRoutes.get(
//     "/cms/role",
//     verifyToken,
//     authorizeSuperAdmin,
//     roleController.index
//   );

//   apiRoutes.post(
//     "/cms/role",
//     verifyToken,
//     authorizeSuperAdmin,
//     validateRequest([
//       validateRoleName
//   ]),
//     roleController.store
//   );

//   apiRoutes.get(
//     "/cms/role/:role_id",
//     verifyToken,
//     authorizeSuperAdmin,
//     validateRequest([
//       validateRoleExistance('param')
//   ]),
//     roleController.show
//   );

//   apiRoutes.delete(
//     "/cms/role/:role_id",
//     verifyToken,
//     authorizeSuperAdmin,
//     validateRequest([
//       validateRoleExistance('param')
//   ]),
//     roleController.destroy
//   );


//   apiRoutes.post(
//     "/cms/role/assignPermission",
//     verifyToken,
//     authorizeSuperAdmin,
//     validateRequest([
//       validatePermissionExistance,
//       validateRoleExistance('body')
//   ]),
//     roleController.assignPermission
//   );
//   apiRoutes.post(
//     "/cms/role/revokePermission",
//     verifyToken,
//     authorizeSuperAdmin,
//     validateRequest([
//       validatePermissionExistance,
//       validateRoleExistance('body')
//   ]),
//     roleController.revokePermission
//   );

//   // user
// apiRoutes.get(
//   "/cms/user/:guard/all",
//   verifyToken,
//   authorizePermission("can-show-users"),
//   validateRequest([
//     validateGuard('param'),
// ]),
//   userController.index
// );
// apiRoutes.get(
//   "/cms/user/:guard/:user_id",
//   verifyToken,
//   authorizePermission("can-show-users"),
//   validateRequest([
//     validateGuard('param'),
//     validateUserInParam

// ]),
//   userController.show
// );
// apiRoutes.get(
//   "/cms/user-roles/:guard/:user_id",
//   verifyToken,
//   authorizePermission("can-show-user-roles"),
//   validateRequest([
//     validateGuard('param'),
//     validateUserInParam
// ]),
//   userController.getUserRoles
// );
// apiRoutes.post(
//   "/cms/user-roles/assignRole",
//   verifyToken,
//   authorizeSuperAdmin,
//   validateRequest([
//     validateGuard('body'),
//     validateUserExistance,
//     validateRoleExistance('body')
//   ]),
//   userController.userAssignRole
// );
// apiRoutes.post(
//   "/cms/user-roles/revokeRole",
//   verifyToken,
//   authorizeSuperAdmin,
//   validateRequest([
//     validateGuard('body'),
//     validateUserExistance,
//     validateRoleExistance('body')
//   ]),
//   userController.userRevokeRole
// );



//systemOwner routes
// category
apiRoutes.get(
  "/category",
  verifyToken,
  categoryController.index
);
apiRoutes.post(
  "/category",
  verifyToken,
  authorizePermission("can-create-category"),
  validateRequest([
    validateCategoryName
]),
  categoryController.store
);
apiRoutes.get(
  "/category-companies/:category_id",
  verifyToken,
  validateRequest([
    validateCategoryIsFound
]),
  categoryController.getCategoryCompanies
);


// wallet users
apiRoutes.get(
  "/wallet-user/:guard/all",
  verifyToken,
  authorizePermission("can-show-wallet-users"),
  validateRequest([
    validateGuard('param'),
]),
  walletUserController.index
);
apiRoutes.get(
  "/wallet-user/:guard/:user_id",
  verifyToken,
  authorizePermission("can-show-wallet-users"),
  validateRequest([
    validateGuard('param'),
    validateUserInParam
]),
  walletUserController.show
);


// charging point
// create charging point
apiRoutes.post(
  "/auth/register-by-admin/request",
  verifyToken,
  // authorizePermission('can-create-chrging-point'),
  validateRequest([
    validateGuard('body'),
    validateRegisterByAdminGuard('body',['by-system-owner']),
    validateEmailExistence
  ]),
  webAuthController.postRegisterByAdminRequest
);
// pending
apiRoutes.patch(
  "/charging-point/pending",
  verifyToken,
  authorizePermission("can-pending-charging-point"),
  validateRequest([
    validateChargingPointIsFound
]),
  chPointController.pending
);
// delete
apiRoutes.delete(
  "/charging-point",
  verifyToken,
  authorizePermission("can-delete-charging-point"),
  validateRequest([
    validateChargingPointIsFound
]),
  chPointController.destroy
);

// apiRoutes.get('/my-charging-point-transactions',isAuthenticated,reportController.dailyMyChPointTransactions);


// reporting
apiRoutes.get(
  "/report/system-transactions",
  verifyToken,
  authorizePermission("can-show-transactions-reports"),
  validateRequest([
    validateTiming
]),
  reportController.dailySystemTransactions
);
apiRoutes.get(
  "/transaction/:transaction_id",
  verifyToken,
  authorizePermission("can-show-all-transactions"),
  validateRequest([
    validateTransactionInParam
]),
  transactionController.show
);
apiRoutes.get(
  "/report/system-user-transactions/:guard/:user_id",
  verifyToken,
  authorizePermission("can-show-transactions-reports"),
  validateRequest([
    validateTiming,
    validateGuard('param'),
    validateUserInParam
]),
  reportController.dailySystemUserTransactions
);




module.exports = apiRoutes;

const express=require('express');
const isAuthenticated = require('../services/authentication/middlewares/isAuthenticated');
const oAuthController=require('../controllers/oAuthController');
const authController=require('../controllers/web/authController');
const reportController=require('../controllers/web/reportController');
const adminController=require('../controllers/web/adminController');
const companyController=require('../controllers/web/companyController');
const chPointController=require('../controllers/web/chPointController');
const pagesConfig = require('../config/pagesConfig');
const isGuest = require('../services/authentication/middlewares/isGuest');
const validateRequest = require('../validation/middlewares/validateRequest');
const authorizePermission = require('../services/authorization/middlewares/authorizePermission');

const RoleController=require('../controllers/web/RoleController');
const categoryController=require('../controllers/web/categoryController');
const transactionController=require('../controllers/web/transactionController');
const userController=require('../controllers/web/userController');
const authorizeSuperAdmin = require('../services/authorization/middlewares/authorizeSuperAdmin');
const verifyPassResetToken = require('../services/password-reset/middlewares/verifyPassResetToken');
const isVerified = require('../middlewares/isVerified');
const verifyEmailToken = require('../services/mail/middlewares/verifyEmailToken');
const Admin = require('../models/Admin');
const AuthorizationError = require('../Errors/ErrorTypes/AuthorizationError');
const tryCatch = require('../util/tryCatch');
const BadRequestError = require('../Errors/ErrorTypes/BadRequestError');
const User = require('../models/User');
const userCanVerifyTransaction = require('../middlewares/userCanVerifyTransaction');
const authConfig = require('../config/authConfig');
const NotFoundError = require('../Errors/ErrorTypes/NotFoundError');

const webRoutes=express.Router();

webRoutes.get('/',isAuthenticated,async(req,res,next)=>{
    const {guard}=req.user;
    if(guard=='admin'){
       if(req.user.isSuper){
           return res.redirect('/cms/role');
    } 
        return res.redirect(`/cms/user/${authConfig.defaults.defaultGuard}/all`)
    }else if(guard=='systemOwner'){
        return res.redirect('/report/system-transactions');
    }else if(guard=='chargingPoint'){
        return res.redirect('/charging');
    }else {
        throw new NotFoundError('Page Not Found For this guard')
    }  
})

// home pages
// webRoutes.get('/home/admin',)
// webRoutes.get('/home/systemOwner')
// webRoutes.get('/home/chargingPoint')


// login
webRoutes.get('/auth/login/:guard',isGuest,validateRequest('login-page'),authController.getLogin);
webRoutes.get('/auth/quick-login',isGuest,authController.getQuickLogin);
webRoutes.post('/auth/login',isGuest,validateRequest('login'),authController.postLogin);

// Oauth
webRoutes.get('/auth/google/:process/:guard',isGuest,validateRequest('oauth-request'),oAuthController.googleAuthRequest);
webRoutes.get('/api/auth/google/callback',oAuthController.googleAuthResponse);

// register
webRoutes.get('/auth/register/:guard',isGuest,validateRequest('register-page'),authController.getRegister);
webRoutes.post('/auth/register',isGuest,validateRequest('register'),authController.postRegister);

// by admin register

const conditionalMiddleware=(permission)=>{
    const Authorize = require("../services/authorization/Authorize");
    new Authorize().addPermission(permission);
    return async(req,res,next)=>{
        let guard;
        if(req.method=='GET'){
            guard=req.params.guard;
        }else{
            guard=req.body.guard;
        }
        const guardObj=authConfig.guards[guard]
        if(guardObj?.registeration=='by-admin'){
            return await authorizeSuperAdmin(req,res,next);
        }else if(guardObj?.registeration=='by-system-owner'){
            return await authorizePermission(permission,false)(req,res,next);
        }else{
            throw new BadRequestError('Process not allowed');
        }
    }
}


webRoutes.get('/auth/register-by-admin/request/:guard',isAuthenticated,conditionalMiddleware('can-create-charging-point'),validateRequest('register-by-admin-request-page'),authController.getRegisterByAdminRequest);
webRoutes.post('/auth/register-by-admin/request',isAuthenticated,conditionalMiddleware('can-create-charging-point'),validateRequest('register-by-admin-request'),authController.postRegisterByAdminRequest);
webRoutes.get('/auth/register-by-admin/:token',isGuest,authController.getRegisterByAdminCreate);
webRoutes.post('/auth/register-by-admin',isGuest,validateRequest('register-by-admin-create'),authController.postRegisterByAdminCreate);

// admin register
// /auth/register-by-admin/${hashedToken}?email=${email}
// webRoutes.get('/auth/create-admin/request',authorizeSuperAdmin,adminController.createRequest);
// webRoutes.post('/auth/create-admin/request',isAuthenticated,authorizeSuperAdmin,adminController.storeRequest);
// webRoutes.get('/auth/create-admin/:token',isGuest,adminController.create);
// webRoutes.post('/auth/create-admin',isGuest,adminController.store);

// logout
webRoutes.get('/auth/logout',isAuthenticated,authController.logout);

webRoutes.get('/authTest',reportController.dailySystemTransactions);

webRoutes.get('/authTest2',isAuthenticated,authorizePermission('testPermission2'),async(req,res,next)=>{
    const roles=await req.user.getRoles();
    res.send({status:true,user:req.user,roles});
})


// pass reset
webRoutes.get('/auth/password-reset/:guard/request',validateRequest('request-reset-page'),authController.getPasswordResetRequest);
webRoutes.post('/auth/password-reset/request',validateRequest('request-reset'),authController.postPasswordResetRequest);

webRoutes.get('/auth/password-reset/:token',validateRequest('reset-page'),verifyPassResetToken('url'),authController.getPasswordReset);
webRoutes.post('/auth/password-reset',validateRequest('reset'),verifyPassResetToken('body'),authController.postPasswordReset);

// cms
    // role
    webRoutes.get('/cms/role',isAuthenticated,authorizeSuperAdmin,RoleController.index);
    webRoutes.get('/cms/role/create',isAuthenticated,authorizeSuperAdmin,RoleController.create);
    webRoutes.post('/cms/role',isAuthenticated,authorizeSuperAdmin,validateRequest('create-role'),RoleController.store);
    webRoutes.get('/cms/role/:roleId',isAuthenticated,authorizeSuperAdmin,validateRequest('role-page'),RoleController.show);
    webRoutes.post('/cms/role/assignPermission',isAuthenticated,authorizeSuperAdmin,validateRequest('assign-role-permission'),RoleController.assignPermission);
    webRoutes.post('/cms/role/revokePermission',isAuthenticated,authorizeSuperAdmin,validateRequest('revoke-role-permission'),RoleController.revokePermission);
    webRoutes.delete('/cms/role/:roleId',isAuthenticated,authorizeSuperAdmin,validateRequest('delete-role'),RoleController.destroy);
    // user
    webRoutes.get('/cms/user/:guard/all',isAuthenticated,authorizePermission('can-show-users'),validateRequest('users-page'),userController.index);
    webRoutes.get('/cms/user/:guard/:id',isAuthenticated,authorizePermission('can-show-users'),validateRequest('user-page'),userController.show);
    webRoutes.get('/cms/user-roles/:guard/:id',isAuthenticated,authorizePermission('can-show-user-roles'),validateRequest('user-page'),userController.getUserRoles);
    webRoutes.post('/cms/user-roles/assignRole',isAuthenticated,authorizeSuperAdmin,userController.userAssignRole);
    webRoutes.post('/cms/user-roles/revokeRole',isAuthenticated,authorizeSuperAdmin,userController.userRevokeRole);

    // vrify email
    webRoutes.get('/auth/verify-email/request',isAuthenticated,authController.verifyEmailRequest);
    webRoutes.get('/auth/verify-email/:token',validateRequest('verify-email'),verifyEmailToken,authController.verifyEmail);


    // (system-owner)
    // category
    webRoutes.get('/category',isAuthenticated,authorizePermission('can-show-categories'),categoryController.index);
    webRoutes.get('/category/create',isAuthenticated,authorizePermission('can-create-category'),categoryController.create);
    webRoutes.post('/category',isAuthenticated,authorizePermission('can-create-category'),validateRequest('create-category'),categoryController.store);


    // charging point

    // pending
    webRoutes.patch('/charging-point/pending',isAuthenticated,authorizePermission('can-pending-charging-point'),validateRequest('ch-point-operation'),chPointController.pending);
    // delete
    webRoutes.delete('/charging-point',isAuthenticated,authorizePermission('can-delete-charging-point'),validateRequest('ch-point-operation'),chPointController.destroy);
    
    

    // reporting
    webRoutes.get('/report/system-transactions',isAuthenticated,authorizePermission('can-show-transactions-reports'),validateRequest('system-transactions-report'),reportController.dailySystemTransactions);
    webRoutes.get('/report/system-user-transactions/:guard/:user_id',isAuthenticated,authorizePermission('can-show-transactions-reports'),validateRequest('user-transactions-report'),reportController.dailySystemUserTransactions);

    // transaction
    webRoutes.get('/transaction/:transaction_id',transactionController.showTransaction);


    // charging
    // =>show charging page 
    webRoutes.get('/charging',isAuthenticated,isVerified,authorizePermission('can-charge'),transactionController.getCharging);
    // get user by user phone
    webRoutes.get('/confirm',isAuthenticated,isVerified,authorizePermission('can-charge'),validateRequest('confirm-charging-page'),transactionController.getConfirm);
    // // post amount with target-phone  
    webRoutes.post(
        "/charging",
        isAuthenticated,           
        isVerified,
        authorizePermission('can-charge'),
        validateRequest('charging'),
        transactionController.charging
        );  // redirect to verification page
    // // verify
    webRoutes.get('/verify/:transaction_id',isAuthenticated,isVerified,validateRequest('verify-transaction-page'),transactionController.getVerify);    
    webRoutes.post('/verify',isAuthenticated,isVerified,userCanVerifyTransaction,validateRequest('verify-transaction'),transactionController.verifyTransaction);    



module.exports=webRoutes;
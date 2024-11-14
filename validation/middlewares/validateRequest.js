const {validationResult}=require('express-validator');
const ValidationError=require('../../Errors/ErrorTypes/ValidationError');
const { loginValidation, loginPageValidation, registerPageValidation, registerValidation, requestResetPageValidation, requestResetValidation, resetPageValidation, resetValidation, verifyEmailValidation, oauthRequestValidation, apiLoginValidation, apiRegisterValidation, registerByAdminPage, registerByAdmin, registerByAdminCreate } = require('../schemas/authValidation');
const { createRoleValidation, assignRolePermissionValidation, revokeRolePermissionValidation, deleteRoleValidation, rolePageValidation } = require('../schemas/authorizationValidation');
const { usersPageValidation, userPageValidation } = require('../schemas/userValidation');
const { transferValidation, paymentValidation, confirmChargingPageValidation, chargingValidation, verifyTransactionPageValidation, verifyTransactionValidation, showTransactionValidation } = require('../schemas/transactionValidations');
const { createCategoryValidation, categoryCompaniesValidation } = require('../schemas/categoryValidations');
const { chargingPointOperationValidation } = require('../schemas/charingPointValidations');
const { systemTransactionsReportValidation, userTransactionsReportValidation } = require('../schemas/reportValidations');
const { showCompanyValidation } = require('../schemas/companyValidations');

// handles validations result
const checkResult=(req,res,next)=>{
    const errors=validationResult(req);
    if(errors.isEmpty()){
        return next();
    }

    throw new ValidationError(errors.array({onlyFirstError:true})); // into global handler
}

const validateRequest=(type)=>{
    let validations=[];
    switch(type) {
        case 'login-page':
            validations=loginPageValidation;
            break;
        case 'login':
            validations=loginValidation;
            break;
        case 'api-login':
            validations=apiLoginValidation;
            break;
        case 'register-page':
            validations=registerPageValidation;
            break;
        case 'register':
            validations=registerValidation;
            break;
        case 'api-register':
            validations=apiRegisterValidation;
            break;
        case 'oauth-request':
            validations=oauthRequestValidation;
            break;
            
        case 'register-by-admin-request-page':
            validations=registerByAdminPage;
            break;
        case 'register-by-admin-request':
            validations=registerByAdmin;
        case 'register-by-admin-create':
            validations=registerByAdminCreate;
            break;
        case 'request-reset-page':
            validations=requestResetPageValidation;
            break;
        case 'request-reset':
            validations=requestResetValidation;
            break;
        case 'reset-page':
            validations=resetPageValidation;
            break;
        case 'reset':
            validations=resetValidation;
            break;
        case 'verify-email':
            validations=verifyEmailValidation;
            break;
        case 'create-role':
            validations=createRoleValidation;
            break;
        case 'users-page':
            validations=usersPageValidation;
            break;
        case 'user-page':
            validations=userPageValidation;
            break;
        case 'role-page':
            validations=rolePageValidation;
            break;
        case 'delete-role':
            validations=deleteRoleValidation;
            break;
        case 'assign-role-permission':
            validations=assignRolePermissionValidation;
            break;
        case 'revoke-role-permission':
            validations=revokeRolePermissionValidation;
            break;
        case 'transfer':
            validations=transferValidation;
            break;
        case 'payment':
            validations=paymentValidation;
            break;
        case 'create-category':
            validations=createCategoryValidation;
            break;
        case 'ch-point-operation':
            validations=chargingPointOperationValidation;
            break;
        case 'system-transactions-report':
            validations=systemTransactionsReportValidation;
            break;
        case 'user-transactions-report':
            validations=userTransactionsReportValidation;
            break;
        case 'confirm-charging-page':
            validations=confirmChargingPageValidation;
            break;
        case 'charging':
            validations=chargingValidation;
            break;
        case 'category-companies':
        validations=categoryCompaniesValidation;
            break;
        case 'get-company':
        validations=showCompanyValidation;
            break;
        case 'show-transaction':
        validations=showTransactionValidation;
            break;
        case 'verify-transaction-page':
        validations=verifyTransactionPageValidation;
            break;
        case 'verify-transaction':
        validations=verifyTransactionValidation;
            break;
        default:
          throw Error('type required');
      }
    
    return [...validations,checkResult];
}



module.exports=validateRequest;
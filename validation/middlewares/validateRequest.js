const {validationResult}=require('express-validator');
const ValidationError=require('../../Errors/ErrorTypes/ValidationError');
const { loginValidation, loginPageValidation, registerPageValidation, registerValidation, requestResetPageValidation, requestResetValidation, resetPageValidation, resetValidation, verifyEmailValidation, oauthRequestValidation, apiLoginValidation, apiRegisterValidation } = require('../schemas/authValidation');
const { createRoleValidation, assignRolePermissionValidation, revokeRolePermissionValidation, deleteRoleValidation, rolePageValidation } = require('../schemas/authorizationValidation');
const { usersPageValidation, userPageValidation } = require('../schemas/userValidation');
const { transferValidation } = require('../schemas/transactionValidations');

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
        default:
          throw Error('type required');
      }
    
    return [...validations,checkResult];
}



module.exports=validateRequest;
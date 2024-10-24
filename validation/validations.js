const { body, query,param } = require("express-validator");
const authConfig = require("../config/authConfig");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const { mails } = require("../config/mailConfig");
const User = require("../models/User");
const Company = require("../models/Company");

exports.validateEmail=body('email').normalizeEmail().notEmpty().withMessage('Email Required').isEmail().withMessage('Invalid Email').custom((email)=>{
    const service=email.split('@')[1]?.split('.')[0];
    let valid=false;
    for(let mail in mails){
        const mailObj=mails[mail];
        if(mailObj.service==service){
            valid=true;
            break;
        }
    }
    // if(!valid){
    //     throw new Error(`Email type ${service} not supported`);
    // }
    return true;
});
exports.validateEmailExistence=body('email').normalizeEmail().custom(async(input,{req})=>{
    const guardObj=authConfig.guards[req.body.guard];
    if(!guardObj){
        return Promise.reject('AuthConfig Error');
    }
        const model=authConfig.providers[guardObj.provider]?.model;
        const count=await model.count({where:{email:input}});
        if(count){
            return Promise.reject('Email already in use');
        }
});

exports.validateEmailIsFound=body('email').normalizeEmail().custom(async(input,{req})=>{
    const guardObj=authConfig.guards[req.body.guard];
    if(!guardObj){
        return Promise.reject('AuthConfig Error');
    }
        const model=authConfig.providers[guardObj.provider]?.model;
        const count=await model.count({where:{email:input}});
        if(!count){
            return Promise.reject('Email not found');
        }
})

exports.validateName=body('name').notEmpty().withMessage('Username Required').isLength({max:30,min:3}).withMessage('Username length should be between 3 to 30')

exports.validateRegisterPassword=body('password')
.isLength({ min: 8 })
.withMessage('Password must be at least 8 characters long')
.matches(/[A-Z]/)
.withMessage('Password must contain at least one uppercase letter')
.matches(/[a-z]/)
.withMessage('Password must contain at least one lowercase letter')
.matches(/[0-9]/)
.withMessage('Password must contain at least one number')
.matches(/[\W_]/)
.withMessage('Password must contain at least one special character');


exports.validateLoginPassword=body('password')
.notEmpty().withMessage('Password Required');

exports.validateConfirmPassword=body('confirmPassword').custom((input,{req})=>{
    if(input===req.body.password){
        return true;
    }
    throw new Error('Password and Confirm Password are not compatable')
});




exports.validateGuard=(existsIn='body',validateGlobalRegistration=false,validateSessionLogin=false,validateTokenLogin=false)=>{
    const holder=require('express-validator')[existsIn];
    return holder('guard').notEmpty().withMessage('Guard Required').custom((input)=>{
        let isValid=true;
        if(input in authConfig.guards){
            // if(!validateGlobalRegistration){
            //     return true;
            // }
            const guardObj=authConfig.guards[input];
            if(validateGlobalRegistration){
                isValid=guardObj.registeration=='global';
            }
            if(validateSessionLogin && isValid){
                isValid=guardObj.drivers.includes('session');
            }
            if(validateTokenLogin && isValid){
                isValid=guardObj.drivers.includes('token');
            }
            if(isValid){
                return true;
            }
        }
        throw new Error('Invalid Guard');
    })
}

exports.validateRoleName=body('name').notEmpty().withMessage('Role Name Required').custom(async(name)=>{
    const count=await Role.count({where:{name}});
    if(count){
        return Promise.reject('Role Exists')
    }
})

exports.validateRoleExistance=(existsIn='body')=>{
    const holder=require('express-validator')[existsIn];
    return holder('roleId').notEmpty().withMessage('Role id required').custom(async(roleId)=>{
        const count=await Role.count({where:{id:roleId}});
        if(!count){
            return Promise.reject('Role not found');
        }
    })
}
exports.validatePermissionExistance=body('permissionId').notEmpty().withMessage('Permission id required').custom(async(permissionId)=>{
    const count=await Permission.count({where:{id:permissionId}});
    if(!count){
        return Promise.reject('Permission not found');
    }
})

// exports.validateUserExistance=body('userId').notEmpty().withMessage('User id required').custom(async(userId)=>{
//     const count=await User.count({where:{id:userId}});
//     if(!count){
//         return Promise.reject('User not found');
//     }
// })

exports.normalizeEmailInQuery=query('email').normalizeEmail();
exports.validateToken= body('token').notEmpty().withMessage('Token Required');


exports.validateOauthProcess=param('process').custom((process)=>{
    if(process=='register'||process=='login'){
        return true;
    }
    throw new Error("proccess not provided, provided processes: 'register' or 'login'");
});

exports.validateOauthGuard=param('guard').custom((guard,{req})=>{
    if(guard in authConfig.guards){
        const guardObj=authConfig.guards[guard];
        const {process}=req.params;
        if(process=='register'){
            if(guardObj.registeration=='global' && guardObj.oauth){
                return true;
            }
        }
        if(guardObj.oauth){
            return true;
        }
        throw new Error(`process not allowed for this guard ${guard}`);
        
    }
    throw new Error('Invalid Guard');
});


exports.validateUserExistance=param('id').custom(async(id,{req})=>{
    const {guard}=req.params;
    if(guard in authConfig.guards){
        const guardObj=authConfig.guards[guard];
        const model=authConfig.providers[guardObj.provider]?.model;
        const count=await model.count({where:{id}});
        if(!count){
            return Promise.reject('User not found')
        }
        return true;
    }
    throw new Error('Invalid Guard');
});



exports.targetPhone=body('target_phone').notEmpty().custom(async(target_phone)=>{
    const count = await User.count({where:{phone:target_phone}});
    if(!count){
        return Promise.reject('User not found, no users with this phone');
    }
});


exports.targetCompanyPhone=body('target_company_phone').notEmpty().custom(async(target_phone)=>{
    const count = await Company.count({where:{phone:target_phone}});
    if(!count){
        return Promise.reject('Company not found, no company with this phone');
    }
});;

exports.amount=body('amount').notEmpty();

// exports.info=body('info').is
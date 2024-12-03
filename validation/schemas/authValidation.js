const { body } = require("express-validator");
const {
  validateEmail,
  validateEmailExistence,
  validateName,
  validateGuard,
  validatePassword,
  validateConfirmPassword,
  validateRegisterPassword,
  validateLoginPassword,
  validateEmailIsFound,
  validateToken,
  validateEmailAsQuery,
  normalizeEmailInQuery,
  validateOauthGuard,
  validateOauthProcess,
  validateRegisterByAdminGuard,
} = require("../validations");
const authConfig = require("../../config/authConfig");
const Category = require("../../models/Category");

exports.loginPageValidation = [validateGuard("param", false, true)];
exports.loginValidation = [
  validateEmail,
  validateGuard("body", false, true),
  validateLoginPassword,
];
exports.apiLoginValidation = [
  validateEmail,
  validateGuard("body", false, false, true),
  validateLoginPassword,
];

exports.registerPageValidation = [validateGuard("param", true, true)];

exports.registerValidation = [
  validateEmail,
  validateEmailExistence,
  validateName,
  validateGuard("body"),
  validateRegisterPassword,
  validateConfirmPassword,
];

const customUserRegisterationValidations = [
  body("national_id").if(body("guard").equals("user")).notEmpty().custom(async(nationalId,{req})=>{
    const guardObj=authConfig.guards[req.body.guard]
    const model=authConfig.providers[guardObj.provider]?.model;
    const count=await model.count({where:{national_id:nationalId}});
    if(count){
        return Promise.reject('this NationalId already used'); 
    }
  }),
  body("phone").if(body("guard").equals("user")).notEmpty().custom(async(phone,{req})=>{
    const guardObj=authConfig.guards[req.body.guard]
    const model=authConfig.providers[guardObj.provider]?.model;
    const count=await model.count({where:{phone}});
    if(count){
        return Promise.reject('this phone already used'); 
    }
  }),
];

const customCompanyRegisterationValidations=[
  body('category_id').if(body("guard").equals("company")).notEmpty().custom(async(category_id)=>{
    const count=await Category.count({where:{id:category_id}});
    if(!count){
      return Promise.reject('Category not found');
    }
  }),
  body("phone").if(body("guard").equals("company")).notEmpty().custom(async(phone,{req})=>{
    const guardObj=authConfig.guards[req.body.guard]
    const model=authConfig.providers[guardObj.provider]?.model;
    const count=await model.count({where:{phone}});
    if(count){
        return Promise.reject('this phone already used'); 
    }
  }),
];

exports.apiRegisterValidation = [
  validateEmail,
  validateEmailExistence,
  validateName,
  validateGuard("body", true, false, true),
  validateRegisterPassword,
  validateConfirmPassword,
  ...customUserRegisterationValidations,
  ...customCompanyRegisterationValidations
];

exports.requestResetPageValidation = [validateGuard("param")];

exports.requestResetValidation = [validateGuard("body"), validateEmailIsFound];

exports.resetPageValidation = [normalizeEmailInQuery];

exports.resetValidation = [
  // token email password
  validateToken,
  validateEmail,
  validateRegisterPassword,
  validateConfirmPassword,
];

exports.verifyEmailValidation = [body('code').notEmpty().withMessage('Verification Code Required')];

exports.oauthRequestValidation = [validateOauthProcess, validateOauthGuard];


exports.registerByAdminPage = [validateGuard('param'),validateRegisterByAdminGuard('param',['by-admin','by-system-owner'])];
exports.registerByAdmin = [validateGuard('body'),validateRegisterByAdminGuard('body',['by-admin','by-system-owner']),validateEmailExistence];

exports.registerByAdminCreate = [validateGuard('body'),validateName,validateEmail,validateRegisterPassword,validateConfirmPassword];
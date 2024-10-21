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
} = require("../validations");
const authConfig = require("../../config/authConfig");

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

exports.apiRegisterValidation = [
  validateEmail,
  validateEmailExistence,
  validateName,
  validateGuard("body", true, false, true),
  validateRegisterPassword,
  validateConfirmPassword,
  ...customUserRegisterationValidations
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

exports.verifyEmailValidation = [normalizeEmailInQuery];

exports.oauthRequestValidation = [validateOauthProcess, validateOauthGuard];

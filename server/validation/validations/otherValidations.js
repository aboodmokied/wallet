const { body, param, query } = require("express-validator");
const Category = require("../../models/Category");
const authConfig = require("../../config/authConfig");

exports.validateAmount = body("amount").notEmpty().withMessage('amount required').custom(amount=>{
  if(amount<=0){
      throw new Error('Invalid Amount, should be greater than 0');
  }
  return true;
});

exports.validateAmountInQuery=query('amount').notEmpty().withMessage('amount Query Param Required').custom(amount=>{
  if(amount<=0){
      throw new Error('Invalid Amount, should be greater than 0');
  }
  return true;
}),

exports.validateTiming = query("from").custom((from, { req }) => {
    if (from && req.query.to) {
      if (from > req.query.to) {
        throw new Error("Invalid Timing");
      }
    }
    return true;
  });

  
  exports.validateToken = body("token").notEmpty().withMessage("Token Required");

exports.validateOauthProcess = param("process").custom((process) => {
  if (process == "register" || process == "login") {
    return true;
  }
  throw new Error(
    "proccess not provided, provided processes: 'register' or 'login'"
  );
});


exports.validateCode=body('code').notEmpty().withMessage('Verification Code Required')


exports.customCompanyRegisterationValidations=[
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


  exports.customUserRegisterationValidations = [
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


exports.validateVerificationCode=body('verification_code').notEmpty().withMessage('verification_code required')
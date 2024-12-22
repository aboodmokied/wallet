const { body, query } = require("express-validator");
const User = require("../../models/User");
const Company = require("../../models/Company");

exports.validateTargetPhone = body('target_phone').notEmpty().withMessage('target_phone Required').custom(async(target_phone)=>{
    const count=await User.count({where:{phone:target_phone}});
    if(!count){
        return Promise.reject('No Users with this target_phone found');
    }
    return true;
})

exports.validateTargetPhoneInQuery=query('target_phone').notEmpty().withMessage('target_phone Query Param Required').custom(async(target_phone)=>{
  const count=await User.count({where:{phone:target_phone}});
  if(!count){
      return Promise.reject('No Users with this target_phone found');
  }
  return true;
});

exports.validateTargetCompanyPhone = body("target_company_phone")
  .notEmpty()
  .custom(async (target_phone) => {
    const count = await Company.count({ where: { phone: target_phone } });
    if (!count) {
      return Promise.reject("Company not found, no company with this phone");
    }
  });

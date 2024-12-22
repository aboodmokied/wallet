const { param } = require("express-validator");
const Company = require("../../models/Company");

exports.validateCompany=param('company_id').custom(async(id)=>{
    const count=await Company.count({where:{id}});
    if(!count){
        return Promise.reject('No Company with this company_id');
    }
})
const Company = require("../../models/Company");
const tryCatch = require("../../util/tryCatch");

exports.index=tryCatch(async(req,res,next)=>{
    const companies=await Company.findAll();
    res.status(200).send({status:true,result:{companies}});
});
// exports.create=tryCatch(async(req,res,next)=>{
    
// });
// exports.store=tryCatch(async(req,res,next)=>{
//     const newCompany=await Company.create({name:req.body.name});
//     res.status(201).send({status:true,result:{newCompany}});
// });
exports.show=tryCatch(async(req,res,next)=>{
    const {company_id}=req.params;
    const company=await Company.findByPk(company_id);
    res.status(200).send({status:true,result:{company}});
});
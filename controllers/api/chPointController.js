const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const ChargingPoint = require("../../models/ChargingPoint");
const tryCatch = require("../../util/tryCatch");

exports.pending=tryCatch(async(req,res,next)=>{
    const {ch_point_id}=req.body;
    const chPoint=await ChargingPoint.findByPk(ch_point_id);
    chPoint.wasPending=!chPoint.wasPending;
    await chPoint.save();
    return res.send({status:true,result:{
        message:'Operation Succeseed'
    }})
});

exports.destroy=tryCatch(async(req,res,next)=>{
    const {ch_point_id}=req.body;
    await ChargingPoint.destroy({where:{id:ch_point_id}});
    res.send({status:true,result:{
        message:'Operation Succeseed'
    }})
});
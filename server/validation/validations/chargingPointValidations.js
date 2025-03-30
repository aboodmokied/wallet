const { body } = require("express-validator");
const ChargingPoint = require("../../models/ChargingPoint");

exports.validateChargingPointIsFound=body('ch_point_id').notEmpty().withMessage('ch_point_id Required').custom(async(input)=>{
    const count=await ChargingPoint.count({where:{id:input}});
    if(!count){
        return Promise.reject('No ChargingPoint with this id was found');
    }
})
const { param } = require("express-validator");
const { validateTiming, validateGuard, validateUserExistance } = require("../validations");
const authConfig = require("../../config/authConfig");



exports.systemTransactionsReportValidation=[
    validateTiming
];
exports.userTransactionsReportValidation=[
    validateTiming,
    validateGuard('param'),
    param('user_id').custom(async(user_id,{req})=>{
        const guardObj=authConfig.guards[req.params.guard];
        const model=authConfig.providers[guardObj.provider]?.model;
        const count=await model.count({where:{id:user_id}});
        if(!count){
            return Promise.reject('No user with this user_id');
        }
    })
];
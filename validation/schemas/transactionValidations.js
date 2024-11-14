const { query, body } = require("express-validator");
const { targetPhone, amount, targetCompanyPhone } = require("../validations");
const User = require("../../models/User");

exports.transferValidation=[
    targetPhone,
    amount,
];

exports.paymentValidation=[
    targetCompanyPhone,
    amount,
];


exports.confirmChargingPageValidation=[
    query('amount').notEmpty().withMessage('amount Query Param Required').custom(amount=>{
        if(amount<=0){
            throw new Error('Invalid Amount, should be greater than 0');
        }
    }),
    query('target_phone').notEmpty().withMessage('target_phone Query Param Required').custom(async(target_phone)=>{
        const count=await User.count({where:{phone:target_phone}});
        if(!count){
            return Promise.reject('No Users with this target_phone found');
        }
    })
];

exports.chargingValidation=[
    body('amount').notEmpty().withMessage('amount Required').custom(amount=>{
        if(amount<=0){
            throw new Error('Invalid Amount, should be greater than 0');
        }
    }),
    body('target_phone').notEmpty().withMessage('target_phone Required').custom(async(target_phone)=>{
        const count=await User.count({where:{phone:target_phone}});
        if(!count){
            return Promise.reject('No Users with this target_phone found');
        }
    })
];
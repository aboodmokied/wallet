const { query, body, param } = require("express-validator");
const { targetPhone, amount, targetCompanyPhone } = require("../validations");
const User = require("../../models/User");
const Transaction = require("../../models/Transaction");

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



exports.verifyTransactionPageValidation=[
    param('transaction_id').custom(async(transaction_id)=>{
        const transactionInstance=await Transaction.findByPk(transaction_id);
        if(!transactionInstance){
            return Promise.reject('No Transactions with this transaction_id found');
        }
        if(transactionInstance.verified_at){
            return Promise.reject('This transaction already verified');
        }
    })
];
exports.verifyTransactionValidation=[
    body('transaction_id').custom(async(transaction_id)=>{
        const count=await Transaction.count({where:{id:transaction_id}});
        if(!count){
            return Promise.reject('No Transactions with this transaction_id found');
        }
    }),
    body('verification_code').notEmpty().withMessage('verification_code required')
];
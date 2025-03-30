const { param, body } = require("express-validator");
const Transaction = require("../../models/Transaction");

exports.validateTransaction=body('transaction_id').custom(async(transaction_id)=>{
    const count=await Transaction.count({where:{id:transaction_id}});
    if(!count){
        return Promise.reject('No Transactions with this transaction_id found');
    }
})

exports.validateTransactionInParam=param('transaction_id').custom(async(id)=>{
    const count=await Transaction.count({where:{id}});
    if(!count){
        return Promise.reject('No Transaction with this transaction_id');
    }
})
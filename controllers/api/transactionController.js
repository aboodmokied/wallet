const { Op } = require("sequelize");
const transactionConfig = require("../../config/transactionConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");
const TransactionBuilder = require("../../services/transaction/TransactionBuilder");
const tryCatch = require("../../util/tryCatch");

const transactionBuilder=new TransactionBuilder();

exports.transfer=tryCatch(async(req,res,next)=>{
    const opertaion=await transactionBuilder.build(req,'transfer');
    const transaction=await Transaction.findByPk(opertaion.transaction_id);
    const tragetUser=await transaction.getTargetUser();
    res.status(200).send({status:true,result:{
        message:'Operation Succeed, Verify it.',
        opertaion,
        transaction,
        tragetUser
    }});
});


exports.payment=tryCatch(async(req,res,next)=>{
    const opertaion=await transactionBuilder.build(req,'payment');
    const transaction=await Transaction.findByPk(opertaion.transaction_id);
    res.status(200).send({status:true,result:{
        message:'Operation Succeed, Verify it.',
        opertaion,
        transaction
    }});
});

exports.charging=tryCatch(async(req,res,next)=>{
    const opertaion=await transactionBuilder.build(req,'charging');
    const transaction=await Transaction.findByPk(opertaion.transaction_id);
    res.status(200).send({status:true,result:{
        message:'Operation Succeed, Verify it.',
        opertaion,
        transaction
    }});
});


exports.show=tryCatch(async (req,res,next)=>{
    const {transaction_id}=req.params;
    const transaction=await Transaction.findByPk(transaction_id);
    const {operation_type,operation_id}=transaction;
    const operationModel=transactionConfig.operations[operation_type]?.model;
    const opertaionObject=await operationModel.findByPk(operation_id);
    res.status(200).send({status:true,result:{
        transaction,
        operation:opertaionObject
    }})
});

exports.verifyTransaction=tryCatch(async(req,res,next)=>{
    const {transactionId,verificationCode}=req.body;
    const transaction=await Transaction.findByPk(transactionId);
    if(transaction.verified_at){
        throw new BadRequestError('Transaction Already verified');
    }
    const expiresAt=transaction.date + (5 * 60 * 1000);
    if(Date.now()>expiresAt){
        throw new BadRequestError('Request Timeout');
    }
    if(transaction.verification_code!=verificationCode){
        throw new BadRequestError('Invalid Verification Code');
    }
    const result=await transaction.update({verified_at:Date.now()});
    const succeed=await transactionBuilder.perform(transaction);
    if(!succeed){
        throw new Error('Server Error, Something went wrong.');
    }
    const operationModel=transactionConfig.operations[transaction.operation_type]?.model;
    const operation=await operationModel.findByPk(transaction.operation_id);
    res.status(200).send({status:true,result:{
        message:'Transaction Verified Succefully',
        operation,
        transaction:result
    }});
});



exports.userTransactions=tryCatch(async(req,res,next)=>{
    const {user_id}=req.params;
    const user=await User.findByPk(user_id);
    const sourceTransactions=await user.getSourceTransactions({where:{verified_at:{[Op.ne]:null}}});
    const targetTransactions=await user.getTargetTransactions({where:{verified_at:{[Op.ne]:null}}});
    res.status(200).send({status:true,result:{
        user,
        inTransactions:targetTransactions,
        outTransactions:sourceTransactions,
    }});
});


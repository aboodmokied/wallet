const AppError = require("../../Errors/AppError");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");
const TransactionBuilder = require("../../services/transaction/TransactionBuilder");
const tryCatch = require("../../util/tryCatch");

const transactionBuilder=new TransactionBuilder();

exports.getCharging=(req,res,next)=>{
    res.render('transaction/charging/index',{
        pageTitle:'Charging'
    });
};

exports.getConfirm=tryCatch(async(req,res,next)=>{
    const {amount,target_phone}=req.query;
    const userInstance=await User.findOne({where:{phone:target_phone}});
    res.render('transaction/charging/confirm',{
        pageTitle:'Confirm',
        user:userInstance,
        amount
    });
});

exports.charging=tryCatch(async(req,res,next)=>{
    const opertaion=await transactionBuilder.build(req,'charging');
    // const transaction=await Transaction.findByPk(opertaion.transaction_id);
    res.redirect(`/verify/${opertaion.transaction_id}`);
});

exports.getVerify=tryCatch(async(req,res,next)=>{
    const {transaction_id}=req.params;
    res.render('transaction/charging/verify',{
        transaction_id
    });
    
});

exports.verifyTransaction=tryCatch(async(req,res,next)=>{
    let transaction;
    try{
        transaction=await transactionBuilder.verify(req);
    }catch(error){
        if(error instanceof AppError){
            const {transaction_id}=req.body;
            return res.with('errors',[{msg:error.message}]).redirect(`/verify/${transaction_id}`);
        }
        throw error;
    }
    const succeed=await transactionBuilder.perform(transaction);
    if(!succeed){
        throw new Error('Server Error, Something went wrong.');
    }
    const operation=await transaction.getOperation();
    res.status(200).send({status:true,result:{
        message:'Transaction Verified Succefully',
        operation,
        transaction
    }});
});

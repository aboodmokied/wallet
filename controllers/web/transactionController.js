const AppError = require("../../Errors/AppError");
const ChargingPointTransaction = require("../../models/ChargingPointTransaction");
const CompanyTransaction = require("../../models/CompanyTransaction");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");
const TransactionBuilder = require("../../services/transaction/TransactionBuilder");
const tryCatch = require("../../util/tryCatch");

const transactionBuilder=new TransactionBuilder();

exports.getCharging=(req,res,next)=>{
    req.session.pagePath=req.path;
    res.render('wallet/charging/charge',{
        pageTitle:'Charging'
    });
};

exports.getConfirm=tryCatch(async(req,res,next)=>{
    const {amount,target_phone}=req.query;
    const userInstance=await User.findOne({where:{phone:target_phone}});
    req.session.pagePath=req.path;
    res.render('wallet/charging/confirm',{
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
    req.session.pagePath=req.path;
    res.render('wallet/charging/verify',{
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



exports.showTransaction=tryCatch(async(req,res,next)=>{
    const {transaction_id,guard}=req.params;
    let transaction;
    let operation;
    if(guard=='user'){
        transaction=await Transaction.findByPk(transaction_id);
        operation=await transaction.getOperation();
    }else if(guard=='company'){
        transaction=await CompanyTransaction.findByPk(transaction_id);
        operation=await transaction.getPayment();
    }else if(guard=='chargingPoint'){
        transaction=await ChargingPointTransaction.findByPk(transaction_id);
        operation=await transaction.getCharging();
    }else{
        throw new BadRequestError('This type of users has no transactions');
    }
    const users=await operation.getUsers();
    return res.render('wallet/transaction/transaction-details',{
        pageTitle:'Transaction Details',
        guard,
        transaction,
        operation,
        users
    })
    // res.status(200).send({status:true,result:{
    //     guard,
    //     transaction,
    //     operation,
    //     users
    // }});
});


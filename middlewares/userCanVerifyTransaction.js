const transactionConfig = require("../config/transactionConfig");
const AuthorizationError = require("../Errors/ErrorTypes/AuthorizationError");
const ChargingPoint = require("../models/ChargingPoint");
const Transaction = require("../models/Transaction");
const tryCatch = require("../util/tryCatch");

const userCanVerifyTransaction=tryCatch(async (req,res,next)=>{
    /**
     * transfer => source user (email => source user)
     * charging => charging-point (email => target user)
     * payment => source user (email => source user)
     * **/ 
    const {transaction_id}=req.body;
    const transaction=await Transaction.findByPk(transaction_id);
    const {operation_type} = transaction;
    let isCan=false;
    const {id,guard}=req.user;
    switch (operation_type){
        case 'transfer':
            if(guard=='user'&&transaction.user_id==id){
                isCan=true;
            }
        break;
        case 'payment':
            if(guard=='user'&&transaction.user_id==id){
                isCan=true;
            }
        case 'charging':
            if(guard=='chargingPoint'){
                const operationModel=transactionConfig.operations[transaction.operation_type]?.model;
                const chargingOperation=await operationModel.findByPk(transaction.operation_id);
                if(chargingOperation.charging_point_id==id){
                    isCan=true;
                }
            }
        break;
        default:
            throw new Error('Operation type is not provided');
    } 

    if(!isCan){
        throw new AuthorizationError();
    }
    next();
});

module.exports=userCanVerifyTransaction;
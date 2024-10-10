const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");
const TransactionBuilder = require("../../services/transaction/TransactionBuilder");
const tryCatch = require("../../util/tryCatch");

const transactionBuilder=new TransactionBuilder();

exports.transfer=tryCatch(async(req,res,next)=>{
    // const {id}=req.user;
    // const userWallet=await req.user.getWallet();
    // const {target_phone,info,amount}=req.body;
    // if(userWallet.balance<amount){
    //     throw new BadRequestError('Your Balance Not Enough')
    // }
    // const targetUser=await User.findOne({where:{phone:target_phone}});
    // const operationData={
    //     wallet_id:userWallet.id,
    //     user_id:id,
    //     target_id:targetUser.id,
    //     target_wallet_id:targetUser.wallet_id,
    //     info
    // };
    // const extraCustomData={
    //     amount,
    //     target_user_id:targetUser.id,
    //     target_wallet_id:targetUser.wallet_id,
    // };
    // const customData={
    //     amount,
    //     old_balance:userWallet.balance,
    //     current_balance:userWallet.balance - amount,
    //     verification_code:'123132',
    //     wallet_id:userWallet.id,
    //     user_id:id,
    //     date:Date.now(),
    //     target_user_id:targetUser.id,
    //     target_wallet_id:targetUser.wallet_id,
    // };
    const opertaion=await transactionBuilder.build(req,'transfer');
    const transaction=await Transaction.findByPk(opertaion.transaction_id);
    res.status(200).send({status:true,result:{opertaion,transaction}});
    // const transfer=await Transfer.create({
    //     wallet_id,
    //     user_id:id,
    //     target_id:targetUser.id,
    //     target_wallet_id:targetUser.id,
    //     info
    // },{
    //     customData:{
    //         amount,
    //         old_balance:userWallet.balance,
    //         current_balance:userWallet.balance + amount,
    //         verification_code,//
    //         date:Date.now(),
    //         operation_type:'transfer',
    //         operation_id:this.transfer.id,
    //         target_user_id:targetUser.id,
    //         target_wallet_id:targetUser.wallet_id,
    //         user_id:id,
    //     }
    // });
});


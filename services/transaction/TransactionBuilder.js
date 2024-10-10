const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const Transfer = require("../../models/Transfer");
const User = require("../../models/User");

class TransactionBuilder{
    constructor(){
        return TransactionBuilder.instance??=this;
    }
    
    async build(req,operationType){
        let operation;
        const {id}=req.user;
        const {amount}=req.body;
        const userWallet=await req.user.getWallet();
        const customData={
            amount,
            old_balance:userWallet.balance,
            current_balance:userWallet.balance - amount,
            verification_code:'123132',
            wallet_id:userWallet.id,
            user_id:id,
            date:Date.now(),
            // target_user_id:targetUser.id,
            // target_wallet_id:targetUser.wallet_id,
        };
        switch(operationType){
            case 'transfer':
                const {target_phone,info}=req.body;
                if(userWallet.balance<amount){
                    throw new BadRequestError('Your Balance Not Enough')
                }
                const targetUser=await User.findOne({where:{phone:target_phone}});
                const operationData={
                    wallet_id:userWallet.id,
                    user_id:id,
                    target_id:targetUser.id,
                    target_wallet_id:targetUser.wallet_id,
                    info
                };
                customData.target_user_id=targetUser.id;
                customData.target_wallet_id=targetUser.wallet_id;
                operation=await Transfer.create(operationData,{customData});
                break;
            default:
                throw new BadRequestError('operation not provided');            
        }

        return operation;
    }
};

module.exports=TransactionBuilder;
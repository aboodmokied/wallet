const transactionConfig = require("../../config/transactionConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const Charging = require("../../models/Charging");
const ChargingPointTransaction = require("../../models/ChargingPointTransaction");
const Company = require("../../models/Company");
const CompanyTransaction = require("../../models/CompanyTransaction");
const CompanyWallet = require("../../models/CompanyWallet");
const Payment = require("../../models/Payment");
const Transfer = require("../../models/Transfer");
const User = require("../../models/User");
const Wallet = require("../../models/Wallet");

class TransactionBuilder {
  constructor() {
    return (TransactionBuilder.instance ??= this);
  }

  async build(req, operationType) {
    let operation;
    const { id } = req.user;
    const { amount } = req.body;
    let userWallet=operationType=='charging'?undefined:await req.user.getWallet();
    let customData;
    if(operationType=='charging'){
      customData = {
        amount,
        old_balance: undefined,
        current_balance: undefined,
        verification_code: "123132",
        wallet_id: undefined,
        user_id: undefined,
        date: Date.now(),
        // target_user_id:targetUser.id,
        // target_wallet_id:targetUser.wallet_id,
      };
    }else{
      customData = {
        amount,
        old_balance: userWallet.balance,
        current_balance: userWallet.balance - amount,
        verification_code: "123132",
        wallet_id: userWallet.id,
        user_id: id,
        date: Date.now(),
        // target_user_id:targetUser.id,
        // target_wallet_id:targetUser.wallet_id,
      };
    }
    switch (operationType) {
      case "transfer":
        const { target_phone, info } = req.body;
        if (userWallet.balance < amount) {
          throw new BadRequestError("Your Balance Not Enough");
        }
        const targetUser = await User.findOne({
          where: { phone: target_phone },
        });
        const operationData = {
          wallet_id: userWallet.id,
          user_id: id,
          target_id: targetUser.id,
          target_wallet_id: targetUser.wallet_id,
          info,
        };
        customData.target_user_id = targetUser.id;
        customData.target_wallet_id = targetUser.wallet_id;
        operation = await Transfer.create(operationData, { customData });
        break;
      case "payment":
        const { target_company_phone } = req.body;
        if (userWallet.balance < amount) {
          throw new BadRequestError("Your Balance Not Enough");
        }
        const targetCompany = await Company.findOne({
          where: { phone: target_company_phone },
        });
        const paymentOperationData = {
          wallet_id: userWallet.id,
          user_id: id,
          company_id: targetCompany.id,
          company_wallet_id: targetCompany.company_wallet_id,
        };
        operation = await Payment.create(paymentOperationData, { customData });
        break;
      case "charging":
        const { target_phone:target_user_phone } = req.body;
        const chargingPoint=req.user;
        const targetUserInstance=await User.findOne({where:{phone:target_user_phone}});
        const targetUserWalletInstance=await targetUserInstance.getWallet();
        customData.old_balance=targetUserWalletInstance.balance;
        customData.current_balance=targetUserWalletInstance.balance + amount;
        customData.target_wallet_id=targetUserWalletInstance.id;
        customData.target_user_id=targetUserInstance.id;
        const chargingOperationData = {
          wallet_id: targetUserWalletInstance.id,
          user_id: targetUserInstance.id,
          charging_point_id: chargingPoint.id,
        };
        operation = await Charging.create(chargingOperationData, { customData });
        break;
      default:
        throw new BadRequestError("operation not provided");
    }

    return operation;
  }

  async perform(transaction) {
    let succeed=false;
    const { operation_type, operation_id, amount } = transaction;
    const OperationModel = transactionConfig.operations[operation_type]?.model;
    const operationInsatance = await OperationModel.findByPk(operation_id);
    const sourceWallet = await transaction.getSourceWallet();
    const targetWallet = await transaction.getTargetWallet();

    // const target=await operationInsatance.getTarget();
    // const targetWallet=await operationInsatance.getTargetWallet();
    switch (operation_type) {
      case "transfer":
        const { target_wallet_id } = operationInsatance;
        // const targetWallet = await Wallet.findByPk(target_wallet_id);
        await sourceWallet.update({ balance: sourceWallet.balance - amount });
        await targetWallet.update({ balance: targetWallet.balance + amount });
        succeed=true;
        break;
      case "payment":
        const { company_wallet_id,company_id } = operationInsatance;
        // const companyInstance=await Company.findByPk(company_id);
        console.log({operationInsatance});
        const targetCompanyWallet = await CompanyWallet.findByPk(
          company_wallet_id
        );
        await sourceWallet.update({ balance: sourceWallet.balance - amount });
        const companyTransaction=await CompanyTransaction.create({ 
            amount,
            old_balance:targetCompanyWallet.balance,
            current_balance:targetCompanyWallet.balance + amount,
            date:transaction.date,
            company_id,
            company_wallet_id,
            payment_id:operationInsatance.id
         });
        // await operationInsatance.update({company_transaction_id:companyTransaction.id});
        operationInsatance.company_transaction_id=companyTransaction.id;
        await operationInsatance.save();
        await targetCompanyWallet.update({
          balance: targetCompanyWallet.balance + amount,
        });
        succeed=true;
        break;
      case "charging":
        const {charging_point_id} = operationInsatance;
        const chargingPointTransaction=await ChargingPointTransaction.create({
            amount,
            date:transaction.date,
            charging_point_id,
            charging_id:operationInsatance.id
        });
        await operationInsatance.update({charging_point_transaction_id:chargingPointTransaction.id});
        await targetWallet.update({balance:targetWallet.balance + amount});
        succeed=true;
        break;
        default:
        throw new BadRequestError("operation not provided");
    }
    return succeed;
  }
}

module.exports = TransactionBuilder;


//Ch transaction => 1731233645000
//transaction => 1731233645000
//ch => 
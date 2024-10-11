const transactionConfig = require("../../config/transactionConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const ChargingPointTransaction = require("../../models/ChargingPointTransaction");
const Company = require("../../models/Company");
const CompanyTransaction = require("../../models/CompanyTransaction");
const CompanyWallet = require("../../models/CompanyWallet");
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
    const userWallet = await req.user.getWallet();
    const customData = {
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
    console.log(transaction);
    const sourceWallet = await transaction.getSourceWallet();
    // const target=await operationInsatance.getTarget();
    // const targetWallet=await operationInsatance.getTargetWallet();
    switch (operation_type) {
      case "transfer":
        const { target_wallet_id } = operationInsatance;
        const targetWallet = await Wallet.findByPk(target_wallet_id);
        await sourceWallet.update({ balance: sourceWallet.balance - amount });
        await targetWallet.update({ balance: targetWallet.balance + amount });
        succeed=true;
        break;
      case "payment":
        const { compoany_wallet_id,company_id } = operationInsatance;
        // const companyInstance=await Company.findByPk(company_id);
        const targetCompanyWallet = await CompanyWallet.findByPk(
          compoany_wallet_id
        );
        await sourceWallet.update({ balance: sourceWallet.balance - amount });
        const companyTransaction=await CompanyTransaction.create({ 
            amount,
            old_balance:targetCompanyWallet.balance,
            current_balance:targetCompanyWallet.balance + amount,
            date:transaction.date,
            company_id,
            compoany_wallet_id,
            payment_id:operationInsatance.id
         });
        await operationInsatance.update({company_transaction_id:companyTransaction.id});
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
        await sourceWallet.update({balance:sourceWallet.balance + amount});
        succeed=true;
        break;
        default:
        throw new BadRequestError("operation not provided");
    }
    return succeed;
  }
}

module.exports = TransactionBuilder;

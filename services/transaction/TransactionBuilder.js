const transactionConfig = require("../../config/transactionConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const Charging = require("../../models/Charging");
const ChargingPointTransaction = require("../../models/ChargingPointTransaction");
const Company = require("../../models/Company");
const CompanyTransaction = require("../../models/CompanyTransaction");
const CompanyWallet = require("../../models/CompanyWallet");
const Payment = require("../../models/Payment");
const Transaction = require("../../models/Transaction");
const Transfer = require("../../models/Transfer");
const User = require("../../models/User");
const Wallet = require("../../models/Wallet");

class TransactionBuilder {
  constructor() {
    return (TransactionBuilder.instance ??= this);
  }

  async build(req, operationType) {
    let operation;
    if(operationType=='transfer'){
        const { target_phone, info, amount } = req.body;
        const sourceUser=req.user;
        const sourceUserWallet=await sourceUser.getWallet();
        if (sourceUserWallet.balance < amount) {
          throw new BadRequestError("Your Balance Not Enough");
        }
        const targetUser = await User.findOne({
          where: { phone: target_phone },
        });
        const targetUserWallet=await targetUser.getWallet();
        const transactionData = {
          amount,
          verification_code: this.#generateVerificationCode(),
          wallet_id: sourceUserWallet.id,
          date: Date.now(),
          user_id: sourceUser.id,
          target_user_id:targetUser.id,
          target_wallet_id:targetUserWallet.id,
          source_user_old_balance:sourceUserWallet.balance,
          target_user_old_balance:targetUserWallet.balance,
          source_user_current_balance:sourceUserWallet.balance - amount,
          target_user_current_balance:targetUserWallet.balance + amount,
        };
        const transferOperationData = {
          wallet_id: sourceUserWallet.id,
          user_id: sourceUser.id,
          target_id: targetUser.id,
          target_wallet_id: targetUserWallet.id,
          info,
        };
        operation = await Transfer.create(transferOperationData, { customData:transactionData });
    }else if(operationType=='payment'){
        const { target_company_phone, amount } = req.body;
        const sourceUser=req.user;
        const sourceUserWallet=await sourceUser.getWallet();
        if (sourceUserWallet.balance < amount) {
          throw new BadRequestError("Your Balance Not Enough");
        }
        const targetCompany = await Company.findOne({
          where: { phone: target_company_phone },
        });
        const transactionData = {
          amount,
          verification_code: this.#generateVerificationCode(),
          wallet_id: sourceUserWallet.id,
          date: Date.now(),
          user_id: sourceUser.id,
          source_user_old_balance:sourceUserWallet.balance,
          source_user_current_balance:sourceUserWallet.balance - amount,
        };
        const paymentOperationData = {
          wallet_id: sourceUserWallet.id,
          user_id: sourceUser.id,
          company_id: targetCompany.id,
          company_wallet_id: targetCompany.company_wallet_id,
        };
        operation = await Payment.create(paymentOperationData, { customData:transactionData });
      }else if(operationType=='charging'){
        const { target_phone, amount } = req.body;
        const chargingPoint=req.user;
        if(chargingPoint.wasPending){
          throw BadRequestError("This ChargingPoint Was Pending By System Owner, so you can't be able to perform charging operations");
        }
        const targetUser = await User.findOne({
          where: { phone: target_phone },
        });
        const targetUserWallet=await targetUser.getWallet();
        const transactionData = {
          amount,
          verification_code: this.#generateVerificationCode(),
          date: Date.now(),
          target_user_id: targetUser.id,
          target_wallet_id: targetUserWallet.id,
          target_user_old_balance:targetUserWallet.balance,
          target_user_current_balance:targetUserWallet.balance + amount,
        };
        const chargingOperationData = {
          wallet_id: targetUserWallet.id,
          user_id: targetUser.id,
          charging_point_id: chargingPoint.id,
        };
        operation = await Charging.create(chargingOperationData, {
          customData:transactionData,
        });
    }else{
      throw new BadRequestError("operation not provided");
    }

    return operation;
  }

  async verify(req) {
    const { transaction_id, verification_code } = req.body;
    const transaction = await Transaction.scope('withVerificationCode').findByPk(transaction_id);
    if (transaction.verified_at) {
      throw new BadRequestError("Transaction Already verified");
    }
    const expiresAt = transaction.date + 5 * 60 * 1000;
    if (Date.now() > expiresAt) {
      throw new BadRequestError("Request Timeout");
    }
    if (transaction.verification_code != verification_code) {
      throw new BadRequestError("Invalid Verification Code");
    }
    await transaction.update({ verified_at: Date.now() });
    return transaction;
  }

  async perform(transaction) {
    let succeed = false;
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
        succeed = true;
        break;
      case "payment":
        const { company_wallet_id, company_id } = operationInsatance;
        // const companyInstance=await Company.findByPk(company_id);
        console.log({ operationInsatance });
        const targetCompanyWallet = await CompanyWallet.findByPk(
          company_wallet_id
        );
        await sourceWallet.update({ balance: sourceWallet.balance - amount });
        const companyTransaction = await CompanyTransaction.create({
          amount,
          old_balance: targetCompanyWallet.balance,
          current_balance: targetCompanyWallet.balance + amount,
          date: transaction.date,
          company_id,
          company_wallet_id,
          payment_id: operationInsatance.id,
        });
        // await operationInsatance.update({company_transaction_id:companyTransaction.id});
        operationInsatance.company_transaction_id = companyTransaction.id;
        await operationInsatance.save();
        await targetCompanyWallet.update({
          balance: targetCompanyWallet.balance + amount,
        });
        succeed = true;
        break;
      case "charging":
        const { charging_point_id } = operationInsatance;
        const chargingPointTransaction = await ChargingPointTransaction.create({
          amount,
          date: transaction.date,
          charging_point_id,
          charging_id: operationInsatance.id,
        });
        await operationInsatance.update({
          charging_point_transaction_id: chargingPointTransaction.id,
        });
        await targetWallet.update({ balance: targetWallet.balance + amount });
        succeed = true;
        break;
      default:
        throw new BadRequestError("operation not provided");
    }
    return succeed;
  }

  #generateVerificationCode(){
    const code=Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  }
}

module.exports = TransactionBuilder;

//Ch transaction => 1731233645000
//transaction => 1731233645000
//ch =>

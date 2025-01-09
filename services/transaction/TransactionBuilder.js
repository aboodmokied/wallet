const transactionConfig = require("../../config/transactionConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const ValidationError = require("../../Errors/ErrorTypes/ValidationError");
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
    if (operationType == "transfer") {
      const { target_phone, info, amount } = req.body;
      const sourceUser = req.user;
      const sourceUserWallet = await sourceUser.getWallet();
      if (sourceUserWallet.balance < amount) {
        throw new BadRequestError("Your Balance Not Enough");
      }
      const targetUser = await User.findOne({
        where: { phone: target_phone },
      });
      const targetUserWallet = await targetUser.getWallet();
      const transactionData = {
        amount,
        verification_code: this.#generateVerificationCode(),
        // wallet_id: sourceUserWallet.id,
        date: Date.now(),
        source_id: sourceUser.id,
        target_id: targetUser.id,
        // user_id: sourceUser.id,
        // target_user_id:targetUser.id,
        // target_wallet_id:targetUserWallet.id,
        // source_user_old_balance:sourceUserWallet.balance,
        // target_user_old_balance:targetUserWallet.balance,
        // source_user_current_balance:sourceUserWallet.balance - amount,
        // target_user_current_balance:targetUserWallet.balance + amount,
      };
      const transferOperationData = {
        source_user_wallet_id: sourceUserWallet.id,
        source_user_id: sourceUser.id,
        target_user_id: targetUser.id,
        target_user_wallet_id: targetUserWallet.id,
        info,
        // source_user_old_balance:sourceUserWallet.balance,
        // target_user_old_balance:targetUserWallet.balance,
        // source_user_current_balance:sourceUserWallet.balance - amount,
        // target_user_current_balance:targetUserWallet.balance + amount,
      };
      operation = await Transfer.create(transferOperationData, {
        customData: transactionData,
      });
    } else if (operationType == "payment") {
      const { target_company_phone, amount } = req.body;
      const sourceUser = req.user;
      const sourceUserWallet = await sourceUser.getWallet();
      if (sourceUserWallet.balance < amount) {
        throw new BadRequestError("Your Balance Not Enough");
      }
      const targetCompany = await Company.findOne({
        where: { phone: target_company_phone },
      });
      // const companyWallet = await targetCompany.getCompanyWallet();
      const transactionData = {
        amount,
        verification_code: this.#generateVerificationCode(),
        date: Date.now(),
        source_id: sourceUser.id,
        target_id: targetCompany.id,
      };
      const paymentOperationData = {
        user_wallet_id: sourceUserWallet.id,
        user_id: sourceUser.id,
        company_id: targetCompany.id,
        company_wallet_id: targetCompany.company_wallet_id,
        // user_old_balance:sourceUserWallet.balance,
        // user_current_balance:sourceUserWallet.balance - amount,
        // company_old_balance:companyWallet.balance,
        // company_current_balance:companyWallet.balance + amount
      };
      operation = await Payment.create(paymentOperationData, {
        customData: transactionData,
      });
    } else if (operationType == "charging") {
      const { target_phone, amount } = req.body;
      const chargingPoint = req.user;
      if (chargingPoint.wasPending) {
        throw BadRequestError(
          "This ChargingPoint Was Pending By System Owner, so you can't be able to perform charging operations"
        );
      }
      const targetUser = await User.findOne({
        where: { phone: target_phone },
      });
      const targetUserWallet = await targetUser.getWallet();
      const transactionData = {
        amount,
        verification_code: this.#generateVerificationCode(),
        date: Date.now(),
        source_id: chargingPoint.id,
        target_id: targetUser.id,
      };
      const chargingOperationData = {
        user_wallet_id: targetUserWallet.id,
        user_id: targetUser.id,
        charging_point_id: chargingPoint.id,
        // user_old_balance:sourceUserWallet.balance,
        // user_current_balance:sourceUserWallet.balance - amount,
      };
      operation = await Charging.create(chargingOperationData, {
        customData: transactionData,
      });
    } else {
      throw new BadRequestError("operation not provided");
    }

    return operation;
  }
  async #validateAmountIsEnough(transaction) {
    const { source_id, operation_type, amount } = transaction;
    if (operation_type == "transfer" || operation_type == "payment") {
      const sourceUser = await User.findByPk(source_id);
      const sourceWallet = await sourceUser.getWallet();
      if (amount > sourceWallet.balance) {
        throw new BadRequestError("Your Balance Not Enough");
      }
    }
  }
  async verify(req) {
    const { transaction_id, verification_code } = req.body;
    const transaction = await Transaction.scope(
      "withVerificationCode"
    ).findByPk(transaction_id);
    if (transaction.verified_at) {
      throw new BadRequestError("Transaction Already verified");
    }
    const expiresAt = transaction.date + 5 * 60 * 1000;
    if (Date.now() > expiresAt) {
      throw new BadRequestError("Request Timeout");
    }
    if (transaction.verification_code != verification_code) {
      // throw new BadRequestError("Invalid Verification Code");
      throw new ValidationError([
        { path: "verification_code", msg: "Invalid Verification Code" },
      ]);
    }
    await this.#validateAmountIsEnough(transaction); // if there is any changies occured on balance before verification
    await transaction.update({ verified_at: Date.now() });
    return transaction;
  }

  async perform(transaction) {
    let succeed = false;
    const { operation_type, operation_id, amount } = transaction;
    const OperationModel = transactionConfig.operations[operation_type]?.model;
    const operationInsatance = await OperationModel.findByPk(operation_id);
    // const sourceWallet = await transaction.getSourceWallet();
    // const targetWallet = await transaction.getTargetWallet();
    let sourceWallet;
    let targetWallet;
    // const target=await operationInsatance.getTarget();
    // const targetWallet=await operationInsatance.getTargetWallet();
    switch (operation_type) {
      case "transfer":
        const { target_user_wallet_id, source_user_wallet_id } =
          operationInsatance;
        // const targetWallet = await Wallet.findByPk(target_wallet_id);
        sourceWallet = await Wallet.findByPk(source_user_wallet_id);
        targetWallet = await Wallet.findByPk(target_user_wallet_id);
        // update operation instance
        await operationInsatance.update({
          source_user_old_balance: sourceWallet.balance,
          target_user_old_balance: targetWallet.balance,
          source_user_current_balance: sourceWallet.balance - amount,
          target_user_current_balance: targetWallet.balance + amount,
        });
        // update wallets
        await sourceWallet.update({ balance: sourceWallet.balance - amount });
        await targetWallet.update({ balance: targetWallet.balance + amount });
        succeed = true;
        break;
      case "payment":
        const { company_wallet_id, user_wallet_id } = operationInsatance;
        sourceWallet = await Wallet.findByPk(user_wallet_id);
        targetWallet = await CompanyWallet.findByPk(company_wallet_id);
        // update operation instance
        await operationInsatance.update({
          user_old_balance: sourceWallet.balance,
          user_current_balance: sourceWallet.balance - amount,
          company_old_balance: targetWallet.balance,
          company_current_balance: targetWallet.balance + amount,
        });
        // update wallets
        await sourceWallet.update({ balance: sourceWallet.balance - amount });
        await targetWallet.update({
          balance: targetWallet.balance + amount,
        });

        succeed = true;
        break;
      case "charging":
        const { user_wallet_id: u_w_id } = operationInsatance;
        targetWallet = await Wallet.findByPk(u_w_id);
        // update operation instance
        await operationInsatance.update({
          user_old_balance: targetWallet.balance,
          user_current_balance: targetWallet.balance + amount,
        });
        // update wallets
        await targetWallet.update({ balance: targetWallet.balance + amount });
        succeed = true;
        break;
      default:
        throw new BadRequestError("operation not provided");
    }
    return succeed;
  }

  #generateVerificationCode() {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  }
}

module.exports = TransactionBuilder;

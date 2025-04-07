const { Op } = require("sequelize");
const transactionConfig = require("../../config/transactionConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");
const TransactionBuilder = require("../../services/transaction/TransactionBuilder");
const tryCatch = require("../../util/tryCatch");
const Company = require("../../models/Company");
const CompanyTransaction = require("../../models/CompanyTransaction");
const Payment = require("../../models/Payment");
const ChargingPointTransaction = require("../../models/ChargingPointTransaction");
const AuthorizationError = require("../../Errors/ErrorTypes/AuthorizationError");
const QueryFeatures = require("../../util/QueryFeatures");
const Application = require("../../Application");
const ChargingPoint = require("../../models/ChargingPoint");

const transactionBuilder = new TransactionBuilder();
exports.transfer = tryCatch(async (req, res, next) => {
  const operation = await transactionBuilder.build(req, "transfer");
  const transaction = await Transaction.scope(
    "withVerificationCode"
  ).findByPk(operation.transaction_id);
  // send verification code
  const verificationCode=transaction.verification_code;
  delete transaction.verification_code;
  req.user.verifyTransaction({subject: "Transfer Verification",code:verificationCode});
  const { info } = operation;
  const opertaionInfo = {
    info,
    // oldBalance: source_user_old_balance,
    // newBalance: source_user_current_balance,
  };
  //   const tragetUser = await transaction.getTargetUser();
  const users = await transaction.getUsers();
  res.status(200).send({
    status: true,
    result: {
      message: "Operation Succeed, Verify it.",
      opertaionInfo,
      transaction,
      users,
    },
  });
});

exports.payment = tryCatch(async (req, res, next) => {
  const operation = await transactionBuilder.build(req, "payment");
  const transaction = await Transaction.scope(
    "withVerificationCode"
  ).findByPk(operation.transaction_id);
  // send verification code
  const verificationCode=transaction.verification_code;
  delete transaction.verification_code;
  req.user.verifyTransaction({subject: "Payment Verification",code:verificationCode});
  const {} = operation;
  const opertaionInfo = {};
  const users = await transaction.getUsers();
  res.status(200).send({
    status: true,
    result: {
      message: "Operation Succeed, Verify it.",
      opertaionInfo,
      transaction,
      users,
    },
  });
});
exports.charging = tryCatch(async (req, res, next) => {
  const operation = await transactionBuilder.build(req, "charging");
  const transaction = await Transaction.scope(
    "withVerificationCode"
  ).findByPk(operation.transaction_id);
  // send verification code
  const verificationCode=transaction.verification_code;
  delete transaction.verification_code;
  req.user.verifyTransaction({subject: "Charging Verification",code:verificationCode});
  const {} = operation;
  const opertaionInfo = {};
  const users = await transaction.getUsers();
  res.status(200).send({
    status: true,
    result: {
      message: "Operation Succeed, Verify it.",
      opertaionInfo,
      transaction,
      users,
    },
  });
});

// exports.charging=tryCatch(async(req,res,next)=>{
//     const opertaion=await transactionBuilder.build(req,'charging');
//     const transaction=await Transaction.findByPk(opertaion.transaction_id);
//     res.status(200).send({status:true,result:{
//         message:'Operation Succeed, Verify it.',
//         opertaion,
//         transaction
//     }});
// });

exports.show = tryCatch(async (req, res, next) => {
  const { transaction_id } = req.params;
  const transaction = await Transaction.findByPk(transaction_id);
  const operation = await transaction.getOperation();
  const users = await transaction.getUsers();
  // const {operation_type,operation_id}=transaction;
  // const operationModel=transactionConfig.operations[operation_type]?.model;
  // const opertaionObject=await operationModel.findByPk(operation_id);
  res.status(200).send({
    status: true,
    result: {
      transaction,
      operation,
      users,
    },
  });
});

exports.verifyTransaction = tryCatch(async (req, res, next) => {
  const transaction = await transactionBuilder.verify(req);
  const succeed = await transactionBuilder.perform(transaction);
  if (!succeed) {
    throw new Error("Server Error, Something went wrong.");
  }
  // const operationModel=transactionConfig.operations[transaction.operation_type]?.model;
  const operation = await transaction.getOperation();
  res.status(200).send({
    status: true,
    result: {
      message: "Transaction Verified Succefully",
      operation,
      transaction,
    },
  });
});

// exports.userTransactions = tryCatch(async (req, res, next) => {
//   const { user_id } = req.params;
//   const user = await User.findByPk(user_id);
//   const sourceTransactions = await user.getSourceTransactions({
//     where: { verified_at: { [Op.ne]: null } },
//   });
//   const targetTransactions = await user.getTargetTransactions({
//     where: { verified_at: { [Op.ne]: null } },
//   });
//   res.status(200).send({
//     status: true,
//     result: {
//       user,
//       transactions: {
//         inTransactions: targetTransactions,
//         outTransactions: sourceTransactions,
//       },
//     },
//   });
// });

// exports.companyTransactions = tryCatch(async (req, res, next) => {
//   const { company_id } = req.params;
//   const company = await Company.findByPk(company_id);
//   // const companyTransactions=await company.getCompanyTransactions({include:{model:Payment}});
//   const companyTransactions = await company.getCompanyTransactions();
//   res.status(200).send({
//     status: true,
//     result: {
//       company,
//       transactions: companyTransactions,
//     },
//   });
// });

// exports.showCompanyTransaction = tryCatch(async (req, res, next) => {
//   const { transaction_id } = req.params;
//   const companyTransaction = await CompanyTransaction.findByPk(transaction_id);
//   const operation = await companyTransaction.getPayment();
//   res
//     .status(200)
//     .send({
//       status: true,
//       result: { transaction: companyTransaction, operation },
//     });
// });

exports.currentUserTransactions = tryCatch(async (req, res, next) => {
  const user = req.user;
  let whereOptions = {};
  if (user.guard == "user") {
    whereOptions = {
      [Op.or]: [
        {
          [Op.and]: [
            { operation_type: "transfer" },
            { [Op.or]: [{ source_id: user.id }, { target_id: user.id }] },
          ],
        },
        {
          [Op.and]: [{ operation_type: "payment" }, { source_id: user.id }],
        },
        {
          [Op.and]: [{ operation_type: "charging" }, { target_id: user.id }],
        },
      ],
      verified_at: { [Op.ne]: null },
    };
  } else if (user.guard == "company") {
    whereOptions = {
      operation_type: "payment",
      target_id: user.id,
      verified_at: { [Op.ne]: null },
    };
  } else if (user.guard == "chargingPoint") {
    whereOptions = {
      operation_type: "charging",
      source_id: user.id,
      verified_at: { [Op.ne]: null },
    };
  }
  const queryFeatures = new QueryFeatures(req);
  // const { data, responseMetaData } = await queryFeatures.findAllWithFeatures(
  //   Transaction,
  //   {
  //     ...whereOptions,
  //   },
  //   {
  //     include: [
  //       {
  //         model: User,
  //         as: 'sourceUser',
  //         required: false,
  //         where: Application.connection.literal("operation_type = 'transfer' OR operation_type = 'payment'")
  //       },
  //       {
  //         model: User,
  //         as: 'targetUser',
  //         required: false,
  //         where: Application.connection.literal("operation_type = 'transfer' OR operation_type = 'charging'")
  //       },
  //       {
  //         model: Company,
  //         as: 'targetCompany',
  //         required: false,
  //         where: Application.connection.literal("operation_type = 'payment'")
  //       },
  //       {
  //         model: ChargingPoint,
  //         as: 'sourceChargingPoint',
  //         required: false,
  //         where: Application.connection.literal("operation_type = 'charging'")
  //       },
  //     ]
  //   }
  // );
  const { data, responseMetaData } = await queryFeatures.findAllWithFeatures(
    Transaction,
    {
      ...whereOptions,
    }
  );
  const transactionsWithUsers = [];
  for (let transaction of data) {
    const users = await transaction.getUsers();
    const transactionWithUsers = { data: transaction, users };
    transactionsWithUsers.push(transactionWithUsers);
  }
  // const transactionsWithUsers = data.map(async (trs) => {
  //   const { sourceUser, targetUser } = await trs.getUsers();
  //   trs.sourceUser = sourceUser;
  //   trs.targetUser = targetUser;
  //   return trs;
  // });

  res.status(200).send({
    status: true,
    result: {
      transactions: transactionsWithUsers,
      responseMetaData,
    },
  });
});

exports.showCurrentUserTransaction = tryCatch(async (req, res, next) => {
  const { transaction_id } = req.params;
  const transaction = await Transaction.findByPk(transaction_id);
  const operation = await transaction.getOperation();
  const users = await transaction.getUsers();
  const { sourceUser, targetUser } = users;
  const { id, guard } = req.user;
  let yourIdentity;
  if (id == sourceUser.id && guard == sourceUser.guard) {
    yourIdentity = "sender";
    const operationInfo = {};
    if (transaction.operation_type == "transfer") {
      const { source_user_old_balance, source_user_current_balance, info } =
        operation;
      operationInfo.oldBalance = source_user_old_balance;
      operationInfo.currentBalance = source_user_current_balance;
      operationInfo.info = info;
    } else if (transaction.operation_type == "payment") {
      const { user_old_balance, user_current_balance } = operation;
      operationInfo.oldBalance = user_old_balance;
      operationInfo.currentBalance = user_current_balance;
    }
    return res.status(200).send({
      status: true,
      result: {
        transaction,
        operationInfo,
        users,
        yourIdentity,
      },
    });
  }
  if (id == targetUser.id && guard == targetUser.guard) {
    yourIdentity = "receiver";
    const operationInfo = {};
    if (transaction.operation_type == "transfer") {
      const { target_user_old_balance, target_user_current_balance, info } =
        operation;
      operationInfo.oldBalance = target_user_old_balance;
      operationInfo.currentBalance = target_user_current_balance;
      operationInfo.info = info;
    } else if (transaction.operation_type == "payment") {
      const { company_old_balance, company_current_balance } = operation;
      operationInfo.oldBalance = company_old_balance;
      operationInfo.currentBalance = company_current_balance;
    } else if (transaction.operation_type == "charging") {
      const { user_old_balance, user_current_balance } = operation;
      operationInfo.oldBalance = user_old_balance;
      operationInfo.currentBalance = user_current_balance;
    }
    return res.status(200).send({
      status: true,
      result: {
        transaction,
        operationInfo,
        users,
        yourIdentity,
      },
    });
  }

  throw new AuthorizationError();
});

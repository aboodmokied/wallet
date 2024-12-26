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
  const opertaion = await transactionBuilder.build(req, "transfer");
  const transaction = await Transaction.findByPk(opertaion.transaction_id);
//   const tragetUser = await transaction.getTargetUser();
  const users=await opertaion.getUsers();  
  res.status(200).send({
    status: true,
    result: {
      message: "Operation Succeed, Verify it.",
      opertaion,
      transaction,
      users,
    },
  });
});

exports.payment = tryCatch(async (req, res, next) => {
  const opertaion = await transactionBuilder.build(req, "payment");
  const transaction = await Transaction.findByPk(opertaion.transaction_id);
  const users=await opertaion.getUsers();
  res.status(200).send({
    status: true,
    result: {
      message: "Operation Succeed, Verify it.",
      opertaion,
      transaction,
      users
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
  const users=await operation.getUsers();
  // const {operation_type,operation_id}=transaction;
  // const operationModel=transactionConfig.operations[operation_type]?.model;
  // const opertaionObject=await operationModel.findByPk(operation_id);
  res.status(200).send({
    status: true,
    result: {
      transaction,
      operation,
      users
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
  const whereOptions = {
  [Op.or]: [{ source_id: user.id }, { target_id: user.id }],
  verified_at: { [Op.ne]: null },
  };
  const queryFeatures = new QueryFeatures(req);
  const { data, responseMetaData } = await queryFeatures.findAllWithFeatures(
    Transaction,
    {
      ...whereOptions,
    },
    {
      include: [
        {
          model: User,
          as: 'sourceUser',
          required: false,
          where: Application.connection.literal("operation_type = 'transfer' OR operation_type = 'payment'")
        },
        {
          model: User,
          as: 'targetUser',
          required: false,
          where: Application.connection.literal("operation_type = 'transfer' OR operation_type = 'charging'")
        },
        {
          model: Company,
          as: 'targetCompany',
          required: false,
          where: Application.connection.literal("operation_type = 'payment'")
        },
        {
          model: ChargingPoint,
          as: 'sourceChargingPoint',
          required: false,
          where: Application.connection.literal("operation_type = 'charging'")
        },
      ]
    }
  );
  res.status(200).send({
    status: true,
    result: {
      transactions: data,
      responseMetaData,
    },
  });
});

exports.showCurrentUserTransaction = tryCatch(async (req, res, next) => {
  const { guard } = req.user;
  const { transaction_id } = req.params;
  let transaction;
  let operation;
  let transactionUserId;
  if (guard == "user") {
    transaction = await Transaction.findByPk(transaction_id);
    operation = await transaction.getOperation();
    transactionUserId = transaction.user_id ?? transaction.target_user_id;
  } else if (guard == "company") {
    transaction = await CompanyTransaction.findByPk(transaction_id);
    operation = await transaction.getPayment();
    transactionUserId = transaction.company_id;
  } else if (guard == "chargingPoint") {
    transaction = await ChargingPointTransaction.findByPk(transaction_id);
    operation = await transaction.getCharging();
    transactionUserId = transaction.charging_point_id;
  } else {
    throw new BadRequestError("This type of users has no transactions");
  }
  if (req.user.id != transactionUserId) {
    throw new AuthorizationError();
  }
  const users = await operation.getUsers();
  res.status(200).send({
    status: true,
    result: {
      transaction,
      operation,
      users,
    },
  });
});

// in sequelize if i have Transaction model each transaction has operation_type with source_id and target_id,
// the operations are Transfer, Charging and Payment each Operation has its own model,
// i need findAll transaction and include the users for each transaction according to
// its operation_type and source_id target_id, the users in the system are User, Company and Charging Point
// if the operation_type is Payment source_id refers to User and target_id refers to Company,
// if the operation_type is Transfer source_id refers to User and target_id refers to another User (i need to destingushe between the two users),
// if the operation_type is Charging source_id refers to ChargingPoint and target_id refers to User,

const { Op } = require("sequelize");
const Transaction = require("../../models/Transaction");
const tryCatch = require("../../util/tryCatch");
const QueryFeatures = require("../../util/QueryFeatures");
const CompanyTransaction = require("../../models/CompanyTransaction");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const ChargingPointTransaction = require("../../models/ChargingPointTransaction");
const authConfig = require("../../config/authConfig");
const AuthorizationError = require("../../Errors/ErrorTypes/AuthorizationError");

const getDates = (date, from, to) => {
  if (Number(from) > Number(to)) {
    throw new BadRequestError("timing is not valid");
  }
  const targetDate = new Date();
  if (date) {
    const splittedDate = date.split("-");
    const year = splittedDate[0];
    const month = splittedDate[1];
    const day = splittedDate[2];
    console.log({date});
    targetDate.setUTCFullYear(year, month - 1, Number(day));
  }
  targetDate.setUTCHours(0, 0, 0, 0);

  const startDateInUTC = new Date(targetDate);
  startDateInUTC.setUTCHours(Number(from), 0, 0, 0);

  const endtDateInUTC = new Date(targetDate);
  endtDateInUTC.setUTCHours(Number(to), 59, 59, 999);

  const startDateMillS = startDateInUTC.getTime();
  const endDateMillS = endtDateInUTC.getTime();

  const startDateInLocalTime = startDateInUTC.toLocaleString();
  const endtDateInLocalTime = endtDateInUTC.toLocaleString();

  return {
    startDateInUTC,
    endtDateInUTC,
    startDateMillS,
    endDateMillS,
    startDateInLocalTime,
    endtDateInLocalTime,
  };
};

exports.dailySystemTransactions = tryCatch(async (req, res, next) => {
  const { date, from = 0, to = 23, dateFiltering } = req.query;
  let timingData={};
  const whereOptions={};
  if(dateFiltering){
    const {
      startDateMillS,
      endDateMillS,
      startDateInUTC,
      endtDateInUTC,
      startDateInLocalTime,
      endtDateInLocalTime,
    } = getDates(date?.toString(), from, to);
    whereOptions.date={ [Op.between]: [startDateMillS, endDateMillS] }
    timingData={
      startDateInUTC,
      endtDateInUTC,
      startDateMillS,
      endDateMillS,
      startDateInLocalTime,
      endtDateInLocalTime
    };
  }
  
  const queryFeatures = new QueryFeatures(req);
  const transactions = await queryFeatures.findAllWithFeatures(Transaction, {
    verified_at: { [Op.ne]: null },
    ...whereOptions
  });
  return res.render("wallet/systemOwner/transactions-report", {
    pageTitle: "Transactions Report",
    transactions: transactions.data,
    responseMetaData: transactions.responseMetaData,
    ...timingData,
  });
});


exports.dailySystemUserTransactions = tryCatch(async (req, res, next) => {
  const { date, from = 0, to = 23, dateFiltering } = req.query;
  const { guard, user_id } = req.params;
  const guardObj = authConfig.guards[guard];
  const model = authConfig.providers[guardObj.provider]?.model;
  const user = await model.findByPk(user_id);
  let transactionModel;
  let whereOptions = {};
  if (guard == "user") {
    transactionModel = Transaction;
    whereOptions = {
      [Op.or]: [{ user_id: user.id }, { target_user_id: user.id }],
      verified_at: { [Op.ne]: null },
    };
  } else if (guard == "company") {
    transactionModel = CompanyTransaction;
    whereOptions = { company_id: user.id };
  } else if (guard == "chargingPoint") {
    transactionModel = ChargingPointTransaction;
    whereOptions = { charging_point_id: user.id };
  } else {
    throw new BadRequestError("this guard not able to create transactions");
  }
  let timingData={};
  const dateWhereOptions={};
  if(dateFiltering){
    const {
      startDateMillS,
      endDateMillS,
      startDateInUTC,
      endtDateInUTC,
      startDateInLocalTime,
      endtDateInLocalTime,
    } = getDates(date?.toString(), from, to);
    dateWhereOptions.date={ [Op.between]: [startDateMillS, endDateMillS] }
    timingData={
      startDateInUTC,
      endtDateInUTC,
      startDateMillS,
      endDateMillS,
      startDateInLocalTime,
      endtDateInLocalTime
    };
  }
  const queryFeatures = new QueryFeatures(req);
  const transactions = await queryFeatures.findAllWithFeatures(
    transactionModel,
    {
      ...whereOptions,
      ...dateWhereOptions
    }
  );
  return res.render("wallet/systemOwner/user-transactions-report", {
    pageTitle: "User Transactions Report",
    transactionUser:user,
    transactions: transactions.data,
    responseMetaData: transactions.responseMetaData,
    ...timingData
  });
});


exports.dailyMyChPointTransactions = tryCatch(async (req, res, next) => {
  const { date, from = 0, to = 23, dateFiltering } = req.query;
  const { guard } = req.user;
  if(guard!=='chargingPoint'){
    throw AuthorizationError('Forbidden, this proccess allowed only for charging points');
  }
  const user = req.user;
  let timingData={};
  const dateWhereOptions={};
  if(dateFiltering){
    const {
      startDateMillS,
      endDateMillS,
      startDateInUTC,
      endtDateInUTC,
      startDateInLocalTime,
      endtDateInLocalTime,
    } = getDates(date?.toString(), from, to);
    dateWhereOptions.date={ [Op.between]: [startDateMillS, endDateMillS] }
    timingData={
      startDateInUTC,
      endtDateInUTC,
      startDateMillS,
      endDateMillS,
      startDateInLocalTime,
      endtDateInLocalTime
    };
  }
  const queryFeatures = new QueryFeatures(req);
  const transactions = await queryFeatures.findAllWithFeatures(
    ChargingPointTransaction,
    {
      charging_point_id: user.id,
      ...dateWhereOptions
    }
  );
  return res.render("wallet/systemOwner/user-transactions-report", {
    pageTitle: "Charging Point Transactions Report",
    transactionUser:user,
    transactions: transactions.data,
    responseMetaData: transactions.responseMetaData,
    ...timingData
  });
});

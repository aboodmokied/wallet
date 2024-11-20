const { Op } = require("sequelize");
const Transaction = require("../../models/Transaction");
const tryCatch = require("../../util/tryCatch");
const QueryFeatures = require("../../util/QueryFeatures");
const CompanyTransaction = require("../../models/CompanyTransaction");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const ChargingPointTransaction = require("../../models/ChargingPointTransaction");

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
    targetDate.setFullYear(year, month - 1, day);
  }
  targetDate.setUTCHours(0, 0, 0, 0);

  const startDate = new Date(targetDate);
  startDate.setUTCHours(Number(from), 0, 0, 0);

  const endDate = new Date(targetDate);
  endDate.setUTCHours(Number(to), 59, 59, 999);

  const startDateMillS = startDate.getTime();
  const endDateMillS = endDate.getTime();

  const startDateInLocalTime = startDate.toLocaleString();
  const endtDateInLocalTime = endDate.toLocaleString();

  return {
    startDate,
    endDate,
    startDateMillS,
    endDateMillS,
    startDateInLocalTime,
    endtDateInLocalTime,
  };
};



exports.dailySystemTransactions = tryCatch(async (req, res, next) => {
  const { date, from = 0, to = 23 } = req.query;
  const {
    startDateMillS,
    endDateMillS,
    startDate,
    endDate,
    startDateInLocalTime,
    endtDateInLocalTime,
  } = getDates(date?.toString(), from, to);
  const queryFeatures = new QueryFeatures(req);
  const transactions = await queryFeatures.findAllWithFeatures(Transaction, {
    date: { [Op.between]: [startDateMillS, endDateMillS] },
    verified_at: { [Op.ne]: null },
  });
  return res.render('wallet/systemOwner/transactions-report',{
      pageTitle:'Transactions Report',
      transactions:transactions.data,
      responseMetaData:transactions.responseMetaData,
      startDateInLocalTime,
      endtDateInLocalTime,
      startDateInUTC:startDate,
      endtDateInUTC:endDate,
  });
});
exports.dailySystemUserTransactions = tryCatch(async (req, res, next) => {
  const { date, from = 0, to = 23 } = req.query;
  const { guard, user_id } = req.params;
  let transactionModel;
  let whereOptions = {};
  if (guard == "user") {
    transactionModel = Transaction;
    whereOptions = {
      [Op.or]: [{ user_id }, { target_user_id: user_id }],
      verified_at: { [Op.ne]: null },
    };
  } else if (guard == "company") {
    transactionModel = CompanyTransaction;
    whereOptions = { company_id: user_id };
  } else if (guard == "chargingPoint") {
    transactionModel = ChargingPointTransaction;
    whereOptions = { charging_point_id: user_id };
  } else {
    throw new BadRequestError("this guard not able to create transactions");
  }
  const {
    startDateMillS,
    endDateMillS,
    startDate,
    endDate,
    startDateInLocalTime,
    endtDateInLocalTime,
  } = getDates(date, from, to);
  const queryFeatures = new QueryFeatures(req);
  const transactions = await queryFeatures.findAllWithFeatures(
    transactionModel,
    {
      date: { [Op.between]: [startDateMillS, endDateMillS] },
      ...whereOptions,
    }
  );
  // return res.send({
  //   status: true,
  //   result: {
  //     transactions,
  //     startDateInLocalTime,
  //     endtDateInLocalTime,
  //     startDateInUTC:startDate,
  //     endtDateInUTC:endDate,
  //   },
  // });
  return res.render('wallet/systemOwner/transactions-report',{
    pageTitle:'Transactions Report',
    transactions:transactions.data,
    responseMetaData:transactions.responseMetaData,
    startDateInLocalTime,
    endtDateInLocalTime,
    startDateInUTC:startDate,
    endtDateInUTC:endDate,
});
});

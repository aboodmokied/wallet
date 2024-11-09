const { Op } = require("sequelize");
const Transaction = require("../../models/Transaction");
const tryCatch = require("../../util/tryCatch");


const getDates=(date,from,to)=>{
  const targetDate=new Date();
  if(date){
    const splittedDate=date.split('/');
    const year=splittedDate[0];
    const month=splittedDate[1];
    const day=splittedDate[2];
    targetDate.setFullYear(year,month-1,day);
  }
  targetDate.setUTCHours(0,0,0,0);

  const startDate=new Date(targetDate);
  startDate.setUTCHours(Number(from),0,0,0);

  const endDate=new Date(targetDate);
  endDate.setUTCHours(Number(to),59,59,999);

  const startDateMillS=startDate.getTime();
  const endDateMillS=endDate.getTime();
  return {
    startDate,
    endDate,
    startDateMillS,
    endDateMillS
  }
};

exports.dailySystemTransactions = tryCatch(async (req, res, next) => {
  const { date, from, to } = req.query;
  const {startDateMillS,endDateMillS}=getDates(date,from,to);
  const transactions = await Transaction.findAll({
    where: {
      date: { [Op.between]: [startDateMillS, endDateMillS] },
      verified_at: { [Op.ne]: null },
    },
  });
  res.send({ status: true, transactions });
});

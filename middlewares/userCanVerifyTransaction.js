const transactionConfig = require("../config/transactionConfig");
const AuthorizationError = require("../Errors/ErrorTypes/AuthorizationError");
const ChargingPoint = require("../models/ChargingPoint");
const Transaction = require("../models/Transaction");
const tryCatch = require("../util/tryCatch");

const userCanVerifyTransaction = tryCatch(async (req, res, next) => {
  /**
   * transfer => source user (email => source user)
   * charging => charging-point (email => target user)
   * payment => source user (email => source user)
   * **/
  const { transaction_id } = req.body;
  const transaction = await Transaction.findByPk(transaction_id);
  const { sourceUser } = await transaction.getUsers();
  const { id, guard } = req.user;
  if (sourceUser.guard == guard && sourceUser.id == id) {
    return next();
  }
});

module.exports = userCanVerifyTransaction;

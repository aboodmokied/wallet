const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");
const User = require("./User");
const Company = require("./Company");
const ChargingPoint = require("./ChargingPoint");
const BadRequestError = require("../Errors/ErrorTypes/BadRequestError");

const Transaction = Application.connection.define(
  "transation",
  {
    source_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    target_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    verification_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified_at: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    operation_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    operation_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    date: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    // wallet_id:{
    //     type:DataTypes.BIGINT,
    //     allowNull:false
    // },
    // user_id:{
    //     type:DataTypes.BIGINT,
    //     allowNull:false
    // },
    // target_user_id:{
    //     type:DataTypes.BIGINT,
    //     defaultValue:null
    // },
    // target_wallet_id:{
    //     type:DataTypes.BIGINT,
    //     defaultValue:null
    // }
  },
  {
    defaultScope: {
      attributes: { exclude: ["verification_code"] },
    },
    scopes: {
      withVerificationCode: {
        attributes: {},
      },
    },
  }
);

Transaction.prototype.getOperation = async function () {
  const transactionConfig = require("../config/transactionConfig");
  const operationModel =
    transactionConfig.operations[this.operation_type]?.model;
  const operation = await operationModel.findByPk(this.operation_id);
  return operation;
};

Transaction.prototype.getUsers = async function () {
  const { source_id, target_id, operation_type } = this;
  let sourceUser, targetUser;
  switch (operation_type) {
    case "transfer":
      sourceUser = await User.findByPk(source_id);
      targetUser = await User.findByPk(target_id);
      break;
    case "payment":
      sourceUser = await User.findByPk(source_id);
      targetUser = await Company.findByPk(target_id);
      break;
    case "charging":
      sourceUser = await ChargingPoint.findByPk(source_id);
      targetUser = await User.findByPk(target_id);
      break;
    default:
      throw BadRequestError("this operation_type not provided");
  }
  return { sourceUser, targetUser };
};

module.exports = Transaction;

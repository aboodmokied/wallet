const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");

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

module.exports = Transaction;

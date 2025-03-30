const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");

const Wallet = Application.connection.define("wallet", {
  id:{
    type:DataTypes.BIGINT,
    primaryKey:true,
    autoIncrement:true
  },
  balance: {
    type: DataTypes.DOUBLE,
    defaultValue: 100.0,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull:false
  },
});

module.exports = Wallet;

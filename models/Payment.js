const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");
const Company = require("./Company");
const User = require("./User");

const Payment = Application.connection.define("payment", {
  user_wallet_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_old_balance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  company_old_balance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  user_current_balance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  company_current_balance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  company_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  company_wallet_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

Payment.prototype.getUsers = async function () {
  const company = await Company.findByPk(this.company_id);
  const sourceUser = await User.findByPk(this.user_id);
  return {
    company,
    sourceUser,
  };
};

module.exports = Payment;

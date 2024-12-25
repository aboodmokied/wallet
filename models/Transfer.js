const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");
const User = require("./User");

const Transfer = Application.connection.define("transfer", {
  source_wallet_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  source_user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  source_old_balance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  target_old_balance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  source_user_current_balance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  target_user_current_balance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  // transaction_id: {
  //   type: DataTypes.BIGINT,
  //   allowNull: false,
  // },
  target_user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  target_user_wallet_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  // verified_at: {
  //   type: DataTypes.BIGINT,
  //   defaultValue: null,
  // },
  info: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Transfer.prototype.getUsers = async function () {
  const sourceUser = await User.findByPk(this.source_user_id);
  const targetUser = await User.findByPk(this.target_user_id);
  return {
    sourceUser,
    targetUser,
  };
};

module.exports = Transfer;

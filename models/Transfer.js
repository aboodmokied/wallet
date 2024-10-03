const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");

const Transfer = Application.connection.define("transfer", {
  wallet_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  transaction_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  target_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  target_wallet_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  verified_at: {
    type: DataTypes.BIGINT,
    defaultValue: null,
  },
  info: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Transfer;

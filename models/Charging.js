const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");

const Charging = Application.connection.define("charging", {
  wallet_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  // transaction_id: {
  //   type: DataTypes.BIGINT,
  //   allowNull: false,
  // },
  verified_at: {
    type: DataTypes.BIGINT,
    defaultValue: null,
  },
  charging_point_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = Charging;

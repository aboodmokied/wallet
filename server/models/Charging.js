const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");
const ChargingPoint = require("./ChargingPoint");
const User = require("./User");

const Charging = Application.connection.define("charging", {
  user_wallet_id: {
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
  // verified_at: {
  //   type: DataTypes.BIGINT,
  //   defaultValue: null,
  // },
  user_old_balance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  user_current_balance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  charging_point_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

Charging.prototype.getUsers = async function () {
  const chargingPoint = await ChargingPoint.findByPk(this.charging_point_id);
  const targetUser = await User.findByPk(this.user_id);
  return {
    chargingPoint,
    targetUser,
  };
};

module.exports = Charging;

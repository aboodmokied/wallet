const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");
const User = require("./User");

const Transfer = Application.connection.define("transfer", {
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
  target_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  target_wallet_id: {
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

Transfer.prototype.getUsers=async function(){
  const sourceUser=await User.findByPk(this.user_id);
  const targetUser=await User.findByPk(this.target_id);
  return {
      sourceUser,
      targetUser
  }
}

module.exports = Transfer;

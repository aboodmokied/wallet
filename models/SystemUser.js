const Application = require("../Application");
const { DataTypes, Model } = require("sequelize");

class SystemUser extends Model {}

SystemUser.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: Application.connection,
    tableName: undefined,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  }
);


// const SystemUser = Application.connection.define("system_user", {
//     email:{
//         type:DataTypes.STRING,
//         allowNull:false,
//         unique:true
//     },
//     name:{
//         type:DataTypes.STRING(30),
//         allowNull:false,
//     },
//     password:{
//         type:DataTypes.STRING,
//         allowNull:false
//     },
//     verified:{
//         type:DataTypes.BOOLEAN,
//         defaultValue:false
//     }
// },{
//     defaultScope:{
//         attributes:{exclude:['password']}
//     },
//     scopes:{
//         withPassword:{
//             attributes:{}
//         }
//     }
// });

module.exports = SystemUser;

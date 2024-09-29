const Application = require("../Application");
const { DataTypes, Model } = require("sequelize");

class SystemUser extends Model {
  static myRawAttributes={};

  static get rawAttributes(){
    return this.myRawAttributes;
  };

  static set rawAttributes(attributes){
    this.myRawAttributes={...this.myRawAttributes,...attributes};
  }

  test(){
    console.log('Suiiiiii')
  }
}




SystemUser.init(
  {
    id:{
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique:true
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
    timestamps:false,
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

// SystemUser.rawAttributes
// console.log(SystemUser.getAttributes());
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

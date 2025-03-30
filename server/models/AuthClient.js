const { DataTypes } = require("sequelize");
const Application = require("../Application");

const AuthClient=Application.connection.define('auth_client',{
    guard:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    secret:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    type:{
        type:DataTypes.ENUM(["refresh","access"]),
        allowNull:false
    },
    revoked:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})



module.exports=AuthClient;
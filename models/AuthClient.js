const { DataTypes } = require("sequelize");
const Application = require("../Application");

const AuthClient=Application.connection.define('auth_client',{
    guard:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    secret:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    revoked:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})



module.exports=AuthClient;
const { DataTypes } = require("sequelize");
const Application = require("../Application");

const PasswordResetCode=Application.connection.define('password_reset_code',{
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    attemps:{
        type:DataTypes.INTEGER,
        defaultValue:3
    },
    guard:{
        type:DataTypes.STRING,
        allowNull:false
    },
    code:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    revoked:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    expiresAt:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    signature:{
        type:DataTypes.STRING,
        defaultValue:null,
        unique:true
    }

});

module.exports=PasswordResetCode;
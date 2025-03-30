const { DataTypes } = require("sequelize");
const Application = require("../Application");

const PasswordResetToken=Application.connection.define('password_reset_token',{
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    guard:{
        type:DataTypes.STRING,
        allowNull:false
    },
    token:{
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
    }

});

module.exports=PasswordResetToken;
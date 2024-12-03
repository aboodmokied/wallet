const { DataTypes } = require("sequelize");
const Application = require("../Application");

const VerifyEmailToken=Application.connection.define('verify_email_token',{
    email:{
        type:DataTypes.STRING,
        allowNull:false
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
    }

});

module.exports=VerifyEmailToken;
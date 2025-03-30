const { DataTypes } = require("sequelize");
const Application = require("../Application");

const CreateAdminRequest=Application.connection.define('create_admin_request',{
    token:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    email:{
        type:DataTypes.STRING(30),
        allowNull:false,
    },
    revoked:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
});

module.exports=CreateAdminRequest;
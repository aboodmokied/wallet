const { DataTypes } = require("sequelize");
const Application = require("../Application");

const CreateByAdminRequest=Application.connection.define('create_by_admin_request',{
    token:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    email:{
        type:DataTypes.STRING(30),
        allowNull:false,
    },
    guard:{
        type:DataTypes.STRING,
        allowNull:false
    },
    revoked:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
});

module.exports=CreateByAdminRequest;
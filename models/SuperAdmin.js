const { DataTypes } = require("sequelize");
const Application = require("../Application");

const SuperAdmin=Application.connection.define('super_admin',{
    adminId:{
        type:DataTypes.BIGINT,
        allowNull:false
    }
});

module.exports=SuperAdmin;
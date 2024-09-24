const { DataTypes } = require("sequelize");
const Application = require("../Application");

const RoleHasPermission=Application.connection.define('role_has_permission',{
    roleId:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    permissionId:{
        type:DataTypes.BIGINT,
        allowNull:false
    }
},{

})

module.exports=RoleHasPermission;
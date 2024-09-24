const { DataTypes } = require("sequelize");
const Application = require("../Application");

const UserHasRole=Application.connection.define('user_has_role',{
    roleId:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    userId:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    guard:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{

})

module.exports=UserHasRole;
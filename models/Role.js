const { DataTypes } = require("sequelize");
const Application = require("../Application");

const Role=Application.connection.define('role',{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    isMain:{  // undeletable or assignable
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    
});

module.exports=Role;
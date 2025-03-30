const { DataTypes } = require("sequelize");
const Application = require("../Application");
const SystemUser = require("./SystemUser");

class SystemOwner extends SystemUser{};


SystemOwner.init({
    id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique:true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    guard:{
        type:DataTypes.STRING,
        defaultValue:'systemOwner'
    },
},{
    sequelize:Application.connection,
    tableName:'system_owners',
    defaultScope:{
        attributes:{exclude:['password']}
    },
    scopes:{
        withPassword:{
            attributes:{}
        }
    }
})


module.exports=SystemOwner;

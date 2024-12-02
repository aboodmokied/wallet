const { DataTypes } = require("sequelize");
const Application = require("../Application");
const SystemUser = require("./SystemUser");

class SystemOwner extends SystemUser{};


SystemOwner.init({
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

const { DataTypes } = require("sequelize");
const Application = require("../Application");
const SystemUser = require("./SystemUser");


class ChargingPoint extends SystemUser{
    
};

ChargingPoint.init({
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
    phone:{
        type:DataTypes.STRING,
        allowNull:true,
        unique:true
    },
    guard:{
        type:DataTypes.STRING,
        defaultValue:'chargingPoint'
    },
    wasPending:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    sequelize:Application.connection,
    tableName:'charging_points',
    defaultScope:{
        attributes:{exclude:['password']}
    },
    scopes:{
        withPassword:{
            attributes:{}
        }
    }
});

module.exports = ChargingPoint;

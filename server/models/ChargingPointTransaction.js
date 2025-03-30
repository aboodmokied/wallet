const { DataTypes } = require("sequelize");
const Application = require("../Application");

const ChargingPointTransaction=Application.connection.define('charging_point_transaction',{
    amount:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
    date:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    // charging_point_id:{
    //     type:DataTypes.BIGINT,
    //     allowNull:false
    // },
    // charging_id:{
    //     type:DataTypes.BIGINT,
    //     allowNull:false
    // }

});

module.exports=ChargingPointTransaction;
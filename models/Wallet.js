const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");

const Wallet=Application.connection.define('wallet',{
    balance:{
        type:DataTypes.DOUBLE,
        defaultValue:0.0
    },
    user_id:{
        type:DataTypes.BIGINT,
    }
})

module.exports=Wallet;



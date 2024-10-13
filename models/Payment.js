const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");

const Payment=Application.connection.define('payment',{
    wallet_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    user_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    company_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    company_wallet_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
})

module.exports=Payment;



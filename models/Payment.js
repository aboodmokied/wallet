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
    transaction_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    verified_at: {
        type: DataTypes.BIGINT,
        defaultValue: null,
      },
    company_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    branch_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    company_wallet_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    company_old_balance:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
    company_current_balance:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
    amount:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
})

module.exports=Payment;



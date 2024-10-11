const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");

const Transaction=Application.connection.define('transation',{
    amount:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
    old_balance:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
    current_balance:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
    verification_code:{
        type:DataTypes.STRING,
        allowNull:false
    },
    verified_at:{
        type:DataTypes.BIGINT,
        defaultValue:null
    }, 
    operation_type:{
        type:DataTypes.STRING,
        allowNull:false
    },
    operation_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    date:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    // wallet_id:{
    //     type:DataTypes.BIGINT,
    //     allowNull:false
    // },
    // user_id:{
    //     type:DataTypes.BIGINT,
    //     allowNull:false
    // },
    // target_user_id:{
    //     type:DataTypes.BIGINT,
    //     defaultValue:null
    // },
    // target_wallet_id:{
    //     type:DataTypes.BIGINT,
    //     defaultValue:null
    // }
})

module.exports=Transaction;



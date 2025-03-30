const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");

const CompanyTransaction=Application.connection.define('company_transation',{
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
    date:{
        type:DataTypes.BIGINT,
        allowNull:false
    }
})

module.exports=CompanyTransaction;



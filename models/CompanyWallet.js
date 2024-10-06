const { DataTypes } = require("sequelize");
const Application = require("../Application");

const CompanyWallet=Application.connection.define('company_wallet',{
    balance:{
        type:DataTypes.DOUBLE,
        defaultValue:0.0
    },
    company_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    }
});

module.exports=CompanyWallet;
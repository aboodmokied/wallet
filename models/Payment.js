const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");
const Company = require("./Company");
const User = require("./User");

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

Payment.prototype.getUsers=async function(){
    const company=await Company.findByPk(this.company_id);
    const sourceUser=await User.findByPk(this.user_id);
    return {
        company,
        sourceUser
    }
}


module.exports=Payment;



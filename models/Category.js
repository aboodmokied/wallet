const { DataTypes } = require("sequelize");
const Application = require("../Application");

const Category=Application.connection.define('category',{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    } 
});

module.exports=Category;
const { DataTypes } = require("sequelize");
const SystemUser = require("./SystemUser");
const Application = require("../Application");
// const Category = require("./Category");

class Company extends SystemUser{

};

Company.init({
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
        type:DataTypes.STRING(30),
        allowNull:true,
        unique:true
    },
    guard:{
        type:DataTypes.STRING,
        defaultValue:'company'
    },
    // category_id:{
    //     type:DataTypes.BIGINT,
    //     references:Category
    // }
},{
    sequelize:Application.connection,
    defaultScope:{
        attributes:{exclude:['password']}
    },
    scopes:{
        withPassword:{
            attributes:{}
        }
    }
});

module.exports=Company;
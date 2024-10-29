const { DataTypes } = require("sequelize");
const SystemUser = require("./SystemUser");
const Application = require("../Application");
// const Category = require("./Category");

class Company extends SystemUser{

};

Company.init({
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
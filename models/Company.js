const { DataTypes } = require("sequelize");
const SystemUser = require("./SystemUser");
const Application = require("../Application");

class Company extends SystemUser{

};

Company.init({

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
const { DataTypes } = require("sequelize");
const Application = require("../Application");
const SystemUser = require("./SystemUser");

class Admin extends SystemUser{

}

Admin.init({
    isSuper:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    guard:{
        type:DataTypes.STRING,
        defaultValue:'admin'
    },
},{
    sequelize:Application.connection
});

// const Admin=Application.connection.define('admin',{
//     email:{
//         type:DataTypes.STRING,
//         allowNull:false,
//         unique:true
//     },
//     name:{
//         type:DataTypes.STRING(30),
//         allowNull:false,
//     },
//     password:{  
//         type:DataTypes.STRING,
//         allowNull:false
//     },
//     guard:{
//         type:DataTypes.STRING,
//         defaultValue:'admin'
//     },
//     verified:{
//         type:DataTypes.BOOLEAN,
//         defaultValue:false
//     },
//     isSuper:{
//         type:DataTypes.BOOLEAN,
//         defaultValue:false
//     }
// },{
//     defaultScope:{
//         attributes:{exclude:['password']}
//     },
//     scopes:{
//         withPassword:{
//             attributes:{}
//         }
//     }
// }
// )


module.exports=Admin;

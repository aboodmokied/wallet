const { DataTypes, Op, Model } = require("sequelize");
const Application = require("../Application");
const SystemUser = require("./SystemUser");


class User extends SystemUser{

};


User.init({
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
    national_id:{
        type:DataTypes.STRING,
        allowNull:true,
        unique:true
    },
    phone:{
        type:DataTypes.STRING(30),
        allowNull:true,
        unique:true
    },
    guard:{
        type:DataTypes.STRING,
        defaultValue:'user'
    },
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


// console.log('After init User',User.rawAttributes);



// Object.setPrototypeOf(User.prototype,SystemUser.prototype);

// User.rawAttributes={...SystemUser.rawAttributes,...User.rawAttributes};

// const User=Application.connection.define('user',{
    
//     // googleOAuth:{
//     //     type: DataTypes.BOOLEAN,
//     //     defaultValue:false, 
//     // },
    
//     // password:{  
//     //     type:DataTypes.STRING,
//     //     allowNull:true // Will be null if the user signed up via OAuth
//     // },
//     national_id:{
//         type:DataTypes.STRING,
//         allowNull:true,
//         unique:true
//     },
//     phone:{
//         type:DataTypes.STRING,
//         allowNull:true,
//         unique:true
//     },
//     guard:{
//         type:DataTypes.STRING,
//         defaultValue:'user'
//     },
    
// },)

module.exports=User;



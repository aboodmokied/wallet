const { DataTypes, Op, Model } = require("sequelize");
const Application = require("../Application");
const SystemUser = require("./SystemUser");


class User extends SystemUser{

};


User.init({
    national_id:{
        type:DataTypes.STRING,
        allowNull:true,
        unique:true
    },
    phone:{
        type:DataTypes.STRING,
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



const { DataTypes, Op } = require("sequelize");
const Application = require("../Application");

const Student=Application.connection.define('student',{
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    googleOAuth:{
        type: DataTypes.BOOLEAN,
        defaultValue:false, 
    },
    name:{
        type:DataTypes.STRING(30),
        allowNull:false,
    },
    password:{  
        type:DataTypes.STRING,
        allowNull:true // Will be null if the user signed up via OAuth
    },
    guard:{
        type:DataTypes.STRING,
        defaultValue:'student'
    },
    verified:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    defaultScope:{
        attributes:{exclude:['password']}
    },
    scopes:{
        withPassword:{
            attributes:{}
        }
    }
})

module.exports=Student;



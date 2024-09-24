const authConfig={
    defaults:{
        defaultGuard:'student',
    },
    permissions:{
        testPermission:{
            name:'test',
        }
    },
    commonRole:{ // role shared between all users
        name:'user'
    }, 
    guards:{ // user types
        admin:{
            name:'admin',
            oauth:false,
            drivers:['session','token'],
            registeration:'by-admin', // (that means any user can create a student account) or admin: (only admin can create new accounts) 
            provider:'admins', // mainProvider: contain all users types
            role:{
                name:'admin',
            }
        },
        student:{
            name:'student',
            oauth:true,
            drivers:['session','token'],
            registeration:'global', // (that means any user can create a student account) or admin: (only admin can create new accounts) 
            provider:'students', // mainProvider: contain all users types
            role:{
                name:'student',
            }
        
        }
    },
    providers:{
        admins:{
            driver:'Sequelize',
            model:require("../models/Admin"), 
        },
        students:{
            driver:'Sequelize',
            model:require("../models/Student"), 
        },
        
    }
    
   
}

module.exports=authConfig;
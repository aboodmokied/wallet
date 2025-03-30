const authConfig = require("./authConfig");

module.exports={
    authentication:{
        register:{
                route:'/auth/register/:guard',
                path:(guard=authConfig.defaults.defaultGuard)=>`/auth/register/${guard}`,
                page:'auth/register'
        },
        login:{
                route:'/auth/login/:guard',
                path:(guard=authConfig.defaults.defaultGuard)=>`/auth/login/${guard}`,
                page:'auth/login'
        }
    },
}
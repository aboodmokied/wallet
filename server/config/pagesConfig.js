const authConfig = require("./authConfig");

module.exports={
    authentication:{
        register:{
                route:'/auth/register/:guard',
                path:(guard=authConfig.defaults.defaultGuard)=>`/web/auth/register/${guard}`,
                page:'auth/register'
        },
        login:{
                route:'/auth/login/:guard',
                path:(guard=authConfig.defaults.defaultGuard)=>`/web/auth/login/${guard}`,
                page:'auth/login'
        }
    },
}
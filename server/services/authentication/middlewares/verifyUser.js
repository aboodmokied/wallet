const authConfig = require("../../../config/authConfig");

module.exports=async(req,res,next)=>{
    if(req.session?.isAuthenticated&&req.session?.userId&&req.session?.guard){
        const guardObj=authConfig.guards[req.session.guard];
        if(guardObj){
            const model=authConfig.providers[guardObj.provider]?.model;
            const user=await model.findByPk(req.session.userId);
            if(user){
                req.user=user;
                return next();
            }
        }
         // user was deleted from db or something like that
            req.session.isAuthenticated=false;
            req.session.userId=undefined;
            req.session.guard=undefined;
    }
    next();
}
const tryCatch = require("../util/tryCatch");

const userToLocals=tryCatch(async(req,res,next)=>{
    res.locals.user=req.user;
    res.locals.currentUrl=req.originalUrl;
    if(req.user?.guard=='admin'){
        // const superAdmin=await SuperAdmin.findOne();
        if(req.user.isSuper){
            res.locals.isSuperAdmin=true;
        }
    }
    next();
});

module.exports=userToLocals;
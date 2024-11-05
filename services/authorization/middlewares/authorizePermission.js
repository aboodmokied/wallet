const AuthorizationError = require("../../../Errors/ErrorTypes/AuthorizationError");
const tryCatch = require("../../../util/tryCatch");

const authorizePermission=(permission)=>{
    console.log(1)
    const Authorize = require("../Authorize");
    new Authorize().addPermission(permission);
    console.log(2)
    return tryCatch(async(req,res,next)=>{
        console.log(3)
        const allowed=await req.user.hasPermissionViaRoles(permission);
        console.log(4) 
        if(allowed){
            console.log(5)
            return next();
        }
        console.log(6)
        throw new AuthorizationError();
    })
};  

module.exports=authorizePermission;

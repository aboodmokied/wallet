const AuthorizationError = require("../../../Errors/ErrorTypes/AuthorizationError");
const tryCatch = require("../../../util/tryCatch");

const authorizePermission=(permission)=>{
    const Authorize = require("../Authorize");
    new Authorize().addPermission(permission);
    return tryCatch(async(req,res,next)=>{
        const allowed=await req.user.hasPermissionViaRoles(permission);
        if(allowed){
            return next();
        }
        throw new AuthorizationError();
    })
};  

module.exports=authorizePermission;

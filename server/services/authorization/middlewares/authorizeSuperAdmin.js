const AuthorizationError = require("../../../Errors/ErrorTypes/AuthorizationError");
const Admin = require("../../../models/Admin");
const tryCatch = require("../../../util/tryCatch");

const authorizeSuperAdmin=tryCatch(async(req,res,next)=>{
    // const superAdmin=await SuperAdmin.findOne(); // there is only one super admin
     // if(req.user?.guard=='admin'&&req.user.id==superAdmin.adminId){
    //     return next();
    // }
    if(req.user&&req.user.guard=='admin'){
        const count=await Admin.findAll({
            where:{id:req.user.id,isSuper:true}
        });
        if(count){
            return next();
        }
    }
   
    throw new AuthorizationError();
});
module.exports=authorizeSuperAdmin;
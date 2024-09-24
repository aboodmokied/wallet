const authConfig = require("../../../config/authConfig");
const BadRequestError = require("../../../Errors/ErrorTypes/BadRequestError");
const NotFoundError = require("../../../Errors/ErrorTypes/NotFoundError");
const VerifyEmailToken = require("../../../models/verifyEmailToken");
const tryCatch = require("../../../util/tryCatch")

const verifyEmailToken=tryCatch(async(req,res,next)=>{
    const {token}=req.params;
    const {email}=req.query;
    const verifyEmailToken=await VerifyEmailToken.findOne({where:{token,revoked:false}});
    if(verifyEmailToken){
        if(verifyEmailToken.email==email){
            const {guard}=verifyEmailToken;
            const guardObj=authConfig.guards[guard];
            const model=authConfig.providers[guardObj.provider]?.model;
            if(model){
                // await model.update({verified:true},{where:{email,guard}});
                const user=await model.findOne({where:{email,guard}});
                if(!user){
                    throw new NotFoundError('user not found');
                }
                await user.update({verified:true});
                await verifyEmailToken.update({revoked:true});
                req.targetUser=user;
                return next();
            }
        }
    }
    throw new BadRequestError('Invalid Token');
});

module.exports=verifyEmailToken;
const tryCatch = require("../../../util/tryCatch");
const BadRequestError=require('../../../Errors/ErrorTypes/BadRequestError');
const authConfig = require("../../../config/authConfig");
const PasswordResetToken = require("../../../models/PasswordResetToken");

const verifyPassResetToken=(from='url')=>tryCatch(async(req,res,next)=>{
    let token=null;
    let email=null;
    if(from=='url'){
        token=req.params.token;
        email=req.query.email;
    }else if(from=='body'){
        token=req.body.token;
        email=req.body.email;
    }else{
        throw new Error('From value required');
    }
    if(!email){
        throw BadRequestError('Email Required');
    }
    const passResetToken=await PasswordResetToken.findOne({where:{token,revoked:false}});
    if(passResetToken){
        if(email===passResetToken.email){
            if(passResetToken.expiresAt<Date.now()){
                throw new BadRequestError('token timeout');
            }
            const {guard}=passResetToken;
            const guardObj=authConfig.guards[guard];
            const model=authConfig.providers[guardObj.provider]?.model;
            if(model){
                const user=await model.findOne({where:{email:passResetToken.email}});
                if(user){
                    req.targetUser=user;
                    return next();
                }
            }
        }
        
    }
    throw new BadRequestError('Invalid Token');
});

module.exports=verifyPassResetToken;


const tryCatch = require("../../../util/tryCatch");
const BadRequestError=require('../../../Errors/ErrorTypes/BadRequestError');
const authConfig = require("../../../config/authConfig");
const PasswordResetCode = require("../../../models/PasswordResetCode");
const bcrypt=require('bcryptjs');

const verifyPassResetCode=tryCatch(async(req,res,next)=>{
    const {code,email,guard}=req.body;
    const passResetCode=await PasswordResetCode.findOne({where:{email,guard,revoked:false}});
    if(passResetCode){
        if(bcrypt.compareSync(code,passResetCode.code)){
            if(passResetCode.expiresAt<Date.now()){
                throw new BadRequestError('Code timeout');
            }
            if(passResetCode.attemps<1){
                throw new BadRequestError('No Remaining attemps');
            }
            const guardObj=authConfig.guards[guard];
            const model=authConfig.providers[guardObj.provider]?.model;
            if(model){
                const user=await model.findOne({where:{email:passResetToken.email}});
                if(user){
                    req.targetUser=user;
                    req.passResetCode=passResetCode;
                    return next();
                }
            }
        }
        passResetCode.attemps-=1;
        await passResetCode.save();
    }
    throw new BadRequestError('Invalid Code');
});

module.exports=verifyPassResetCode;


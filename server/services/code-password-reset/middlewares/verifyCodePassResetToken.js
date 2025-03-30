const BadRequestError = require("../../../Errors/ErrorTypes/BadRequestError");
const PasswordResetCode = require("../../../models/PasswordResetCode");
const tryCatch = require("../../../util/tryCatch");

const verifyCodePassResetToken=tryCatch(async(req,res,next)=>{
    const { cookies } = req;
    const { verification_token } = cookies;
    if (verification_token) {
        const signature = verification_token.split(".")[2];
        if (signature) {
            const passReset = await PasswordResetCode.findOne({
            where: { signature },
            });
            if(passReset){
                if(passReset.expiresAt<Date.now()){
                    throw new BadRequestError('Request Timeout');
                }
                req.targetUserEmail=passReset.email;
                req.targetUserGuard=passReset.guard;
                return next();
            }
        }
    }
    throw new BadRequestError('Invalid Process');
});

module.exports=verifyCodePassResetToken;
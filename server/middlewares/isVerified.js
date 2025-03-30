const AuthenticationError = require("../Errors/ErrorTypes/AuthenticationError");
const VerificationError = require("../Errors/ErrorTypes/VerificationError");

const isVerified=(req,res,next)=>{
    if(!req.user){
        throw new AuthenticationError();
    }
    if(req.user.verified){
        return next();
    }
    if(req.isApiRequest){
        throw new VerificationError('Account Not Verified, verify using email..');
    }
    res.render('auth/verifyAccount',{
        pageTitle:'Verify Account',
    });
};

module.exports=isVerified;
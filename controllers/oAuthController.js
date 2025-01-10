const authConfig = require("../config/authConfig");
const BadRequestError = require("../Errors/ErrorTypes/BadRequestError");
const ApiAuth = require("../services/api-authentication/ApiAuth");
const Authenticate = require("../services/authentication/Authenticate");
const GoogleAuth = require("../services/o-auth/GoogleAuth");
const Register = require("../services/registration/Register");
const tryCatch = require("../util/tryCatch");


exports.googleAuthRequest=tryCatch(async(req,res,next)=>{
    const {guard,process}=req.params;
    const type=req.isApiRequest?'api':'web';
    const googleAuth=new GoogleAuth();
    googleAuth.redirectToGoogleAuth(res,{guard,process,type});
});

exports.googleAuthResponse=tryCatch(async(req,res,next)=>{
    const {code,state}=req.query;
    const { guard, process,type } = JSON.parse(decodeURIComponent(state));
    const googleAuth=new GoogleAuth();
    const user=await googleAuth.verifyGoogleUser(code);
    const guardObj=authConfig.guards[guard];
    if(!guardObj.oauth){
        throw new BadRequestError('Process not allowed');
    }
    const model=authConfig.providers[guardObj.provider].model;
    const {name,email}=user;
    // if(process=='register'){
        const count=await model.count({where:{email,guard}});
        if(!count){ // register
            await new Register().withGuard(guard).createWithOauth({name,email,verified:true,googleOAuth:true});
        }
        // login
        req.body={email,googleOAuth:true};
        const { accessToken, user:myUser } = await new ApiAuth()
        .withGuard(guard)
        .jwtLogin(req, res);
        res.send({ status: true, result: { accessToken, user:myUser } });
});
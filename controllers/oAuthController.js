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
    console.log({user});
    const guardObj=authConfig.guards[guard];
    if(!guardObj.oauth){
        throw new BadRequestError('Process not allowed');
    }
    const model=authConfig.providers[guardObj.provider].model;
    const {name,email}=user;
    if(process=='register'){
        const count=await model.count({where:{email,guard}});
        if(count){
            throw new BadRequestError(`This email "${email}" already used, try to login`);  
        };
        const newUser=await new Register().withGuard(guard).createWithOauth({name,email,verified:true,googleOAuth:true});
        return type=='api'
        ?res.status(201).send({status:true,result:{user:newUser}})
        :res.redirect(`/auth/login/${guard}`);
    }else if(process=='login'){
        if(type=='api'){
            const token=await new ApiAuth().withGuard(guard).generateTokenWithOauth({email,googleOAuth:true});
            return res.send({status:true,result:{token}});
        }else{
            const {passed,error} =await new Authenticate().withGuard(guard).attempWithOauth(req,{email,googleOAuth:true});
            if(!passed){
                return res.with('old',req.body).with('errors',[{msg:error}]).redirect(`/auth/login/${guard}`);
            }
            return res.redirect('/');
        }
        
    }else{
        throw new BadRequestError(`Invalid Process: ${process}`);
    }
});
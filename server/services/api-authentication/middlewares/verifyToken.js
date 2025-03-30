const tryCatch = require("../../../util/tryCatch");
const AuthClient=require('../../../models/AuthClient');
const jwt=require('jsonwebtoken');
const AuthenticationError = require("../../../Errors/ErrorTypes/AuthenticationError");
const AccessToken = require("../../../models/AccessToken");
const authConfig = require("../../../config/authConfig");

const verifyToken=tryCatch(async(req,res,next)=>{
    const requestToken=req.headers.authorization;
    if(requestToken?.startsWith('Bearer')&&requestToken?.split(' ')[1]){
        const token=requestToken.split(' ')[1];
        const signature=token.split('.')[2];
        if(token&&signature){
        const accessToken=await AccessToken.findOne({where:{signature,revoked:false}});
        if(accessToken){
            if(accessToken.expiresAt>=Date.now()){
                const authClient=await AuthClient.findOne({where:{id:accessToken.client_id,revoked:false}});
                if(authClient){
                    let payload=null;
                    try {
                        payload=jwt.verify(token,authClient.secret); // throws an error
                    } catch (error) {
                        throw new AuthenticationError('Unathorized, Invalid Token');
                    }
                    if(payload?.id==accessToken.user_id){
                        const {guard}=authClient;
                        const guardObj=authConfig.guards[guard];
                        const model=authConfig.providers[guardObj.provider].model;
                        const user=await model.findByPk(accessToken.user_id);
                        if(user){
                            req.user=user;
                            req.userSignature=signature;
                            return next();
                        }
                    }
                    
                }
            }
            
        }
        }
        
    }
    throw new AuthenticationError();
});

module.exports=verifyToken;
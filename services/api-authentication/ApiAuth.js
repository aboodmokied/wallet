const { where } = require("sequelize");
const authConfig = require("../../config/authConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const AuthClient = require("../../models/AuthClient");
const crypto=require('crypto');
const jwt=require('jsonwebtoken');
const AccessToken = require("../../models/AccessToken");
const AuthenticationError = require("../../Errors/ErrorTypes/AuthenticationError");
const bcrypt=require('bcryptjs');

class ApiAuth{
    #guard=authConfig.defaults.defaultGuard;
    constructor(){
        return ApiAuth.instance??=this;
    }

    async setup(){
        await this.#defineClients();
    }

    withGuard(guard){
        if(guard){
            this.#guard=guard;
        }
        return this;
    }
    // #defineRelations(model){
    //     model.hasMany(AccessToken,{
    //         foreignKey:'userId',
    //     })
    //     AccessToken.belongsTo(model,{
//         foreignKey:'userId',
    //     })
    // }
    applyApiAuth(model){
        // this.#defineRelations(model);
        // model.prototype.generateToken=async function(revokePrev=false){
        //     const guardObj=authConfig.guards[this.guard];
        //     if(!guardObj.drivers.includes('token')){
        //         throw new BadRequestError('Proccess Not Allowed');
        //     }
        //     const authClient=await AuthClient.findOne({where:{guard:this.guard}});
        //     const token=jwt.sign({id:this.id},authClient.secret); 
        //     const signature=token.split('.')[2];
        //     const expiresAt=Date.now() + 30*24*60*60*1000;

        //     if(revokePrev){
        //         await AccessToken.update({revoked:true},{where:{userId:this.id,clientId:authClient.id}});
        //     }
        //     await AccessToken.create({
        //         userId:this.id,
        //         clientId:authClient.id,
        //         signature,
        //         expiresAt
        //     });
        //     return token;
        // };
        model.prototype.apiLogout=async function(){
            // userId, clientId (guard)
            const authClient=await AuthClient.findOne({where:{guard:this.guard}});
            await AccessToken.update({revoked:true},{where:{userId:this.id,clientId:authClient.id}});
            return true;
        }
        model.prototype.apiLogoutCurrentSession=async function(signature){
            // userId, clientId , signature
            const authClient=await AuthClient.findOne({where:{guard:this.guard}});
            await AccessToken.update({revoked:true},{where:{userId:this.id,clientId:authClient.id,signature}});
            return true;
        }
    }

    async generateToken(req,revokePrev=false){
        const password=req.body.password;
        delete req.body.password;
        const guardObj=authConfig.guards[this.#guard];
        if(!guardObj.drivers.includes('token')){
            throw new BadRequestError('Proccess Not Allowed');
        }
        const model=authConfig.providers[guardObj.provider]?.model;
        const user=await model.scope('withPassword').findOne({where:{...req.body}});
        if(!user)throw new AuthenticationError('Wrong Credintials');
        const isMatched=bcrypt.compareSync(password,user.password);
        if(!isMatched)throw new AuthenticationError('Wrong Password'); 
        const authClient=await AuthClient.findOne({where:{guard:this.#guard,revoked:false}});
        const token=jwt.sign({id:user.id},authClient.secret); 
        const signature=token.split('.')[2];
        const expiresAt=Date.now() + 30*24*60*60*1000;

        if(revokePrev){
            await AccessToken.update({revoked:true},{where:{userId:user.id,clientId:authClient.id}});
        }
        await AccessToken.create({
            userId:user.id,
            clientId:authClient.id,
            signature,
            expiresAt
        });
        const userInstance=await model.findOne({where:{...req.body}})
        return {token,user:userInstance};
    };
    async generateTokenWithOauth(userData,revokePrev=false){
        const guardObj=authConfig.guards[this.#guard];
        if(!guardObj.drivers.includes('token')){
            throw new BadRequestError('Proccess Not Allowed');
        }
        const model=authConfig.providers[guardObj.provider]?.model;
        const user=await model.findOne({where:{...userData,guard:this.#guard}});
        if(!user)throw new AuthenticationError(`no user "${this.#guard}" with this email "${userData.email}", try to register`);
        const authClient=await AuthClient.findOne({where:{guard:this.#guard,revoked:false}});
        const token=jwt.sign({id:user.id},authClient.secret); 
        const signature=token.split('.')[2];
        const expiresAt=Date.now() + 30*24*60*60*1000;

        if(revokePrev){
            await AccessToken.update({revoked:true},{where:{userId:user.id,clientId:authClient.id}});
        }
        await AccessToken.create({
            userId:user.id,
            clientId:authClient.id,
            signature,
            expiresAt
        });
        return token;
    };

    async #defineClients(){
        for(let guardName in authConfig.guards){
            const guardObj=authConfig.guards[guardName];
            if(guardObj.drivers.includes('token')){
                const count=await AuthClient.count({where:{guard:guardName}});
                if(!count){
                    const secret=this.#generateSecret();
                    await AuthClient.create({guard:guardName,secret});
                }
            }
        }
    }

    #generateSecret(){
        const secret=crypto.randomBytes(32).toString('hex');
        return crypto.createHash('sha256').update(secret).digest('hex');
    }
}

module.exports=ApiAuth;
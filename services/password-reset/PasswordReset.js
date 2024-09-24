const authConfig = require("../../config/authConfig");
const { passReset } = require("../../config/securityConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const PasswordResetToken = require("../../models/PasswordResetToken");
const crypto=require('crypto');
const bcrypt=require('bcryptjs');

class PasswordReset{
    #email=null;
    #guard=authConfig.defaults.defaultGuard;

    constructor(){
        return PasswordReset.instance??=this;
    }
    
    withGuard(guard){
        if(guard){
            this.#guard=guard;
        }
        return this;
    }

    withEmail(email){
        if(!email){
            throw new BadRequestError('Email Required For Password Reset');
        }
        this.#email=email;
        return this;
    }

    async request(hostUrl){
        const token=this.#generateToken();
        const expiresAt=Date.now() + passReset.expiresAfter * 60 * 1000;
        await PasswordResetToken.update({revoked:true},{where:{email:this.#email,guard:this.#guard}});
        const passResetToken=await PasswordResetToken.create({
            email:this.#email,
            token,
            expiresAt,
            guard:this.#guard
        });
        const url=this.#generateUrl(token,hostUrl);
        const guardObj=authConfig.guards[this.#guard];
        const model=authConfig.providers[guardObj.provider].model;
        model.sendEmail(this.#email,{
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
            <p>${url}</p>
            <p>If you did not request a password reset, please ignore this email.</p>`
        }) 
        return true;
    }

    #generateUrl(token,hostUrl){
        return hostUrl
        ?`${hostUrl}/password-reset/${token}?email=${this.#email}`
        :`${process.env.APP_URL}:${process.env.PORT||3000}/auth/password-reset/${token}?email=${this.#email}`;
    }
    #generateToken(){
        const token=crypto.randomBytes(32).toString('hex');
        return crypto.createHash('sha256').update(token).digest('hex');
    }


    async update(req){
        // everything was verified
        const {email,token,password}=req.body;
        // for more security
        const resetToken=await PasswordResetToken.findOne({where:{token,email,revoked:false}});
        if(!resetToken){
            throw new BadRequestError('Invalid token');
        }
        // revoke all reset tokens for this user
        await PasswordResetToken.update({revoked:true},{where:{guard:resetToken.guard,email:resetToken.email}});
        // update password
        const updatedUser=await req.targetUser.update({password:bcrypt.hashSync(password)});
        return updatedUser;
    }
}

module.exports=PasswordReset;
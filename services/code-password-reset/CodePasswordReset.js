const authConfig = require("../../config/authConfig");
const { passReset:passResetConfig } = require("../../config/securityConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const crypto=require('crypto');
const bcrypt=require('bcryptjs');
const PasswordResetCode = require("../../models/PasswordResetCode");
const jwt=require('jsonwebtoken');
const ValidationError = require("../../Errors/ErrorTypes/ValidationError");

class CodePasswordReset{
    #email=null;
    #guard=authConfig.defaults.defaultGuard;

    constructor(){
        return CodePasswordReset.instance??=this;
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

    async request(){
        const code=await this.#generateResetCode();
        const expiresAt=Date.now() + passResetConfig.expiresAfter * 60 * 1000;
        await PasswordResetCode.update({revoked:true},{where:{email:this.#email,guard:this.#guard}});
        const hashCode=bcrypt.hashSync(code,12);
        const passResetCode=await PasswordResetCode.create({
            email:this.#email,
            code:hashCode,
            expiresAt,
            guard:this.#guard
        });
        // const url=this.#generateUrl(token);
        const guardObj=authConfig.guards[this.#guard];
        const model=authConfig.providers[guardObj.provider].model;
        // model.sendEmail(this.#email,{
        //     subject: 'Password Reset',
        //     html: `<p>You requested a password reset. Use the Verification Code Below To Reset Your Password:</p>
        //     <p>${code}</p>
        //     <p>If you did not request a password reset, please ignore this email.</p>`
        // })
        console.log({password_reset_code:code});
        return true;
    }

    // #generateUrl(token){
    //     return hostUrl
    //     ?`${hostUrl}/password-reset/${token}?email=${this.#email}`
    //     :`${process.env.APP_URL}:${process.env.PORT||3000}/auth/password-reset/${token}?email=${this.#email}`;
    // }
    // async #generateCode(){
    //     let code;
    //     let count=0;
    //     do{
    //         code=Math.floor(100000 + Math.random() * 900000);
    //         count=await PasswordResetCode.count({where:{code}});
    //     }while(count);
    //     return code.toString();
    //   }
    async #generateResetCode() {
        let code;
        let count=0;
        do{
            code=crypto.randomBytes(4).toString('hex').toUpperCase();
            count=await PasswordResetCode.count({where:{code}});
        }while(count);
        return code; // Example: 'F3A92B1C'
    }

    // #generateToken(){
    //     const token=crypto.randomBytes(32).toString('hex');
    //     return crypto.createHash('sha256').update(token).digest('hex');
    // }
    async verify(req,res){
        const {code,email,guard}=req.body;
        const passResetCode=await PasswordResetCode.findOne({where:{email,guard,revoked:false}});
        if(passResetCode){
            if(passResetCode.attemps<1){
                // throw new BadRequestError('No Remaining attemps');
                throw new ValidationError([{path:'code',msg:'No Remaining attemps'}]);
            }
            if(bcrypt.compareSync(code,passResetCode.code)){
                if(passResetCode.expiresAt<Date.now()){
                    // throw new BadRequestError('Code timeout');
                    throw new ValidationError([{path:'code',msg:'Code timeout'}]);
                }
                const guardObj=authConfig.guards[guard];
                const model=authConfig.providers[guardObj.provider]?.model;
                if(model){
                    const user=await model.findOne({where:{email:passResetCode.email}});
                    if(user){
                        const payload = {
                            id: user.id,
                            guard,
                            uniqueId: `${Date.now()}-${Math.random()}`,
                          };
                        const verification_token=jwt.sign(payload,'sec.abood');
                        await PasswordResetCode.update({signature:null,revoked:true},{where:{email,guard}})
                        const signature=verification_token.split('.')[2];
                        await passResetCode.update({signature});
                        res.cookie("verification_token", verification_token, {
                            httpOnly: true,
                            sameSite: "None",
                            secure: true,
                            maxAge: passResetConfig.expiresAfter * 60 * 1000,
                          });
                        return true;
                    }
                }
            }else{
                passResetCode.attemps-=1;
            }
            await passResetCode.save();
        }
        // throw new BadRequestError('Invalid Code');
        throw new ValidationError([{path:'code',msg:`Invalid Code, Remaining Attemps: ${passResetCode.attemps}`}]);
    }

    async update(req,res){
        // everything was verified
        const {password}=req.body;
        const {targetUserEmail, targetUserGuard}=req; // added by verifyPassResetToken Middleware
        // revoke all reset tokens and codes for this user
        
        await PasswordResetCode.update({revoked:true,signature:null},{where:{guard:targetUserGuard,email:targetUserEmail}});
        res.clearCookie("verification_token", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        });
        // update password
        const guardObj=authConfig.guards[targetUserGuard];
        const model=authConfig.providers[guardObj.provider]?.model;
        const user=await model.findOne({where:{email:targetUserEmail,guard:targetUserGuard}});
        await user.update({password:bcrypt.hashSync(password,12)});
        return user;
    }
}

module.exports=CodePasswordReset;
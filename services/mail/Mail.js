const mailConfig = require("../../config/mailConfig");
const nodemailer=require('nodemailer');
const NotFoundError = require("../../Errors/ErrorTypes/NotFoundError");
const VerifyEmailToken = require("../../models/verifyEmailToken");
const crypto=require('crypto');

class Mail{
    #transporters={};

    constructor(){
        return Mail.instance??=this;
    }
    getTransporter(service){
        return this.#transporters[service];
    }
    setup(){
        this.#createTransporters();
    }    

    #createTransporters(){
        const {mails}=mailConfig;
        for(let mail in mails){
            const mailObj=mails[mail];
            this.#transporters[mailObj.service]=nodemailer.createTransport({
                ...mailObj
            })
             this.#transporters[mailObj.service].verify((error, success) => {
                if (error) {
                    console.log(error);
                    throw new Error(`Error configuring transporter: ${mail}`);
                }   
            });
        }
    }

    applyMailing(model){
        // object level
        model.prototype.sendEmail=async function({ subject,html}){
            const {email}=this;
            const service=email.split('@')[1]?.split('.')[0];
            const transporter=new Mail().getTransporter(service);
            if(!transporter){
                throw new Error(`Transporter Not Found for this service: ${service}`)
            }
            transporter.sendMail({
                from:{
                    name:'Node-Starter',
                    address:transporter.options.auth.user,
                },
                to:email,
                subject,
                html
            })
            return true;
        };
        model.prototype.verifyEmail=async function(){
            const {email,guard}=this;
            const count=await VerifyEmailToken.count({where:{email,guard,revoked:false}});
            if(count){
                return 'Verification message already sent, check your email.'
            }
            const service=email.split('@')[1]?.split('.')[0];
            const code=Math.floor(100000 + Math.random() * 900000).toString();
            // const token=crypto.randomBytes(32).toString('hex');
            // const hashedToken=crypto.createHash('sha256').update(token).digest('hex');
            // const url=isApi
            // ?`${process.env.APP_Url}:${process.env.PORT||3000}/api/auth/verify-email/${hashedToken}?email=${email}`
            // :`${process.env.APP_Url}:${process.env.PORT||3000}/auth/verify-email/${hashedToken}?email=${email}`
            // const url=hostUrl
            // ?`${hostUrl}/verify-email/${hashedToken}?email=${email}`
            // :`${process.env.APP_Url}:${process.env.PORT||3000}/auth/verify-email/${hashedToken}?email=${email}`;
            await VerifyEmailToken.update({revoked:true},{where:{email,guard}})            
            const verifyEmailToken=await VerifyEmailToken.create({
                email,
                guard,
                code,
            });
            console.log({code})
            // const transporter=new Mail().getTransporter(service);
            // if(!transporter){
            //     throw new Error(`Transporter Not Found for this service: ${service}`)
            // }
            // transporter.sendMail({
            //     from:{
            //         name:'Node-Starter',
            //         address:transporter.options.auth.user,
            //     },
            //     to:email,
            //     subject: 'Email Verification',
            //     html: `<p>Hello ${this.name},</p>
            //         <p>Thank you for registering. Please click the link below to verify your email address:</p>
            //         <p>${url}</p>`
            // })
            // if(!info){
            //     throw new Error('Something went wrong when sending email');
            // }
            return 'Verifivation message was sent, check your email';
        };
        // class level
        model.sendEmail=async function(email,{subject,html}){
            const user=await this.findOne({where:{email}});
            if(!user){
                throw new NotFoundError(`user with id {${email}} not found`);
            }
            const service=email.split('@')[1]?.split('.')[0];
            const transporter=new Mail().getTransporter(service);
            if(!transporter){
                throw new Error(`Transporter Not Found for this service: ${service}`)
            }
            transporter.sendMail({
                from:{
                    name:'Node-Starter',
                    address:transporter.options.auth.user,
                },
                to:email,
                subject,
                html
            })
            // return info?.messageId ? true:false;
            return true;
        };
    }

    async sendEmail(email,{subject,html}){
        const service=email.split('@')[1]?.split('.')[0];
        const transporter=new Mail().getTransporter(service);
        if(!transporter){
            throw new Error(`Transporter Not Found for this service: ${service}`)
        }
        transporter.sendMail({
            from:{
                name:'Node-Starter',
                address:transporter.options.auth.user,
            },
            to:email,
            subject,
            html
        })
        // return info?.messageId ? true:false;
        return true;
    };
}


module.exports=Mail;
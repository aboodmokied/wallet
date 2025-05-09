const authConfig = require("../../config/authConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const CreateByAdminRequest = require("../../models/CreateByAdminRequest");
const crypto=require('crypto');
const bcrypt=require('bcryptjs');
const ValidationError = require("../../Errors/ErrorTypes/ValidationError");
const Mail = require("../mail/Mail");


class ByAdminRegister{
    constructor(){
        return ByAdminRegister.instance??=this;
    }

    async request(req){
        const {email,guard}=req.body;
        const count=await CreateByAdminRequest.count({where:{email,guard,revoked:false}});
        if(count){
            // throw new BadRequestError('Create Admin Request already created for this email, the user should check his mailbox');
            // return res.with('errors',[{msg:'Create By Admin Request already created for this email and guard, the user should check his mailbox'}]).redirect(`/auth/register-by-admin/request/${guard}`)
            throw new ValidationError([{msg:'Create By Admin Request already created for this email and guard, the user should check his mailbox'}])
        }
        const guardObj=authConfig.guards[guard];
        if(guardObj.registeration!=='by-admin' && guardObj.registeration!=='by-system-owner'){
            throw new BadRequestError('Process not allowed for this guard');
        }
        const token=crypto.randomBytes(32).toString('hex');
        const hashedToken=crypto.createHash('sha256').update(token).digest('hex');
        await CreateByAdminRequest.create({email,guard,token:hashedToken});
        const url=`${process.env.APP_URL}/web/auth/register-by-admin/${hashedToken}?email=${email}`;
        const mail=new Mail();
        await mail.sendEmail(email,{
            subject:'Create Admin Account',
            html:`<p>Hello Dear New Admin,</p>
                  <p>We choose you to be new admin in our application. Please click the link below to complete the process and create your account:</p>
                  <p>${url}</p>`
        })
        return 'process was succeed, check user email for complete account creation';
    }

    async create(req){
        const Authorize=require('../authorization/Authorize');
        const {token,password,guard}=req.body;
        await CreateByAdminRequest.update({revoked:true},{where:{token,guard}});
        const guardObj=authConfig.guards[guard];
        const userModel=authConfig.providers[guardObj.provider]?.model;
        const newUser=await userModel.create({
            ...req.body,
            password:bcrypt.hashSync(password,12),
            verified:true,
            guard
        });
        await new Authorize().applySystemRoles(newUser);
        return newUser;
    }
}

module.exports=ByAdminRegister;
const AuthenticationError = require("../../Errors/ErrorTypes/AuthenticationError");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const Admin = require("../../models/Admin");
const CreateAdminRequest = require("../../models/CreateAdminRequest");
const Mail = require("../../services/mail/Mail");
const tryCatch = require("../../util/tryCatch");
const crypto=require('crypto');
const bcrypt=require('bcryptjs');

exports.createRequest=(req,res,next)=>{
     res.render('admin/request',{
        pageTitle:'Create Admin Request'
     });
};

exports.storeRequest=tryCatch(async(req,res,next)=>{
    const {email}=req.body;
    const count=await CreateAdminRequest.count({where:{email,revoked:false}});
    if(count){
        // throw new BadRequestError('Create Admin Request already created for this email, the user should check his mailbox');
        return res.with('errors',[{msg:'Create Admin Request already created for this email, the user should check his mailbox'}]).redirect('/auth/create-admin/request')
    }
    const token=crypto.randomBytes(32).toString('hex');
    const hashedToken=crypto.createHash('sha256').update(token).digest('hex');
    await CreateAdminRequest.create({email,token:hashedToken});
    const url=`${process.env.APP_URL}:${process.env.PORT||3000}/auth/create-admin/${hashedToken}?email=${email}`;
    // const mail=new Mail();
    // await mail.sendEmail(email,{
    //     subject:'Create Admin Account',
    //     html:`<p>Hello Dear New Admin,</p>
    //           <p>We choose you to be new admin in our application. Please click the link below to complete the process and create your account:</p>
    //           <p>${url}</p>`
    // })
    console.log({url});
    res.with('message','process was succeed, check user email for complete account creation').redirect('/auth/create-admin/request');
});


exports.create=tryCatch(async(req,res,next)=>{
    const {email}=req.query;
    const {token}=req.params;
    const createAdminRequest=await CreateAdminRequest.findOne({where:{token,revoked:false}});
    console.log({email,token,other:createAdminRequest})
    if(!createAdminRequest){
        throw new BadRequestError('Invalid request or the process was revoked by the system.');
    }
    if(email!==createAdminRequest.email){
        throw new BadRequestError('Invalid Email');
    };
    res.render('admin/create',{
        pageTitle:'Create Admin Account',
        token,
        email
    })
});

exports.store=tryCatch(async(req,res,next)=>{
    const {token,password}=req.body;
    await CreateAdminRequest.update({revoked:true},{where:{token}});
    const newAdmin=await Admin.create({
        ...req.body,
        password:bcrypt.hashSync(password,12),
        verified:true,
        isSuper:false,
        guard:'admin'
    });
    req.session.targetUser=newAdmin;
    res.redirect('/auth/quick-login');
});
const authConfig = require("../../config/authConfig");
const ValidationError = require("../../Errors/ErrorTypes/ValidationError");
const User = require("../../models/User");
const QueryFeatures = require("../../util/QueryFeatures");
const tryCatch = require("../../util/tryCatch");

exports.index=tryCatch(async(req,res,next)=>{
    const {guard}=req.params;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const qf=new QueryFeatures(req);
    const {data,responseMetaData}=await qf.findAllWithFeatures(model,{
        guard
    })
    res.send({status:true,result:{
        users:data,
        responseMetaData,
        guard
    }})
});

exports.show=tryCatch(async(req,res,next)=>{
    // BEFORE: type validation
    const {guard,id}=req.params;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const user=await model.findByPk(id);
    const userRoles=await user.getRoles();
    res.render('user/user-details',{
        pageTitle:'Profile',
        user,
        userRoles
    })
})

exports.getUserRoles=tryCatch(async(req,res,next)=>{
    const {guard,user_id}=req.params;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const user=await model.findByPk(user_id);
    const userRoles=await user.getRoles();
    const userAvailableRoles=await user.getAvaliableRoles();
    res.send({status:true,result:{
        user,
        userRoles,
        userAvailableRoles
    }});
});


exports.userAssignRole=tryCatch(async(req,res,next)=>{
    const {user_id,guard,role_id}=req.body;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const user=await model.findByPk(user_id);
    await user.assignRole(role_id);
    res.send({status:true,result:{
        message:'Role Assigned Successfully'
    }})
});
exports.userRevokeRole=tryCatch(async(req,res,next)=>{
    const {user_id,guard,role_id}=req.body;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const user=await model.findByPk(user_id);
    await user.revokeRole(role_id);
    res.send({status:true,result:{
        message:'Role Revoked Successfully'
    }})
});


exports.getUserByPhone=tryCatch(async(req,res,next)=>{
    const {target_phone}=req.body;
    const user=await User.findOne({where:{phone:target_phone}});
    res.send({status:true,result:{user}})
});
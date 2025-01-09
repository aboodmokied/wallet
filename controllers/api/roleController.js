const Role = require("../../models/Role");
const QueryFeatures = require("../../util/QueryFeatures");

exports.index=tryCatch(async(req,res,next)=>{
    const qf=new QueryFeatures(req);
    const {data,responseMetaData}=await qf.findAllWithFeatures(Role);
    res.send({status:true,result:{
        roles:data,
        responseMetaData
    }})        
})


exports.store=tryCatch(async(req,res,next)=>{
    const {name}=req.body;
    await Role.create({name});
    res.status(201).send({status:true,result:{
        message:'Role Created Successfully'
    }})
})


exports.show=tryCatch(async(req,res,next)=>{
    const {role_id}=req.params;
    const role=await Role.findByPk(role_id);
    const rolePermissions=await role.getPermissions();
    const availablePermissions=await role.getAvailablePermissions();
    res.send({status:true,result:{
        role,
        rolePermissions,
        availablePermissions
    }})
})


exports.destroy=tryCatch(async(req,res,next)=>{
    const {role_id}=req.params;
    const role=await Role.findByPk(role_id);
    if(role.isMain){
        throw new BadRequestError('main role not deletable');
    }
    await role.destroy();
    res.send({status:true,result:{
        message:'Role Deleted Successfully'
    }})
})


exports.assignPermission=tryCatch(async(req,res,next)=>{
    const {role_id:role,permission_id:permission}=req.body;
    await Role.assignPermission(role,permission);
    res.send({status:true,result:{
        message:'Permission Assigned Successfully'
    }})
})

exports.revokePermission=tryCatch(async(req,res,next)=>{
    const {role_id:role,permission_id:permission}=req.body;
    await Role.revokePermission(role,permission);
    res.send({status:true,result:{
        message:'Permission Revoked Successfully'
    }})
})
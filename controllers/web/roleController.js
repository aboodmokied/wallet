const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const Permission = require("../../models/Permission");
const Role = require("../../models/Role")
const tryCatch = require("../../util/tryCatch")

exports.index=tryCatch(async(req,res,next)=>{
    const roles=await Role.findAll();
    const systemRoles=roles.filter(role=>role.isMain);
    const customRoles=roles.filter(role=>!role.isMain);
    // res.send({status:true,result:roles});
    res.render('authorization/roles',{
        pageTitle:'Roles',
        systemRoles,
        customRoles
    })
})

exports.create=(req,res,next)=>{
    res.render('authorization/create-role',{
        pageTitle:'Create Role',
    })
}

exports.store=tryCatch(async(req,res,next)=>{
    const {name}=req.body;
    const result=await Role.create({name});
    res.redirect(`/cms/role/${result.id}`);
})

exports.show=tryCatch(async(req,res,next)=>{
    const {roleId}=req.params;
    const role=await Role.findByPk(roleId);
    const rolePermissions=await role.getPermissions();
    const availablePermissions=await role.getAvailablePermissions();
    req.session.pagePath=req.path;
    res.render('authorization/role-details',{
        pageTitle:'Role Details',
        rolePermissions,
        availablePermissions,
        role
    })
})


exports.destroy=tryCatch(async(req,res,next)=>{
    const {roleId}=req.params;
    const role=await Role.findByPk(roleId);
    if(role.isMain){
        throw new BadRequestError('main role not deletable');
    }
    await role.destroy();
    res.redirect('/cms/role');
})

exports.assignPermission=tryCatch(async(req,res,next)=>{
    const {roleId:role,permissionId:permission}=req.body;
    const result=await Role.assignPermission(role,permission);
    res.redirect(`/cms/role/${role}`)
})

exports.revokePermission=tryCatch(async(req,res,next)=>{
    const {roleId:role,permissionId:permission}=req.body;
    const result=await Role.revokePermission(role,permission);
    res.redirect(`/cms/role/${role}`)
})


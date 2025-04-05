const Role = require("../../models/Role");
const tryCatch = require("../../util/tryCatch");

exports.index=tryCatch(async(req,res,next)=>{
    const systemRoles=await Role.findAll({where:{isMain:true}});
    const customRoles=await Role.findAll({where:{isMain:false}});
    res.render('authorization/roles',{
        pageTitle:'Roles',
        systemRoles,
        customRoles
    })        
})
exports.create=(req,res,next)=>{
    req.session.pagePath=req.originalUrl;
    res.render('authorization/create-role',{
        pageTitle:'Create Role'
    })
}

exports.store=tryCatch(async(req,res,next)=>{
    const {name}=req.body;
    const newRole=await Role.create({name});
    res.redirect(`/web/cms/role/${newRole.id}`);
})


exports.show=tryCatch(async(req,res,next)=>{
    const {role_id}=req.params;
    const role=await Role.findByPk(role_id);
    const rolePermissions=await role.getPermissions();
    const availablePermissions=await role.getAvailablePermissions();
    res.render('authorization/role-details',{
        role,
        rolePermissions,
        availablePermissions
    })
})


exports.destroy=tryCatch(async(req,res,next)=>{
    const {role_id}=req.params;
    const role=await Role.findByPk(role_id);
    if(role.isMain){
        throw new BadRequestError('main role not deletable');
    }
    await role.destroy();
    res.redirect('/web/cms/role')
})


exports.assignPermission=tryCatch(async(req,res,next)=>{
    const {role_id:role,permission_id:permission}=req.body;
    await Role.assignPermission(role,permission);
    res.redirect(`/web/cms/role/${role}`);
})

exports.revokePermission=tryCatch(async(req,res,next)=>{
    const {role_id:role,permission_id:permission}=req.body;
    await Role.revokePermission(role,permission);
    res.redirect(`/web/cms/role/${role}`);
})
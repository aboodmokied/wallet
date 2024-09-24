const authConfig = require("../../config/authConfig");
const tryCatch = require("../../util/tryCatch");

exports.index=tryCatch(async(req,res,next)=>{
    // BEFORE: type validation
    const {guard}=req.params;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const users=await model.findAll({where:{guard:guard}});
    req.session.pagePath=req.path;
    res.render('user/users',{
        pageTitle:guard,
        users,
        guard
    })
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
    const {guard,id}=req.params;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const user=await model.findByPk(id);
    const userRoles=await user.getRoles();
    const userAvailableRoles=await user.getAvaliableRoles();
    res.render('user/user-roles',{
        pageTitle:'User Roles',
        user,
        userRoles,
        userAvailableRoles
    })
});


exports.userAssignRole=tryCatch(async(req,res,next)=>{
    const {userId,guard,roleId}=req.body;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const user=await model.findByPk(userId);
    await user.assignRole(roleId);
    res.redirect(`/cms/user-roles/${guard}/${userId}`)
});
exports.userRevokeRole=tryCatch(async(req,res,next)=>{
    const {userId,guard,roleId}=req.body;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const user=await model.findByPk(userId);
    await user.revokeRole(roleId);
    res.redirect(`/cms/user-roles/${guard}/${userId}`)
});
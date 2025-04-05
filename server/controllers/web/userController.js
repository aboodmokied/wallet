const authConfig = require("../../config/authConfig");
const User = require("../../models/User");
const tryCatch = require("../../util/tryCatch");

exports.index=tryCatch(async(req,res,next)=>{
    // BEFORE: type validation
    const {guard}=req.params;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const users=await model.findAll({where:{guard:guard}});
    res.render('user/users',{
        pageTitle:guard,
        users,
        guard
    })
});

exports.show=tryCatch(async(req,res,next)=>{
    // BEFORE: type validation
    const {guard,user_id}=req.params;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const user=await model.findByPk(user_id);
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
    res.render('user/user-roles',{
        pageTitle:'User Roles',
        user,
        userRoles,
        userAvailableRoles
    })
});


exports.userAssignRole=tryCatch(async(req,res,next)=>{
    const {user_id,guard,role_id}=req.body;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const user=await model.findByPk(user_id);
    await user.assignRole(role_id);
    res.redirect(`/web/cms/user-roles/${guard}/${user_id}`)
});
exports.userRevokeRole=tryCatch(async(req,res,next)=>{
    const {user_id,guard,role_id}=req.body;
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const user=await model.findByPk(user_id);
    await user.revokeRole(role_id);
    res.redirect(`/web/cms/user-roles/${guard}/${user_id}`)
});



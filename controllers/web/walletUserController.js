const authConfig = require("../../config/authConfig");
const AuthorizationError = require("../../Errors/ErrorTypes/AuthorizationError");
const QueryFeatures = require("../../util/QueryFeatures");
const tryCatch = require("../../util/tryCatch");

exports.index=tryCatch(async(req,res,next)=>{
    // BEFORE: type validation
    const {guard}=req.params;
    if(guard=='admin'||guard=='systemOwner'){
        throw new AuthorizationError('Not Allowed to see this user type');
    }
    const guardObj=authConfig.guards[guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    // const users=await model.findAll({where:{guard:guard}});
    const queryFeatures = new QueryFeatures(req);
    const users=await queryFeatures.findAllWithFeatures(model);
    req.session.pagePath=req.path;
    res.render('wallet/wallet-user/users',{
        pageTitle:guard,
        users:users.data,
        guard,
        responseMetaData:users.responseMetaData
    })
});

exports.show=tryCatch(async(req,res,next)=>{
    // BEFORE: type validation
    const {guard,id}=req.params;
    if(guard=='admin'||guard=='systemOwner'){
        throw new AuthorizationError('Not Allowed to see this user type');
    }
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

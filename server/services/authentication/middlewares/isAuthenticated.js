const authConfig = require("../../../config/authConfig");

module.exports=(req,res,next)=>{
    if(req.session?.isAuthenticated){
        return next();
    }
    res.redirect(`/web/auth/login/${authConfig.defaults.defaultGuard}`);
}
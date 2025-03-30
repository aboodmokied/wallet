const authConfig = require("../config/authConfig");

const appendGuardsToLocals=(req,res,next)=>{
    const {guards}=authConfig;
    res.locals.systemGuards=guards;
    return next();
};

module.exports=appendGuardsToLocals;
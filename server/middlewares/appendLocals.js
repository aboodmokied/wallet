const appendLocals=(req,res,next)=>{
    if(req.session.flash){
        res.locals=req.session.flash;
        req.session.flash=undefined;
    }
    next();
};

module.exports=appendLocals;
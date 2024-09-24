const addWith=(req,res,next)=>{
    res.with=(key,value)=>{
        if(!req.session.flash){
            req.session.flash={};
        }
        req.session.flash={...req.session.flash,[key]:value}
        return res;
    }
    next();
}

module.exports=addWith;
const methodOverride=(req,res,next)=>{
    const {_method}=req.body;
    if(_method==='DELETE' || _method==='PUT' || _method==='PATCH'){
        req.method=_method;
        delete req.body._method;
    }
    next();
}

module.exports=methodOverride;
// save page path for validation errors handlling
const saveGetPageRequestPath=(req,res,next)=>{
    if(req.method=='GET'){
        if(!req.isApiRequest){
            req.session.pagePath=req.path;
        }
    }
    next();
}

module.exports=saveGetPageRequestPath;
// save page path for validation errors handlling
const saveGetPageRequestPath=(req,res,next)=>{
    if(req.method=='GET'){
        if(!req.isApiRequest){
            req.session.pagePath=req.originalUrl;
        }
    }
    next();
}

module.exports=saveGetPageRequestPath;
const AppError = require("../Errors/AppError");
const {Server} = require("../config/errorConfig");
const { errorLogger } = require("../logging/Logger");

const errorHandler=(error,req,res,next)=>{
    console.log(error);
    // custom error
    if(error instanceof AppError){
        // check guard param not found..
        if(error.type==="Validation"){
            const {errors}=error;
            // check guard param not found..
            const notFound=errors.find(error=>error.location=='params');
            if(notFound){
                const NotFoundError = require("../Errors/ErrorTypes/NotFoundError");
                error=new NotFoundError(notFound.msg);
            }
        } 
        const {type,message,statusCode}=error;
        errorLogger.error(`OperationalError: ${req.method} - ${req.url} - ${type} - ${statusCode} - ${message}`);
        if(error.type==="Validation"){ 
            const {errors}=error;
            if(!req.isApiRequest){
                const {pagePath='/'}=req.session;
                req.session.pagePath=undefined;
                return res.status(error.statusCode).with('old',req.body).with('errors',errors).redirect(pagePath);
            }
            return res.status(error.statusCode).send({status:false,error:{type,message,errors}})
            
            
        }
        if(!req.isApiRequest){
            return res.render('error/index',{error});
        }
        return res.status(error.statusCode).send({status:false,error:{type,message}});
    }
    // server error
    console.log(error);
    // errorLogger.error(`ServerError: 500 - ${error.stack}`); 
    res.status(Server.statusCode).send({status:false,error:{type:Server.type,message:Server.message}});
}

module.exports=errorHandler;

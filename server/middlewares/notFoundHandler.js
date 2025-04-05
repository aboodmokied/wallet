const NotFoundError = require("../Errors/ErrorTypes/NotFoundError");

const notFoundHandler=(req,res,next)=>{
    throw new NotFoundError(`this path '${req.originalUrl}' not found`);
};

module.exports=notFoundHandler;
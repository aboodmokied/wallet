const NotFoundError = require("../Errors/ErrorTypes/NotFoundError");

const notFoundHandler=(req,res,next)=>{
    throw new NotFoundError(`this path '${req.path}' not found`);
};

module.exports=notFoundHandler;
const {BadRequest} = require("../../config/errorConfig");
const AppError = require("../AppError");

class BadRequestError extends AppError{
    constructor(message=BadRequest.message,statusCode=BadRequest.statusCode){
        super(message);
        this.type=BadRequest.type;
        this.statusCode=statusCode;
    }
}

module.exports=BadRequestError;
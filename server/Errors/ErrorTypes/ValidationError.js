const {Validation} = require("../../config/errorConfig");
const AppError = require("../AppError");

class ValidationError extends AppError{
    errors=[];
    constructor(errors,message=Validation.message,statusCode=Validation.statusCode){
        super(message);
        this.type=Validation.type;
        this.statusCode=statusCode;
        this.errors=errors;
    }
}

module.exports=ValidationError;
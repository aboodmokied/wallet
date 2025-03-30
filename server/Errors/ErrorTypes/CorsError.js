const {Cors} = require("../../config/errorConfig");
const AppError = require("../AppError");

class CorsError extends AppError{
    constructor(message=Cors.message,statusCode=Cors.statusCode){
        super(message);
        this.type=Cors.type;
        this.statusCode=statusCode;
    }
}

module.exports=CorsError;
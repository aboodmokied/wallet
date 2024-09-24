const {Authorization} = require("../../config/errorConfig");
const AppError = require("../AppError");

class AuthorizationError extends AppError{
    constructor(message=Authorization.message,statusCode=Authorization.statusCode){
        super(message);
        this.type=Authorization.type;
        this.statusCode=statusCode;
    }
}

module.exports=AuthorizationError;
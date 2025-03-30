const {RateLimit} = require("../../config/errorConfig");
const AppError = require("../AppError");

class RateLimitExceededError extends AppError{
    constructor(message=RateLimit.message,statusCode=RateLimit.statusCode){
        super(message);
        this.type=RateLimit.type;
        this.statusCode=statusCode;
    }
}

module.exports=RateLimitExceededError;
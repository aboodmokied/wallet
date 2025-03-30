const {Verification} = require("../../config/errorConfig");
const AppError = require("../AppError");

class VerificationError extends AppError{
    constructor(message=Verification.message,statusCode=Verification.statusCode){
        super(message);
        this.type=Verification.type;
        this.statusCode=statusCode;
    }
}

module.exports=VerificationError;
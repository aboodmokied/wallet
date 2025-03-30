const {validationResult}=require('express-validator');
const ValidationError=require('../../Errors/ErrorTypes/ValidationError');
// handles validations result
const checkResult=(req,res,next)=>{
    const errors=validationResult(req);
    if(errors.isEmpty()){
        return next();
    }

    throw new ValidationError(errors.array({onlyFirstError:true})); // into global handler
}

const validateRequest=(validations)=>{
    return [...validations,checkResult];
}



module.exports=validateRequest;
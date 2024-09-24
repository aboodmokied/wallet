module.exports={
    NotFound:{
        type:"NotFound",
        message:'Not Found',
        statusCode:404
    },
    Authentication:{
        type:"Authentication",
        message:'Unauthorized',
        statusCode:401
    },
    Authorization:{
        type:"Authorization",
        message:'Forbidden',
        statusCode:403
    },
    BadRequest:{
        type:"BadRequest",
        message:'Bad Request',
        statusCode:400
    },
    Validation:{
        type:"Validation",
        message:'Invalid Input',
        statusCode:400
    },
    Verification:{
        type:"Verification",
        message:'Not Verified',
        statusCode:403
    },
    RateLimit:{
        type:"RateLimit",
        message:'Too many requests from this IP, please try again later',
        statusCode:429
    },
    Cors:{
        type:"Cors",
        message:'Not allowed by CORS',
        statusCode:401
    },
    Server:{
        type:"Server",
        message:'Something went wrong',
        statusCode:500
    }
}
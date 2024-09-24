const rateLimit=require('express-rate-limit');
const RateLimitExceededError = require('../Errors/ErrorTypes/RateLimitExceededError');
const {rateLimitConfig} = require('../config/securityConfig');

const limiter=(type='api')=>{
    return rateLimit({
        windowMs:rateLimitConfig.periodInMinutes * 60 * 1000,
        max:rateLimitConfig.times[type],
        handler: (req, res, next) => {
            next(new RateLimitExceededError());
        }
    });
}


module.exports=limiter;
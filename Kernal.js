// for apply middlewares
const express=require('express');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const limiter = require('./middlewares/limiter');
const helmet=require('helmet');
const xss=require('xss-clean');
const {payloadConfig} = require('./config/securityConfig');
const corsMiddleware = require('./middlewares/corsMiddleware');
const verifyUser = require('./services/authentication/middlewares/verifyUser');
const session=require('express-session');
const differentiateRequests = require('./middlewares/differentiateRequests');
const addWith = require('./middlewares/addWith');
const appendLocals = require('./middlewares/appendLocals');
const methodOverride=require('./middlewares/methodOverride');
const userToLocals = require('./middlewares/userToLocals');
const notFoundHandler = require('./middlewares/notFoundHandler');
const hpp = require('hpp');
const Kernal={
    global:[
        requestLogger,
        express.json({limit:payloadConfig.maxSize}), // limiting the payload size for prevent denial-of-service (DoS) attacks
        express.urlencoded({limit:payloadConfig.maxSize,extended:true}), // limiting the payload size for prevent denial-of-service (DoS) attacks
        xss(), //prevent Cross-Site Scripting (XSS) attacks
        session({
            secret: 'test', // Replace with a secret key of your choice
            resave: false, // Don't save session if unmodified
            saveUninitialized: true, // Save uninitialized sessions
            cookie: {
              secure: false, // Note: `secure` should be true in production when using HTTPS
              httpOnly: true // Ensures the cookie is not accessible via JavaScript
            }
          }),
        differentiateRequests  
    ],
    security:[
        helmet(), // adds many security headers
        corsMiddleware(),
        hpp()
    ],
    api:[limiter('api')],
    web:[limiter('web'),verifyUser,addWith,appendLocals,methodOverride,userToLocals],
    error:[notFoundHandler,errorHandler]
}

module.exports=Kernal;
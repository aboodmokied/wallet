const cors=require('cors');
const {corsConfig}=require('../config/securityConfig');
const CorsError = require('../Errors/ErrorTypes/CorsError');

const corsOptions={
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: (origin, callback) => {
        if (corsConfig.allowedOrigins.indexOf(origin) !== -1 || !origin || origin == 'null') {
          callback(null, true);
        } else {
          callback(new CorsError());
        }
    },
    credentials: true,
    optionsSuccessStatus: 204
};

const corsMiddleware=()=>cors(corsOptions);

module.exports=corsMiddleware
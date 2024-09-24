const express=require('express');
require('dotenv').config();
const Application = require('./Application');
const { errorLogger, logger } = require('./logging/Logger');
const app=express();

const application=new Application();

application.run(app).then(()=>{
    const PORT=process.env.PORT || 3000;
    app.listen(PORT,()=>{
        logger.info(`Server is running on port ${PORT}`);
    })
    
}).catch(error=>{
    console.log(error);
    // errorLogger.error(`ServerRunningError: 500 - ${error.stack}`);
})

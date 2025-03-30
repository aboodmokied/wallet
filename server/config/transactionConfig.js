const Charging = require("../models/Charging");
const Payment = require("../models/Payment");
const Transfer = require("../models/Transfer");

const transactionConfig={
    operations:{
        transfer:{
            model:Transfer,
        },
        payment:{
            model:Payment,
        },
        charging:{
            model:Charging,
        },

    }
};

module.exports=transactionConfig;
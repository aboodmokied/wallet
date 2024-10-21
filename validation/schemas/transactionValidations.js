const { targetPhone, amount } = require("../validations");

exports.transferValidation=[
    targetPhone,
    amount,
];
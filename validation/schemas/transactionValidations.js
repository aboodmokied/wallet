const { targetPhone, amount, targetCompanyPhone } = require("../validations");

exports.transferValidation=[
    targetPhone,
    amount,
];

exports.paymentValidation=[
    targetCompanyPhone,
    amount,
];
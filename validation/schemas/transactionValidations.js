const { targetPhone, amount } = require("../validations");

exports.transferValidation=[
    targetPhone,
    amount,
];

exports.paymentValidation=[
    target_company_phone,
    amount,
];
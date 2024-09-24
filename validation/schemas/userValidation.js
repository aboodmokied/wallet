const { validateGuard, validateUserExistance } = require("../validations");

exports.usersPageValidation=[
    validateGuard('param'),
];

exports.userPageValidation=[
    validateGuard('param'),
    validateUserExistance

];
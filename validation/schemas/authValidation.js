const { validateEmail, validateEmailExistence, validateName, validateGuard, validatePassword, validateConfirmPassword, validateRegisterPassword, validateLoginPassword, validateEmailIsFound, validateToken, validateEmailAsQuery, normalizeEmailInQuery, validateOauthGuard, validateOauthProcess } = require("../validations");


exports.loginPageValidation=[
    validateGuard('param')
]
exports.loginValidation=[
    validateEmail,
    validateGuard('body'),
    validateLoginPassword
]

exports.registerPageValidation=[
    validateGuard('param',true)
]

exports.registerValidation=[
    validateEmail,
    validateEmailExistence,
    validateName,
    validateGuard('body'),
    validateRegisterPassword,
    validateConfirmPassword
]


exports.requestResetPageValidation=[
    validateGuard('param')
];

exports.requestResetValidation=[
    validateGuard('body'),
    validateEmailIsFound
];

exports.resetPageValidation=[ 
    normalizeEmailInQuery
];

exports.resetValidation=[ // token email password
    validateToken,
    validateEmail,
    validateRegisterPassword,
    validateConfirmPassword
];


exports.verifyEmailValidation=[
    normalizeEmailInQuery
];


exports.oauthRequestValidation=[
    validateOauthProcess,
    validateOauthGuard
];
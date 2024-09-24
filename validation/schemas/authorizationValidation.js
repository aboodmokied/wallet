const { validateRoleName, validatePermissionExistance, validateRoleExistance } = require("../validations");


exports.createRoleValidation=[
    validateRoleName
]
exports.assignRolePermissionValidation=[
    validatePermissionExistance,
    validateRoleExistance('body')
]

exports.revokeRolePermissionValidation=[
    validatePermissionExistance,
    validateRoleExistance('body')
]

exports.rolePageValidation=[
    validateRoleExistance('param')
];
exports.deleteRoleValidation=[
    validateRoleExistance('param')
];

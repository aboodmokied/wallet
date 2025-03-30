const { body } = require("express-validator");
const Permission = require("../../models/Permission");

exports.validatePermissionExistance = body("permission_id")
  .notEmpty()
  .withMessage("Permission id required")
  .custom(async (permissionId) => {
    const count = await Permission.count({ where: { id: permissionId } });
    if (!count) {
      return Promise.reject("Permission not found");
    }
  });
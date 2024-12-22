const { body } = require("express-validator");
const Role = require("../../models/Role");

exports.validateRoleName = body("name")
  .notEmpty()
  .withMessage("Role Name Required")
  .custom(async (name) => {
    const count = await Role.count({ where: { name } });
    if (count) {
      return Promise.reject("Role Exists");
    }
  });

exports.validateRoleExistance = (existsIn = "body") => {
  const holder = require("express-validator")[existsIn];
  return holder("roleId")
    .notEmpty()
    .withMessage("Role id required")
    .custom(async (roleId) => {
      const count = await Role.count({ where: { id: roleId } });
      if (!count) {
        return Promise.reject("Role not found");
      }
    });
};
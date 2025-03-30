const { body } = require("express-validator");

exports.validateName = body("name")
  .notEmpty()
  .withMessage("Username Required")
  .isLength({ max: 30, min: 3 })
  .withMessage("Username length should be between 3 to 30");
const { body } = require("express-validator");

exports.validateRegisterPassword = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password must contain at least one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password must contain at least one number")
  .matches(/[\W_]/)
  .withMessage("Password must contain at least one special character");

exports.validateLoginPassword = body("password")
  .notEmpty()
  .withMessage("Password Required");

exports.validateConfirmPassword = body("confirm_password").notEmpty().withMessage('Confirm Password Required').custom(
  (input, { req }) => {
    if (input === req.body.password) {
      return true;
    }
    throw new Error("Password and Confirm Password are not compatable");
  }
);
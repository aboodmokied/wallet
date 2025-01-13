const { body, query } = require("express-validator");
const authConfig = require("../../config/authConfig");
const { mails } = require("../../config/mailConfig");

exports.validateEmail = body("email")
  .normalizeEmail()
  .notEmpty()
  .withMessage("Email Required")
  .isEmail()
  .withMessage("Invalid Email")
  .custom((email) => {
    const service = email.split("@")[1]?.split(".")[0];
    let valid = false;
    for (let mail in mails) {
      const mailObj = mails[mail];
      if (mailObj.service == service) {
        valid = true;
        break;
      }
    }
    // if(!valid){
    //     throw new Error(`Email type ${service} not supported`);
    // }
    return true;
  });


exports.validateEmailExistence = body("email")
  .normalizeEmail()
  .custom(async (input, { req }) => {
    const guardObj = authConfig.guards[req.body.guard];
    if (!guardObj) {
      return Promise.reject("AuthConfig Error");
    }
    const model = authConfig.providers[guardObj.provider]?.model;
    const count = await model.count({ where: { email: input } });
    if (count) {
      return Promise.reject("Email already in use");
    }
  });

exports.validateEmailIsFound = body("email")
  .notEmpty()
  .withMessage('Email Required')
  .normalizeEmail()
  .custom(async (input, { req }) => {
    const guardObj = authConfig.guards[req.body.guard];
    if (!guardObj) {
      return Promise.reject("AuthConfig Error");
    }
    const model = authConfig.providers[guardObj.provider]?.model;
    const count = await model.count({ where: { email: input } });
    if (!count) {
      return Promise.reject("Email not found");
    }
  });



exports.normalizeEmailInQuery = query("email").normalizeEmail();

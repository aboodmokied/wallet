const { param } = require("express-validator");
const authConfig = require("../../config/authConfig");

exports.validateRegisterByAdminGuard = (existsIn = "body", checks) => {
    const holder = require("express-validator")[existsIn];
    return holder("guard").custom((input) => {
      const guardObj = authConfig.guards[input];
      // const pass = guardObj.registeration.some((ele) => checks.includes(ele));
      const pass = checks.includes(guardObj.registeration);
      if (!pass) {
        throw new Error("Process not allowed for this guard");
      }
      return true;
    });
  };
  exports.validateGuard = (
    existsIn = "body",
    validateGlobalRegistration = false,
    validateSessionLogin = false,
    validateTokenLogin = false
  ) => {
    const holder = require("express-validator")[existsIn];
    return holder("guard")
      .notEmpty()
      .withMessage("Guard Required")
      .custom((input) => {
        let isValid = true;
        if (input in authConfig.guards) {
          // if(!validateGlobalRegistration){
          //     return true;
          // }
          const guardObj = authConfig.guards[input];
          if (validateGlobalRegistration) {
            isValid = guardObj.registeration == "global";
          }
          if (validateSessionLogin && isValid) {
            isValid = guardObj.drivers.includes("session");
          }
          if (validateTokenLogin && isValid) {
            isValid = guardObj.drivers.includes("token");
          }
          if (isValid) {
            return true;
          }
        }
        throw new Error("Invalid Guard");
      });
  };
  


  exports.validateOauthGuard = param("guard").custom((guard, { req }) => {
    if (guard in authConfig.guards) {
      const guardObj = authConfig.guards[guard];
      const { process } = req.params;
      if (process == "register") {
        if (guardObj.registeration == "global" && guardObj.oauth) {
          return true;
        }
      }
      if (guardObj.oauth) {
        return true;
      }
      throw new Error(`process not allowed for this guard ${guard}`);
    }
    throw new Error("Invalid Guard");
  });  
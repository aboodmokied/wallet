const { param } = require("express-validator");
const authConfig = require("../../config/authConfig");

exports.validateUserExistance = body("user_id").custom(async (id, { req }) => {
    const { guard } = req.body;
    if (guard in authConfig.guards) {
      const guardObj = authConfig.guards[guard];
      const model = authConfig.providers[guardObj.provider]?.model;
      const count = await model.count({ where: { id } });
      if (!count) {
        return Promise.reject("User not found");
      }
      return true;
    }
    throw new Error("Invalid Guard");
  });

  exports.validateUserInParam=param('user_id').custom(async(user_id,{req})=>{
    const guardObj=authConfig.guards[req.params.guard];
    const model=authConfig.providers[guardObj.provider]?.model;
    const count=await model.count({where:{id:user_id}});
    if(!count){
        return Promise.reject('No user with this user_id');
    }
})
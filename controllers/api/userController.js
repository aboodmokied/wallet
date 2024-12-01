const NotFoundError = require("../../Errors/ErrorTypes/NotFoundError");
const User = require("../../models/User");
const tryCatch = require("../../util/tryCatch");

exports.getUserByPhone = tryCatch(async (req, res, next) => {
  const { user_phone } = req.params;
  const user=await User.findOne({where:{phone:user_phone}});
  if(!user){
    throw new NotFoundError('user not found');
  }
  res.status(200).send({status:true,result:{user}});
});

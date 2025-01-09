const NotFoundError = require("../../Errors/ErrorTypes/NotFoundError");
const User = require("../../models/User");
const tryCatch = require("../../util/tryCatch");

exports.getUserByPhone = tryCatch(async (req, res, next) => {
  const { target_phone } = req.body;
  const user = await User.findOne({ where: { phone: target_phone } });
  if (!user) {
    throw new NotFoundError("user not found");
  }
  res.status(200).send({ status: true, result: { user } });
});

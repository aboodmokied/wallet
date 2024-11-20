const { Op } = require("sequelize");
const authConfig = require("../../config/authConfig");
const AuthorizationError = require("../../Errors/ErrorTypes/AuthorizationError");
const ChargingPointTransaction = require("../../models/ChargingPointTransaction");
const CompanyTransaction = require("../../models/CompanyTransaction");
const QueryFeatures = require("../../util/QueryFeatures");
const tryCatch = require("../../util/tryCatch");
const Transaction = require("../../models/Transaction");

exports.index = tryCatch(async (req, res, next) => {
  // BEFORE: type validation
  const { guard } = req.params;
  if (guard == "admin" || guard == "systemOwner") {
    throw new AuthorizationError("Not Allowed to see this user type");
  }
  const guardObj = authConfig.guards[guard];
  const model = authConfig.providers[guardObj.provider]?.model;
  // const users=await model.findAll({where:{guard:guard}});
  const queryFeatures = new QueryFeatures(req);
  const users = await queryFeatures.findAllWithFeatures(model);
  req.session.pagePath = req.path;
  res.render("wallet/wallet-user/users", {
    pageTitle: guard,
    users: users.data,
    guard,
    responseMetaData: users.responseMetaData,
  });
});

// exports.show = tryCatch(async (req, res, next) => {
//   // BEFORE: type validation
//   const { guard, id } = req.params;
//   if (guard == "admin" || guard == "systemOwner") {
//     throw new AuthorizationError("Not Allowed to see this user type");
//   }
//   const guardObj = authConfig.guards[guard];
//   const model = authConfig.providers[guardObj.provider]?.model;
//   const user = await model.findByPk(id);
//   let transactions = [];
//   const queryFeatures = new QueryFeatures(req);
//   if (guard == "user") {
//     transactions = await queryFeatures.findAllWithFeatures(Transaction,{
//         [Op.or]:[{user_id:user.id},{target_user_id:user.id}],
//         verified_at: { [Op.ne]: null }
//     });
//   } else if (guard == "company") {
//     transactions = await queryFeatures.findAllWithFeatures(CompanyTransaction,{
//         company_id: user.id
//     });
//   } else if (guard == "chargingPoint") {
//     transactions = await queryFeatures.findAllWithFeatures(ChargingPointTransaction,{
//         charging_point_id: user.id
//     });
//   } else {
//     throw new BadRequestError("This type of users has no transactions");
//   }
//   res.render("wallet/wallet-user/user-details", {
//     pageTitle: "Profile",
//     user,
//     transactions:transactions.data,
//     guard,
//     responseMetaData:transactions.responseMetaData
//   });
// });

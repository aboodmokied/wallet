const { Op } = require("sequelize");
const authConfig = require("../../config/authConfig");
const AuthorizationError = require("../../Errors/ErrorTypes/AuthorizationError");
const ChargingPointTransaction = require("../../models/ChargingPointTransaction");
const CompanyTransaction = require("../../models/CompanyTransaction");
const QueryFeatures = require("../../util/QueryFeatures");
const tryCatch = require("../../util/tryCatch");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");

exports.index = tryCatch(async (req, res, next) => {
  // BEFORE: type validation
  const { guard } = req.params;
  if (guard == "admin" || guard == "systemOwner") {
    throw new AuthorizationError("Not Allowed to see this user type");
  }
  const guardObj = authConfig.guards[guard];
  const model = authConfig.providers[guardObj.provider]?.model;
  const queryFeatures = new QueryFeatures(req);
  const {data,responseMetaData} = await queryFeatures.findAllWithFeatures(model);
  res.send({status:true,result:{
    users: data,
    guard,
    responseMetaData,
  }})
});
exports.show = tryCatch(async (req, res, next) => {
  // BEFORE: type validation
  const { guard,user_id } = req.params;
  if (guard == "admin" || guard == "systemOwner") {
    throw new AuthorizationError("Not Allowed to see this user type");
  }
  const guardObj = authConfig.guards[guard];
  const model = authConfig.providers[guardObj.provider]?.model;
  const user=await model.findByPk(user_id);
  let wallet;
  if(guard=='user'){
    wallet=await user.getWallet();
  }else if(guard=='company'){
    wallet=await user.getCompanyWallet();
  }
  res.send({status:true,result:{
    user,
    wallet
  }})
});


exports.getUserByPhone=tryCatch(async(req,res,next)=>{
  const {target_phone}=req.body;
  const user=await User.findOne({where:{phone:target_phone}});
  res.send({status:true,result:{user}})
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

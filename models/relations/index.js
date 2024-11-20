const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const AccessToken = require("../AccessToken");
const AuthClient = require("../AuthClient");
const Category = require("../Category");
const Charging = require("../Charging");
const ChargingPoint = require("../ChargingPoint");
const ChargingPointTransaction = require("../ChargingPointTransaction");
const Company = require("../Company");
const CompanyTransaction = require("../CompanyTransaction");
const CompanyWallet = require("../CompanyWallet");
const Payment = require("../Payment");
const Transaction = require("../Transaction");
const Transfer = require("../Transfer");
const User = require("../User");
const Wallet = require("../Wallet");

// user - role
// User.belongsToMany(Role,{
//     through:UserHasRole,
//     foreignKey:'userId',
//     otherKey:'roleId'
// })

// Role.belongsToMany(User,{
//     through:UserHasRole,
//     foreignKey:'roleId',
//     otherKey:'userId'
// })

// AccessToken - User

User.hasMany(AccessToken, {
  foreignKey: "userId",
});

AccessToken.belongsTo(User, {
  foreignKey: "userId",
});

// AccessToken - AuthClient
AuthClient.hasMany(AccessToken, {
  foreignKey: "clientId",
});

AccessToken.belongsTo(AuthClient, {
  foreignKey: "clientId",
});

// // user - wallet
User.hasOne(Wallet, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Wallet.hasOne(User, {
  foreignKey: "wallet_id",
  onDelete: "CASCADE",
});

// create a wallet automatically when new user was registered
User.afterCreate("Create User Wallet", async (user) => {
  const wallet = await Wallet.create({ user_id: user.id });
  await user.update({ wallet_id: wallet.id });
});

// // User,Wallet - transaction

// ** problem: how to set multi foreignKey for the same model
User.hasMany(Transaction, {
  foreignKey: "user_id",
  as: "sourceTransactions",
  onDelete: "NO ACTION",
});
User.hasMany(Transaction, {
  foreignKey: "target_user_id",
  as: "targetTransactions",
  onDelete: "NO ACTION",
});

Transaction.belongsTo(User, {
  foreignKey: "user_id",
  as: "sourceUser",
  onDelete: "NO ACTION",
});

Transaction.belongsTo(User, {
  foreignKey: "target_user_id",
  as: "targetUser",
  onDelete: "NO ACTION",
});

Wallet.hasMany(Transaction, {
  foreignKey: "wallet_id",
  as: "sourceTransactions",
  onDelete: "NO ACTION",
});

Wallet.hasMany(Transaction, {
  foreignKey: "target_wallet_id",
  as: "targetTransactions",
  onDelete: "NO ACTION",
});

Transaction.belongsTo(Wallet, {
  foreignKey: "wallet_id",
  as: "sourceWallet",
  onDelete: "NO ACTION",
});

Transaction.belongsTo(Wallet, {
  foreignKey: "target_wallet_id",
  as: "targetWallet",
  onDelete: "NO ACTION",
});

// // user,wallet - payment
User.hasMany(Payment, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Payment.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Wallet.hasMany(Payment, {
  foreignKey: "wallet_id",
  onDelete: "NO ACTION",
});

Payment.belongsTo(Wallet, {
  foreignKey: "wallet_id",
  onDelete: "NO ACTION",
});

// transaction - payment,transfer,charging
Transaction.hasOne(Payment, {
  foreignKey: "transaction_id",
});

// Payment.hasOne(Transaction, {
//   foreignKey: "operation_id",
// });

Transaction.hasOne(Charging, {
  foreignKey: "transaction_id",
});

// Charging.hasOne(Transaction, {
//   foreignKey: "operation_id",
// });

Transaction.hasOne(Transfer, {
  foreignKey: "transaction_id",
});

// Transfer.hasOne(Transaction, {
//   foreignKey: "operation_id",
// });

// after create transaction, create payment,transfer,charging automatically
// Transaction.afterUpdate('Create Transaction Operation (charging,payment,transfer) afeter transaction verification',async(transaction,{customData})=>{
//     if(transaction.verified_at){
//         switch(transaction.operation_type){
//             case 'charging':
//                 // create charging row by its payload
//                 await Charging.create({
//                     ...customData,
//                     transaction_id:transaction.id
//                 });
//             break;
//             case 'payment':
//                 // create payment row by its payload
//                 await Payment.create({
//                     ...customData,
//                     transaction_id:transaction.id
//                 });
//             break;
//             case 'transfer':
//                 // create transfer row by its payload
//                 await Transfer.create({
//                     ...customData,
//                     transaction_id:transaction.id
//                 });
//             break;
//             default:
//                 throw new BadRequestError('Not Supprted Operation Type');
//         }
//     }
// });

// Transaction.afterUpdate(
//   "Verify the operation after verify the transaction",
//   async (transaction) => {
//     if (transaction.verified_at) {
//       switch (transaction.operation_type) {
//         case "charging":
//           await Charging.update(
//             { verified_at: transaction.verified_at },
//             { where: { id: transaction.operation_id } }
//           );
//           break;
//         case "payment":
//           await Payment.update(
//             { verified_at: transaction.verified_at },
//             { where: { id: transaction.operation_id } }
//           );
//           break;
//         case "transfer":
//           await Transfer.update(
//             { verified_at: transaction.verified_at },
//             { where: { id: transaction.operation_id } }
//           );
//           break;
//         default:
//           throw new BadRequestError("Not Supprted Operation Type");
//       }
//     }
//   }
// );

Payment.afterCreate(
  "Create transaction record after payment operation",
  async (payment, { customData }) => {
    const transaction = await Transaction.create({
      ...customData,
      operation_type: "payment",
      operation_id: payment.id,
    });
    await payment.update({ transaction_id: transaction.id });
  }
);

Transfer.afterCreate(
  "Create transaction record after transfer operation",
  async (transfer, { customData }) => {
    const transaction = await Transaction.create({
      ...customData,
      operation_type: "transfer",
      operation_id: transfer.id,
    });
    await transfer.update({ transaction_id: transaction.id });
  }
);

Charging.afterCreate(
  "Create transaction record after charging operation",
  async (charging, { customData }) => {
    const transaction = await Transaction.create({
      ...customData,
      operation_type: "charging",
      operation_id: charging.id,
    });
    await charging.update({ transaction_id: transaction.id });
  }
);

// ChargingPoint Charging
ChargingPoint.hasMany(Charging, {
  foreignKey: "charging_point_id",
  onDelete: "NO ACTION",
});
Charging.belongsTo(ChargingPoint, {
  foreignKey: "charging_point_id",
  onDelete: "NO ACTION",
});

ChargingPoint.hasMany(ChargingPointTransaction, {
  foreignKey: "charging_point_id",
  onDelete: "NO ACTION",
});
ChargingPointTransaction.belongsTo(ChargingPoint, {
  foreignKey: "charging_point_id",
  onDelete: "NO ACTION",
});

Charging.hasOne(ChargingPointTransaction, {
  foreignKey: "charging_id",
});

ChargingPointTransaction.hasOne(Charging, {
  foreignKey: "charging_point_transaction_id",
});

// Charging - user

// Company - CompanyWallet

Company.hasOne(CompanyWallet, {
  foreignKey: "company_id",
  onDelete: "CASCADE",
});

CompanyWallet.hasOne(Company, {
  foreignKey: "company_wallet_id",
  onDelete: "CASCADE",
});

Company.afterCreate("Create Company Wallet", async (company) => {
  const companyWallet = await CompanyWallet.create({ company_id: company.id });
  await company.update({ company_wallet_id: companyWallet.id });
});

// Company,CompanyWallet - CompanyTransaction
Company.hasMany(CompanyTransaction, {
  foreignKey: "company_id",
  as: "companyTransactions",
  onDelete: "NO ACTION",
});

CompanyTransaction.belongsTo(Company, {
  foreignKey: "company_id",
  onDelete: "NO ACTION",
});

CompanyWallet.hasMany(CompanyTransaction, {
  foreignKey: "company_wallet_id",
  onDelete: "NO ACTION",
});

CompanyTransaction.belongsTo(CompanyWallet, {
  foreignKey: "company_wallet_id",
  onDelete: "NO ACTION",
});

// Company,CompanyWallet, - payment
// Company.hasMany(Payment,{
//   foreignKey:'company_id',
//   onDelete:'NO ACTION'
// });

// Payment.belongsTo(Company,{
//   foreignKey:'company_id',
//   onDelete:'NO ACTION'
// });

// CompanyWallet.hasMany(Payment,{
//   foreignKey:'company_wallet_id',
//   onDelete:'NO ACTION'
// });

// Payment.belongsTo(CompanyWallet,{
//   foreignKey:'company_wallet_id',
//   onDelete:'NO ACTION'
// });

// Company - Category
Category.hasMany(Company, {
  foreignKey: "category_id",
});

Company.belongsTo(Category, {
  foreignKey: "category_id",
});

// Payment - CompanyTransactions,Company,CompanyWallet

CompanyTransaction.hasOne(Payment, {
  foreignKey: "company_transaction_id",
});

Payment.hasOne(CompanyTransaction, {
  foreignKey: "payment_id",
});

// Company.hasOne(Payment,{
//   foreignKey:'company_id'
// });

// Payment.hasOne(Company,{
//   foreignKey:'payment_id'
// });

// CompanyWallet.hasOne(Payment,{
//   foreignKey:'company_wallet_id'
// });

// Payment.hasOne(CompanyWallet,{
//   foreignKey:'payment_id'
// });

// create CompanyTransaction after veirfy the payment transaction
// Transaction.afterUpdate(
//   "create CompanyTransaction after veirfy the payment transaction",
//   async (transaction) => {
//     if (transaction.operation_type=='payment'&&transaction.verified_at) {
//         const count=await CompanyTransaction.count({where:{payment_id:transaction.operation_id}});
//         if(!count){
//           const paymentOperation=await Payment.findByPk(transaction.operation_id,{
//             include:[CompanyWallet,Company]
//           });
//           console.log(paymentOperation);
//           const {companyWallet} = paymentOperation;
//           const newBalance=companyWallet.balance + transaction.amount;
//           await CompanyTransaction.create({
//             amount:transaction.amount,
//             old_balance:companyWallet.balance,
//             current_balance:newBalance,
//             date:transaction.date,
//             company_id:paymentOperation.company_id,
//             company_wallet_id:companyWallet.id,
//             payment_id:paymentOperation.id
//           });
//           await CompanyWallet.update({amount:newBalance},{where:{id:companyWallet.id}});
//         }
//     }
//   }
// );

// update wallets after verify the transaction
// Transaction.afterUpdate(
//   "create CompanyTransaction after veirfy the payment transaction",
//   async (transaction) => {
//     if (transaction.operation_type=='payment'&&transaction.verified_at) {
//         const count=await CompanyTransaction.count({where:{payment_id:transaction.operation_id}});
//         if(!count){
//           const paymentOperation=await Payment.findByPk(transaction.operation_id,{
//             include:[CompanyWallet,Company]
//           });
//           console.log(paymentOperation);
//           const {companyWallet} = paymentOperation;
//           const newBalance=companyWallet.balance + transaction.amount;
//           await CompanyTransaction.create({
//             amount:transaction.amount,
//             old_balance:companyWallet.balance,
//             current_balance:newBalance,
//             date:transaction.date,
//             company_id:paymentOperation.company_id,
//             company_wallet_id:companyWallet.id,
//             payment_id:paymentOperation.id
//           });
//           await CompanyWallet.update({amount:newBalance},{where:{id:companyWallet.id}});
//         }
//     }
//   }
// );

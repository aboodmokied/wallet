const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const AccessToken = require("../AccessToken");
const AuthClient = require("../AuthClient");
const Charging = require("../Charging");
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

// User.hasMany(AccessToken,{
//     foreignKey:'userId',
// })

// AccessToken.belongsTo(User,{
//     foreignKey:'userId',
// })

// AccessToken - AuthClient
AuthClient.hasMany(AccessToken, {
  foreignKey: "clientId",
});

AccessToken.belongsTo(AuthClient, {
  foreignKey: "clientId",
});

// // user - wallet
User.hasMany(Wallet, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Wallet.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

// create a wallet automatically when new user was registered
User.afterCreate("Create User Wallet", async (user) => {
  await Wallet.create({ user_id: user.id });
});

// // User,Wallet - transaction
User.hasMany(Transaction, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Transaction.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Wallet.hasMany(Transaction, {
  foreignKey: "wallet_id",
  onDelete: "NO ACTION",
});

Transaction.belongsTo(Wallet, {
  foreignKey: "wallet_id",
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
  foreignKey: "operation_id",
});

Payment.hasOne(Transaction, {
  foreignKey: "transaction_id",
});

Transaction.hasOne(Charging, {
  foreignKey: "operation_id",
});

Charging.hasOne(Transaction, {
  foreignKey: "transaction_id",
});

Transaction.hasOne(Transfer, {
  foreignKey: "operation_id",
});

Transfer.hasOne(Transaction, {
  foreignKey: "transaction_id",
});

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

Transaction.afterUpdate(
  "Verify the operation after verify the transaction",
  async (transaction) => {
    if (transaction.verified_at) {
      switch (transaction.operation_type) {
        case "charging":
          await Charging.update(
            { verified_at: transaction.verified_at },
            { where: { id: transaction.operation_id } }
          );
          break;
        case "payment":
          await Payment.update(
            { verified_at: transaction.verified_at },
            { where: { id: transaction.operation_id } }
          );
          break;
        case "transfer":
          await Transfer.update(
            { verified_at: transaction.verified_at },
            { where: { id: transaction.operation_id } }
          );
          break;
        default:
          throw new BadRequestError("Not Supprted Operation Type");
      }
    }
  }
);

Payment.afterCreate(
  "Create transaction record after payment operation",
  async (payment, { customData }) => {
    const {
      amount,
      old_balance,
      current_balance,
      verification_code,
      wallet_id,
      user_id,
    } = customData;
    await Transaction.create({
      amount,
      old_balance,
      current_balance,
      verification_code,
      date: payment.date,
      wallet_id,
      user_id,
      oprtation_type: "payment",
      operation_id: payment.id,
    });
  }
);

Transfer.afterCreate(
  "Create transaction record after transfer operation",
  async (transfer, { customData }) => {
    const {
      amount,
      old_balance,
      current_balance,
      verification_code,
      wallet_id,
      user_id,
    } = customData;
    await Transaction.create({
      amount,
      old_balance,
      current_balance,
      verification_code,
      date: transfer.date,
      wallet_id,
      user_id,
      oprtation_type: "transfer",
      operation_id: transfer.id,
    });
  }
);

Charging.afterCreate(
  "Create transaction record after charging operation",
  async (charging, { customData }) => {
    const {
      amount,
      old_balance,
      current_balance,
      verification_code,
      wallet_id,
      user_id,
    } = customData;
    await Transaction.create({
      amount,
      old_balance,
      current_balance,
      verification_code,
      date: charging.date,
      wallet_id,
      user_id,
      oprtation_type: "charging",
      operation_id: charging.id,
    });
  }
);

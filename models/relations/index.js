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
const Permission = require("../Permission");
const RefreshToken = require("../RefreshToken");
const Role = require("../Role");
const RoleHasPermission = require("../RoleHasPermission");
const Transaction = require("../Transaction");
const Transfer = require("../Transfer");
const User = require("../User");
const UserHasRole = require("../UserHasRole");
const Wallet = require("../Wallet");

AuthClient.hasMany(AccessToken, {
  foreignKey: "client_id",
});

AccessToken.belongsTo(AuthClient, {
  foreignKey: "client_id",
});

AuthClient.hasMany(RefreshToken, {
  foreignKey: "client_id",
});

RefreshToken.belongsTo(AuthClient, {
  foreignKey: "client_id",
});

RefreshToken.hasMany(AccessToken, {
  foreignKey: "refresh_id",
});

AccessToken.belongsTo(RefreshToken, {
  foreignKey: "refresh_id",
});

Role.belongsToMany(Permission, {
  through: RoleHasPermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
});

Permission.belongsToMany(Role, {
  through: RoleHasPermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
});

Role.hasMany(UserHasRole, {
  foreignKey: "roleId",
  // onDelete:'SET-NULL'
});
UserHasRole.belongsTo(Role, {
  foreignKey: "roleId",
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

// Company - Category
Category.hasMany(Company, {
  foreignKey: "category_id",
});

Company.belongsTo(Category, {
  foreignKey: "category_id",
});

// // Operations

// Transfer
// source
User.hasMany(Transfer, {
  foreignKey: "source_user_id",
  as: "sourceTransfers",
  onDelete: "NO ACTION",
});
Transfer.belongsTo(User, {
  foreignKey: "source_user_id",
  as: "sourceUser",
  onDelete: "NO ACTION",
});
// target
User.hasMany(Transfer, {
  foreignKey: "target_user_id",
  as: "targetTransfers",
  onDelete: "NO ACTION",
});
Transfer.belongsTo(User, {
  foreignKey: "target_user_id",
  as: "targetUser",
  onDelete: "NO ACTION",
});

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

// Payment
// Company
Company.hasMany(Payment, {
  foreignKey: "company_id",
  onDelete: "NO ACTION",
});

Payment.belongsTo(Company, {
  foreignKey: "company_id",
  onDelete: "NO ACTION",
});
//user
User.hasMany(Payment, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});
Payment.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

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

// Charging
// ChargingPoint
ChargingPoint.hasMany(Charging, {
  foreignKey: "charging_point_id",
  onDelete: "NO ACTION",
});
Charging.belongsTo(ChargingPoint, {
  foreignKey: "charging_point_id",
  onDelete: "NO ACTION",
});

// user
User.hasMany(Charging, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});
Charging.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

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

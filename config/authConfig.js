const authConfig = {
  defaults: {
    defaultGuard: "admin",
  },
  commonRole: {
    // role shared between all users
    name: "system-user",
  },
  guards: {
    // user types
    admin: {
      name: "admin",
      oauth: false,
      drivers: ["session"],
      registeration: "by-admin", // (that means any user can create a student account) or admin: (only admin can create new accounts)
      provider: "admins", // mainProvider: contain all users types
      role: {
        name: "admin",
      },
    },
    user: {
      name: "user",
      oauth: true,
      drivers: ["token"],
      registeration: "global", // (that means any user can create a student account) or admin: (only admin can create new accounts)
      provider: "users", // mainProvider: contain all users types
      role: {
        name: "user",
      },
    },
    chargingPoint: {
      name: "chargingPoint",
      oauth: false,
      drivers: ["token"],
      registeration: "by-admin", // (that means any user can create a student account) or admin: (only admin can create new accounts)
      provider: "chargingPoints", // mainProvider: contain all users types
      role: {
        name: "charging-point",
      },
    },
    company: {
      name: "company",
      oauth: false,
      drivers: ["token"],
      registeration: "global", // (that means any user can create a student account) or admin: (only admin can create new accounts)
      provider: "companies", // mainProvider: contain all users types
      role: {
        name: "company",
      },
    },
  },
  providers: {
    admins: {
      driver: "Sequelize",
      model: require("../models/Admin"),
    },
    users: {
      driver: "Sequelize",
      model: require("../models/User"),
    },
    chargingPoints: {
      driver: "Sequelize",
      model: require("../models/ChargingPoint"),
    },
    companies: {
      driver: "Sequelize",
      model: require("../models/Company"),
    },
  },
};

module.exports = authConfig;

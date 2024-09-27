const authConfig = {
  defaults: {
    defaultGuard: "user",
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
      drivers: ["token","session"],
      registeration: "global", // (that means any user can create a student account) or admin: (only admin can create new accounts)
      provider: "users", // mainProvider: contain all users types
      role: {
        name: "user",
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
  },
};

module.exports = authConfig;

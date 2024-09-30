const AccessToken = require("../AccessToken");
const AuthClient = require("../AuthClient");
const Payment = require("../Payment");
const Transaction = require("../Transaction");
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
AuthClient.hasMany(AccessToken,{
    foreignKey:'clientId'
})

AccessToken.belongsTo(AuthClient,{
    foreignKey:'clientId'
})


// // user - wallet
// User.hasMany(Wallet,{
//     foreignKey:'user_id',
//     onDelete:"CASCADE"
// });

// Wallet.belongsTo(User,{
//     foreignKey:'user_id',
//     onDelete:"CASCADE"
// });

// // User.afterCreate




// // User,Wallet - transaction
// User.hasMany(Transaction,{
//     foreignKey:'user_id',
//     onDelete:''
// })

// // user,wallet - payment
// User.hasMany(Payment,{
//     foreignKey:''
// })    




const AccessToken = require("../AccessToken");
const AuthClient = require("../AuthClient");




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




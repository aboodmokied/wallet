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
AuthClient.hasMany(AccessToken,{
    foreignKey:'clientId'
})

AccessToken.belongsTo(AuthClient,{
    foreignKey:'clientId'
})


// // user - wallet
User.hasMany(Wallet,{
    foreignKey:'user_id',
    onDelete:"CASCADE"
});

Wallet.belongsTo(User,{
    foreignKey:'user_id',
    onDelete:"CASCADE"
});

// create a wallet automatically when new user was registered 
User.afterCreate('Create User Wallet',async(user,{})=>{
    await Wallet.create({user_id:user.id});
});




// // User,Wallet - transaction
User.hasMany(Transaction,{
    foreignKey:'user_id',
    onDelete:'NO ACTION'
})

Transaction.belongsTo(User,{
    foreignKey:'user_id',
    onDelete:'NO ACTION'
})

Wallet.hasMany(Transaction,{
    foreignKey:'wallet_id',
    onDelete:'NO ACTION'
})

Transaction.belongsTo(Wallet,{
    foreignKey:'wallet_id',
    onDelete:'NO ACTION'
})

// // user,wallet - payment
User.hasMany(Payment,{
    foreignKey:'user_id',
    onDelete:'NO ACTION'
})

Payment.belongsTo(User,{
    foreignKey:'user_id',
    onDelete:'NO ACTION'
})

Wallet.hasMany(Payment,{
    foreignKey:'wallet_id',
    onDelete:'NO ACTION'
})

Payment.belongsTo(Wallet,{
    foreignKey:'wallet_id',
    onDelete:'NO ACTION'
})   


// transaction - payment,transfer,charging

Transaction.hasOne(Payment,{
    foreignKey:'operation_id'
});

Payment.hasOne(Transaction,{
    foreignKey:'transaction_id'
})

Transaction.hasOne(Charging,{
    foreignKey:'operation_id'
});

Charging.hasOne(Transaction,{
    foreignKey:'transaction_id'
})

Transaction.hasOne(Transfer,{
    foreignKey:'operation_id'
});

Transfer.hasOne(Transaction,{
    foreignKey:'transaction_id'
})

// after create transaction, create payment,transfer,charging automatically
Transaction.afterCreate('Create Transaction Type',async(transaction)=>{
    switch(transaction.operation_type){
        case 'charging':
            // create charging row by its payload
        break;
        case 'payment':
            // create payment row by its payload
        break;
        case 'transfer':
            // create transfer row by its payload
        break;
        default:
            throw new BadRequestError('Not Supprted Operation Type');
    }

    // the problem: how to pass data from request into the hook
});


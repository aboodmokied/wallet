
const authorizationConfig={
    rolePermissions:{
        admin:['can-show-users','can-show-user-roles'],
        user:['can-transfer','can-payment'],
        'charging-point':['can-charge'],
        systemOwner:['can-create-category','can-show-wallet-users','can-create-chrging-point','can-pending-charging-point','can-delete-charging-point','can-show-transactions-reports'],
    }
};

module.exports=authorizationConfig;
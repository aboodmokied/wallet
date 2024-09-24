const { DataTypes } = require("sequelize");
const Application = require("../Application");

const AccessToken=Application.connection.define('access_token',{
     signature:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
     },
     revoked:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
     },
     expiresAt:{
      type:DataTypes.BIGINT(),
      allowNull:false
     }
})


module.exports=AccessToken;
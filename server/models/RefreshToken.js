const { DataTypes } = require("sequelize");
const Application = require("../Application");

const RefreshToken=Application.connection.define('refresh_token',{
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
     },
     user_id:{
      type:DataTypes.BIGINT,
      allowNull:false
     }
})


module.exports=RefreshToken;
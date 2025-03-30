// const User = require("../../models/User")
// const bcrypt=require('bcryptjs');
// const Authorize = require("../../services/authorization/Authorize");

// const userSeeder=async(data)=>{
//     const {password}=data;
//     delete data.password;
//     const count=await User.count({where:{...data}});
//     if(!count){
//         const user=await User.create({...data,password:bcrypt.hashSync(password,12)});
//         await new Authorize().applySystemRoles(user);
//     }
// }

// module.exports=userSeeder;
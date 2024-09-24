const authConfig = require("../../config/authConfig");
const bcrypt=require('bcryptjs');
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");

class Register{
    #guard=authConfig.defaults.defaultGuard;
    constructor(){
        return Register.instance??=this;
    }

    withGuard(guard){
        if(guard){
            this.#guard=guard;
        }
        return this;
    }

   

    async create(req){
        // Before: guard and user data (if the user already exist) validation required
        const Authorize = require("../authorization/Authorize");
        const guardObj=authConfig.guards[this.#guard];
        if(!guardObj) throw Error('something went wrong in authConfig, check it'); // error for the devs      
        if(guardObj.registeration=='global'){
            const {provider}=guardObj;
            const providerObj=authConfig.providers[provider];
            if(!providerObj) throw Error('something went wrong in authConfig, check it'); // error for the devs
            if(providerObj.driver=='Sequelize'){
                const {model}=providerObj;
                const {password}=req.body;
                delete req.body.guard;
                const newUser=await model.create({
                    ...req.body,
                    password:bcrypt.hashSync(password,12),
                })
                
                await new Authorize().applySystemRoles(newUser);
                return newUser;
            }else if(driver=='db'){ // use pure mysql 
                throw Error('this feature not completed');
            }else{
                throw Error('something went wrong in authConfig, check it'); // error for the devs
            }
        }else{
            throw new BadRequestError('Proccess Not Allowed')
        }

    }
    async createWithOauth(userDate){
        // Before: guard and user data (if the user already exist) validation required
        const Authorize = require("../authorization/Authorize");
        const guardObj=authConfig.guards[this.#guard];
        if(!guardObj) throw Error('something went wrong in authConfig, check it'); // error for the devs      
        if(guardObj.registeration=='global'){
            const {provider}=guardObj;
            const providerObj=authConfig.providers[provider];
            if(!providerObj) throw Error('something went wrong in authConfig, check it'); // error for the devs
            if(providerObj.driver=='Sequelize'){
                const {model}=providerObj;
                const newUser=await model.create(userDate);
                await new Authorize().applySystemRoles(newUser);
                return newUser;
            }else if(driver=='db'){ // use pure mysql 
                throw Error('this feature not completed');
            }else{
                throw Error('something went wrong in authConfig, check it'); // error for the devs
            }
        }else{
            throw new BadRequestError('Proccess Not Allowed')
        }

    }
}

module.exports=Register;
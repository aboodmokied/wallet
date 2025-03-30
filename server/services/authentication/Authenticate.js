const authConfig = require("../../config/authConfig");
const bcrypt=require('bcryptjs');
const ValidationError = require("../../Errors/ErrorTypes/ValidationError");

class Authenticate{
    #guard=authConfig.defaults.defaultGuard;
    constructor(){
        return Authenticate.instance??=this;
    }

    withGuard(guard){
        if(guard){
            this.#guard=guard;
        }
        return this;
    }

    async attemp(req){
        // Before: guard validation required
        const guardObj=authConfig.guards[this.#guard];
        if(!guardObj) throw Error('something went wrong in authConfig, check it'); // error for the devs
        if(guardObj.drivers.indexOf('session')!==-1){
            const {provider}=guardObj;
            const providerObj=authConfig.providers[provider];
            const {driver}=providerObj;
            if(driver=='Sequelize'){ // use Sequelize 
                const {model}=providerObj;
                // verify the user
                const {password:reqPassword}=req.body;
                delete req.body.password;
                const user=await model.scope('withPassword').findOne({
                    where:{...req.body}
                });
                if(!user) return {passed:false,error:'wrong credentials'};
                if(user.googleOAuth){
                    throw new ValidationError([{msg:'this user registered via google gmail, try to login via gmail'}]);
                }
                // if(this.#guard != user.guard) return {passed:false,error:`${user.guard} can't login as ${this.#guard}`}; 
                console.log(reqPassword,user.password)
                if(!bcrypt.compareSync(reqPassword,user.password)) return {passed:false,error:'wrong password'};
                // passed
                req.session.isAuthenticated=true;
                req.session.userId=user.id;
                req.session.guard=this.#guard;
                return {passed:true,error:null};
            }else if(driver=='db'){ // use pure mysql 
                throw Error('this feature not completed');
            }else{
                throw Error('something went wrong in authConfig, check it'); // error for the devs
            }
        }else{
            return {passed:false,error:'proccess not allowed'}; // session-based authentication not allowed for this type of users
        }
    }
    async attempWithOauth(req,userData){
        // Before: guard validation required
        const guardObj=authConfig.guards[this.#guard];
        if(!guardObj) throw Error('something went wrong in authConfig, check it'); // error for the devs
        if(guardObj.drivers.indexOf('session')!==-1){
            const {provider}=guardObj;
            const providerObj=authConfig.providers[provider];
            const {driver}=providerObj;
            if(driver=='Sequelize'){ // use Sequelize 
                const {model}=providerObj;
                // verify the user
                const user=await model.findOne({
                    where:{...userData,guard:this.#guard}
                });
                if(!user) return {passed:false,error:`no user "${this.#guard}" with this email "${userData.email}", try to register`};
                // passed
                req.session.isAuthenticated=true;
                req.session.userId=user.id;
                req.session.guard=this.#guard;
                return {passed:true,error:null};
            }else if(driver=='db'){ // use pure mysql 
                throw Error('this feature not completed');
            }else{
                throw Error('something went wrong in authConfig, check it'); // error for the devs
            }
        }else{
            return {passed:false,error:'proccess not allowed'}; // session-based authentication not allowed for this type of users
        }
    }

    logout(req){
        req.session.destroy(error=>{
            if(error){
                throw Error('Failed to destroy session');
            }
        })
    }

    
}

module.exports=Authenticate;
const Database = require("./database/Database");
const express = require("express");
const path = require("path");

class Application {
  #app = null;
  #database = null;
  static connection = null;
  #testing = false;
  constructor() {
    // singleton
    return (Application.instance ??= this);
  }

  get app() {
    return this.#app;
  }

  testing() {
    this.#testing = true;
    require("dotenv").config();
    return this;
  }

  // set app(app){
  //     this.#app=app;
  //     this.#setup()
  // }

  // get connection(){
  //     return Application.connection;
  // }

  async run(app) {
    this.#app = app;
    await this.#setup();
  }
  async dropDatabase() {
    await this.#database.drop();
    await Application.connection.close();
  }
  async #setup() {
    this.#database = new Database(this.#testing);
    Application.connection = this.#database.connect();
    // the ordering is important
    this.#defineModels();
    this.#defineSecrityMiddlewares();
    this.#defineSettings();
    this.#defineMiddlewares();
    this.#defineRoutes();
    this.#applyApiAuth();
    this.#defineGoogleOauth();
    await this.#database.migrate(); // sync database
    await this.#syncApiAuth();
    await this.#syncAuthorization();
    this.#applyAuthorization();
    await this.#assignPermissions()
    this.#syncMailing();
    this.#applyMailing();
    this.#runSeeders();
  }


  #defineSettings() {
    const rootPath = require.main.path;
    // const path = require("path");

    this.#app.set("view engine", "ejs");
    this.#app.set("views", path.join(rootPath, "views"));
    // this.#app.use((req, res, next) => {
    //   if (req.url.endsWith('.css')) {
    //     res.setHeader('Content-Type', 'text/css');
    //   } else if (req.url.endsWith('.js')) {
    //     res.setHeader('Content-Type', 'application/javascript');
    //   }
    //   next();
    // });
   
    this.#app.use(express.static(path.join(rootPath,"..","client","dist"),{
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        }
      }
    }));
    this.#app.use(express.static(path.join(rootPath, "public")));
    this.#app.use(express.static(path.join(rootPath, "public", "adminlte")));
  }
  #defineSecrityMiddlewares() {
    const Kernal = require("./Kernal");
    this.#app.use(Kernal.security);
  }
  #defineMiddlewares() {
    const Kernal = require("./Kernal");
    this.#app.use(Kernal.global);
  }

  // async #defineAuthentication(){
  //     const Authenticate = require("./services/authentication/Authenticate");
  //     await new Authenticate().setup(); // create guards that exists in authConfig
  // }

  #defineModels() {
    require("./models"); // this will run the index.js file so it will load all defined models (Dynamic Model Loader)
    require("./models/relations"); // define relations between models
  }

  #defineRoutes() {
    const Kernal = require("./Kernal");
    this.#app.use("/web",Kernal.web, require("./routes/web"));
    this.#app.use("/api", Kernal.api, require("./routes/api"));
     this.#app.get("/", (req, res) => {
      console.log({path:path.join(__dirname,"..","client","dist","index.html")});
      res.sendFile(path.join(__dirname,"..","client","dist","index.html"));
    });
    // global error handler
    this.#app.use(Kernal.error);
  }

  async #syncApiAuth() {
    const ApiAuth = require("./services/api-authentication/ApiAuth");
    await new ApiAuth().setup();
  }
  #applyApiAuth() {
    const ApiAuth = require("./services/api-authentication/ApiAuth");
    const apiAuth = new ApiAuth();
    // const authConfig = require("./config/authConfig");
    // const guards=authConfig.guards;
    // for(let guard in guards){
    //   const guardObj=guards[guard];
    //   if(guardObj.drivers.includes('token')){
    //     const model=authConfig.providers[guardObj.provider]?.model;
    //     apiAuth.applyApiAuth(model);
    //   }
    // }
    const SystemUser = require("./models/SystemUser");
    // const User = require("./models/User");
    // const Company = require("./models/Company");
    
    apiAuth.applyApiAuth(SystemUser);
  }
  async #syncAuthorization() {
    const Authorize = require("./services/authorization/Authorize");
    await new Authorize().setup();
  }
  #applyAuthorization() {
    const Authorize = require("./services/authorization/Authorize");
    const SystemUser = require("./models/SystemUser");
    // const User = require("./models/User");
    // const Company = require("./models/Company");
    const authorize = new Authorize();
    authorize.applyAuthorization(SystemUser);
    // authorize.applyAuthorization(User);
    // authorize.applyAuthorization(Company);
  }
  async #assignPermissions(){
    const authorizationConfig=require('./config/authorizationConfig');
    const Role = require("./models/Role");
    const {rolePermissions}=authorizationConfig;
    for(let role in rolePermissions){
      const roleInstance=await Role.findOne({where:{name:role}});
      if(roleInstance){
        const permissions=rolePermissions[role];
        for(let permission of permissions){
          await roleInstance.assignPermissionIfNotAssigned(permission);
        }
      }
    }
  }
  #syncMailing() {
    const Mail = require("./services/mail/Mail");
    new Mail().setup();
  }
  #applyMailing() {
    const Mail = require("./services/mail/Mail");
    const SystemUser = require("./models/SystemUser");
    const mail = new Mail();
    mail.applyMailing(SystemUser);
  }

  #defineGoogleOauth(){
    const GoogleAuth = require("./services/o-auth/GoogleAuth");
    const googleOauth=new GoogleAuth();
    googleOauth.setup();
  }

  async #runSeeders(){
    // category
    const Category = require("./models/Category");
    const categories=['University','School','Other'];
    for(let category of categories){
      const count = await Category.count({where:{name:category}});
      if(!count){
        await Category.create({name:category});
      }
    }
    // system owner
    const SystemOwner = require("./models/SystemOwner");
    const bcrypt=require('bcryptjs');
    const Authorize = require("./services/authorization/Authorize");    
    const count=await SystemOwner.count({where:{
      email:process.env.SYSTEM_OWNER_EMAIL
    }})
    if(!count){
      const newUser=await SystemOwner.create({
        email:process.env.SYSTEM_OWNER_EMAIL,
        name:process.env.SYSTEM_OWNER_NAME,
        password:bcrypt.hashSync(process.env.SYSTEM_OWNER_PASSWORD,12),
        verified:true
      })
      
      await new Authorize().applySystemRoles(newUser);
    }
  } 
}

module.exports = Application;

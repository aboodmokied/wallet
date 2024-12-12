const Database = require("./database/Database");
const express = require("express");

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
    await this.#defineApiAuth();
    await this.#defineAuthorization();
    this.#applyAuthorization();
    this.#defineMailing();
    this.#applyMailing();
  }


  #defineSettings() {
    const rootPath = require.main.path;
    const path = require("path");

    this.#app.set("view engine", "ejs");
    this.#app.set("views", path.join(rootPath, "views"));

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
    this.#app.use(Kernal.web, require("./routes/web"));
    this.#app.use("/api", Kernal.api, require("./routes/api"));
    // global error handler
    this.#app.use(Kernal.error);
  }

  async #defineApiAuth() {
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
  async #defineAuthorization() {
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
  #defineMailing() {
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

  // #inheretAssociations(){
  //   const authConfig=require('./config/authConfig');
  //   const SystemUser = require("./models/SystemUser");
  //   for(let providerName in authConfig.providers){
  //     const model=authConfig.providers[providerName]?.model;
  //     console.log({assoc:SystemUser.associate});
  //     model.associate=SystemUser.associate;
  //   }
  // }
}

module.exports = Application;

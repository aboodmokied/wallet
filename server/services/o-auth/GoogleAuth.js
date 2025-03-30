const jwt=require('jsonwebtoken');
const axios=require('axios');
const authConfig = require('../../config/authConfig');
const { DataTypes } = require('sequelize');


const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v1/userinfo';

class GoogleAuth{
    constructor(){
        return GoogleAuth.instance??=this;
    }
    setup(){
        /**
         * update the schema => googleOAuth, password(allowNull) 
         * */    
        const guards=authConfig.guards;
        for(let guard in guards){
            const guardObj=guards[guard];
            if(guardObj.oauth){
                const model=authConfig.providers[guardObj.provider]?.model;
                if(!model)throw new Error('Model Not Found');
                model.rawAttributes.password={
                    type:DataTypes.STRING,
                    allowNull:true
                }; 
                model.rawAttributes.googleOAuth={
                    type: DataTypes.BOOLEAN,
                    defaultValue:false, 
                };
                model.refreshAttributes(); 
            }
        }
    }

    redirectToGoogleAuth(res,savedValues){
        const state = encodeURIComponent(JSON.stringify({ ...savedValues }));
        const queryParams = new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            response_type: 'code',
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            access_type: 'offline',
            prompt: 'consent',
            state
          });
          res.redirect(`${googleAuthUrl}?${queryParams}`);
    }

    async verifyGoogleUser(code){
        const tokens=await this.#getOauthGoogleTokens(code);
        const googleUser=this.#getGoogleUserViaTokens(tokens);
        return googleUser;
    }

    async #getOauthGoogleTokens(code){
        const response = await axios.post(googleTokenUrl, null, {
            params: {
              code,
              client_id: process.env.GOOGLE_CLIENT_ID,
              client_secret: process.env.GOOGLE_CLIENT_SECRET,
              redirect_uri: process.env.GOOGLE_REDIRECT_URI,
              grant_type: 'authorization_code'
            },
          });
          const { id_token,access_token } = response.data;
          return { id_token,access_token };
    }

    #getGoogleUserViaTokens({id_token,access_token}){
        const googleUser=jwt.decode(id_token);
        return googleUser;

        // const userInfoResponse = await axios.get(googleUserInfoUrl, {
        //     headers: {
        //       Authorization: `Bearer ${access_token}`
        //     }
        //   });
        //   const { id, name, email, picture } = userInfoResponse.data;
    }
}

module.exports=GoogleAuth;
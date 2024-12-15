const { corsConfig } = require("../config/securityConfig");

const credentialsHeaders = (req, res, next) => {
  const origin = req.headers.origin;
  console.log({ origin });
  if (corsConfig.allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentialsHeaders;

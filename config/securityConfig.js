module.exports = {
  rateLimitConfig: {
    periodInMinutes: 15,
    times: {
      web: 200,
      api: 200,
    },
  },
  payloadConfig: {
    maxSize: "100kb",
  },
  corsConfig: {
    allowedOrigins: [
      "http://localhost:5173",
      "https://www.yoursite.com",
      "http://localhost:5500",
      "http://localhost:3000",
    ],
  },
  passReset: {
    expiresAfter: 5,
  },
};

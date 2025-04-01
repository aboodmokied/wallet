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
      "https://wallet-react-ten.vercel.app",
      "https://wallet-react.onrender.com",
      "http://localhost:5500",
      "http://localhost:3000",
      "https://wallet-production-06f2.up.railway.app"
    ],
  },
  passReset: {
    expiresAfter: 5,
  },
};

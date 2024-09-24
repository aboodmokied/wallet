const winston = require("winston");
const fs = require('fs');
const path = require('path');

const rootPath=require.main.path;

const logDir = path.join(rootPath, 'logs');
const requestLogDir = path.join(logDir, 'requests');
const errorLogDir = path.join(logDir, 'errors');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

if (!fs.existsSync(requestLogDir)) {
  fs.mkdirSync(requestLogDir);
}

if (!fs.existsSync(errorLogDir)) {
  fs.mkdirSync(errorLogDir);
}

// Create a general logger for request logs
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} : ${level} -- ${message}`;
      })
    ),
    transports: [
      // new winston.transports.Console(),
      new winston.transports.File({ filename: path.join(requestLogDir, 'app.log') })
    ]
  });

// Create an error logger for error logs
const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
      }),
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: path.join(errorLogDir, 'error.log') })
    ]
  });

  module.exports={logger,errorLogger};
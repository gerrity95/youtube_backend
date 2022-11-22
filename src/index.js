const mongoose = require('mongoose');
const ApiError = require('./utils/ApiError');
const app = require('./app');
const logger = require('./middleware/logger');
const config = require('./config/config');

let server;
console.log(config.mongo);
mongoose.connect(config.mongoose.url, config.mongoose.options).then( function() {
  logger.info('MongoDB is connected');
  server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}.`);
  });
}).catch( function(err) {
  logger.error(err);
  throw new ApiError(err);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
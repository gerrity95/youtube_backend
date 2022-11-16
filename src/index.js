const mongoose = require('mongoose');
const ApiError = require('./utils/ApiError');
const app = require('./app');
const logger = require('./middleware/logger');
const dotenv = require('dotenv');
dotenv.config();

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
  PORT,
} = process.env;

const options = {
  useNewUrlParser: true,
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
};

let server;
const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?directConnection=true&authSource=${MONGO_DB}&replicaSet=replicaset&retryWrites=true`;
mongoose.connect(url, options).then( function() {
  logger.info('MongoDB is connected');
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
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
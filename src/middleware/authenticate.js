const logger = require("./logger");
const ApiError = require("../utils/ApiError");

exports.verifyToken = (req, res, next) => {
  // Verify bearer token is present
  logger.info('Attempting to validate API key.');
  try {
    let key = req.headers['authorization'];
    if (key) {
      if (key.startsWith('Bearer ')) {
        const token = key.slice(7, key.length);
        res.locals.token = token;
      } else {
        logger.error('Incorrect authorization header present.');
        throw new ApiError(401, 'Incorrect authorization header present. Please user "Bearer " in your request.');
      }
      next();
  }
  
  } catch (err) {
    logger.error(err);
    throw new ApiError(401, 'No API key present in request.');
  }
}

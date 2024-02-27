const logger = require("./logger");
const crypto = require('crypto')
const ApiError = require("../utils/ApiError");
const config = require('../config/config'); 
const User = require('../models/user');

exports.verifyUser = (validScopes = []) => async (req, res, next) => {
  // Verify bearer token is present
  logger.info('Attempting to validate User Key..');
  const signedKey = signKey(res.locals.token);
  const user = await User.findOne({apiKey: signedKey})
  if (!user) {
    logger.error(`Unable to find API key: ${res.locals.token}`);
    next(new ApiError(401, 'Invalid API Key passed in request.'));
  }
  const hasScope = user.scope.some(element => {
    return validScopes.includes(element);
  });
  if (!hasScope) {
    logger.error(`API Key: ${res.locals.token} does not have the correct scope to make this request`);
    next(new ApiError(401, 'API Key does not have the required permissions to make this request.'));
  }
  next();
}


const signKey = (rawKey) => {
  return crypto.pbkdf2Sync(rawKey, config.keySigner,  
    1000, 64, `sha512`).toString(`hex`); 
}
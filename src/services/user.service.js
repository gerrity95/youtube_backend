const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const User = require('../models/user');
const logger = require('../middleware/logger');
const config = require('../config/config');  

const generateApiKey = async (req) => {
  /*
  Attempt to generate an API key for a new user
  */
  const uuid = crypto.randomUUID();
  const prefix = config.keyPrefix;
  let newUser = new User(); 
  const apiKey = `${prefix}.${uuid}`
  newUser.hashApiKey(apiKey);
  newUser.prefix = prefix; 
  newUser.scope = req.body.scope;

  // Save newUser object to database 
  try {
    const response = await newUser.save();
    logger.info(`Successfully created user entry in database: ${response._id}`);
    return {prefix, apiKey}; 
  } catch (err) {
    logger.error(err);
    throw new ApiError(err);
  }
}



module.exports = {
  generateApiKey,
  }
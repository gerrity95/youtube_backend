const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    APP_NAME: Joi.string().required().description('Name of application'),
    NODE_ENV: Joi.string().valid('production', 'staging', 'development', 'test').required(),
    PORT: Joi.number().default(8080),
    MONGO_HOST: Joi.string().required().description('Mongo DB Host'),
    MONGO_USERNAME: Joi.string().required().description('Mongo DB User'),
    MONGO_PASSWORD: Joi.string().required().description('Mongo DB Password'),
    MONGO_PORT: Joi.string().required().description('Mongo DB Port'),
    MONGO_DB: Joi.string().required().description('Mongo DB Collection'),
    KEY_PREFIX: Joi.string().required().description('Prefix for API Keys'),
    KEY_SIGNER: Joi.string().required().description('Salt signer for API Keys'),
    WHITELISTED_DOMAINS: Joi.string().required().description('Whitelisted domains'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  name: envVars.APP_NAME,
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  keyPrefix: envVars.KEY_PREFIX,
  keySigner: envVars.KEY_SIGNER,
  whitelistedDomains: envVars.WHITELISTED_DOMAINS,
  mongoose: {
    url: `mongodb://${envVars.MONGO_USERNAME}:${envVars.MONGO_PASSWORD}@${envVars.MONGO_HOST}:${envVars.MONGO_PORT}/${
      envVars.MONGO_DB
    }`,
    options: {
      connectTimeoutMS: 10000,
      directConnection: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
  },
};

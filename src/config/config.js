const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const devPrivateKeyPath = path.join(__dirname, '..', 'extras', 'dev_private_key.pem');
const devPublicKeyPath = path.join(__dirname, '..', 'extras', 'dev_public_key.pem');

const envVarsSchema = Joi.object()
  .keys({
    APP_NAME: Joi.string().required().description('Name of application'),
    NODE_ENV: Joi.string().valid('production', 'staging', 'development', 'test').required(),
    PORT: Joi.number().default(8080),
    MONGO_HOST: Joi.string().required().description('Mongo DB Host'),
    MONGO_USER: Joi.string().required().description('Mongo DB User'),
    MONGO_PASSWORD: Joi.string().required().description('Mongo DB Password'),
    MONGO_PORT: Joi.string().required().description('Mongo DB Port'),
    MONGO_DB: Joi.string().required().description('Mongo DB Collection'),
    COOKIE_SECRET: Joi.string().required().description('Secret cookie string'),
    WHITELISTED_DOMAINS: Joi.string().required().description('Whitelisted domains'),
    SESSION_SECRET: Joi.string().required().description('Secret session secret'),
    REFRESH_TOKEN_SECRET: Joi.string().required().description('Refresh session secret'),
    REFRESH_TOKEN_EXPIRY: Joi.string().required().description('Token expiry period for refresh token')
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
  cookieSecret: envVars.COOKIE_SECRET,
  whitelistedDomains: envVars.WHITELISTED_DOMAINS,
  sessionSecret: envVars.SESSION_SECRET,
  refreshSecret: envVars.REFRESH_TOKEN_SECRET,
  mongoose: {
    url: `mongodb://${envVars.MONGO_USER}:${envVars.MONGO_PASSWORD}@${envVars.MONGO_HOST}:${envVars.MONGO_PORT}/${
      envVars.MONGO_DB
    }`,
    options: {
      connectTimeoutMS: 10000,
      directConnection: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
  },
  jwtSignOptions: {
    issuer: envVars.APP_NAME,
    expiresIn: '1m',
    algorithm: 'RS256',
  },
  privateKey: ['staging', 'production'].includes(envVars.NODE_ENV)
    ? envVars.PRIVATE_KEY
    : fs.readFileSync(devPrivateKeyPath, 'utf8'),
  publicKey: ['staging', 'production'].includes(envVars.NODE_ENV)
    ? envVars.PUBLIC_KEY
    : fs.readFileSync(devPublicKeyPath, 'utf8')
};

const Joi = require('joi');

const signUp = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  signUp,
  login
}
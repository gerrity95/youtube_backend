const Joi = require('joi');

const signUp = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
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

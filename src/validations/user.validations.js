const Joi = require('joi');

const generateApi = {
  body: Joi.object().keys({
    scope: Joi.array().items(Joi.string()).required()
  }),
};

module.exports = {
  generateApi,
}

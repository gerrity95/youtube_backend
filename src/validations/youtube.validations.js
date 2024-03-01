const Joi = require('joi');

const search = {
  headers: Joi.object().keys({
    'x-youtube-api': Joi.string().required()
  }),
  body: Joi.object().keys({
    search_query: Joi.string().required(),
    request_count: Joi.number()
  }),
};

module.exports = {
  search,
}

const logger = require('../middleware/logger');
const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');

exports.generateApi = catchAsync(async (req, res) => {
  logger.info('Attempting to generate API Key');
  const result = await userService.generateApiKey(req);
  res.send({ success: true, apiKey: result.apiKey, prefix: result.prefix });
})
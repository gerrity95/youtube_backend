const logger = require('../middleware/logger');
const youtubeService = require('../services/youtube.service');
const catchAsync = require('../utils/catchAsync');

exports.search = catchAsync(async (req, res) => {
  logger.info('Attempting to search YouTube API');
  const results = await youtubeService.search(req);
  res.json(results);
})

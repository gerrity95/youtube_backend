const ApiError = require('../utils/ApiError');
const logger = require('../middleware/logger');
const { google } = require("googleapis");

const search = async (req) => {
  /*
  Attempt to search youtube API with a given search query
  */
  logger.info("Attempting to query youtube");
  let resultCount = 10;
  if (req.body.request_count) {
    resultCount = req.body.request_count;
  }
  try {
    const youtube = google.youtube({
      version: "v3",
      auth: req.headers['x-youtube-api'],
    });
    const response = await youtube.search.list({
      part: "snippet",
      q: req.body.search_query,
      maxResults: resultCount,
      type: "video",
      order: "viewCount"
    });
    const videoData = await getVideoInfo(youtube, response.data.items);
    return videoData;
  } catch (err) {
    logger.error('Error making youtube query');
    logger.error(err);
    throw new ApiError(err);
  }
}

async function getVideoInfo(youtube, videos) {
  // Loop through a list of videos and get info about specific videos
  try {
    let allResponses = [];
    for (const video of videos) {
      let response = await youtube.videos.list({
        part: "snippet,contentDetails,statistics",
        id: video.id.videoId
      });
      if (!response) {
        throw new ApiError(500, 'Unable to get response from YouTube')
      }
      allResponses.push({
        channel: response.data.items[0].snippet.channelTitle,
        title: response.data.items[0].snippet.title,
        link: `https://www.youtube.com/watch?v=${response.data.items[0].id}`,
        views: response.data.items[0].statistics.viewCount
      })
    }
    return allResponses;
  } catch (err) {
    logger.error('Error attempting to get video details');
    logger.error(err);
    throw new ApiError(err);
  }
}



module.exports = {
  search,
  }
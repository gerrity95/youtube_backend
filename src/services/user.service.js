const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const User = require('../models/user');
const logger = require('../middleware/logger');
const jwt = require("jsonwebtoken")

const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../middleware/authenticate");
  
async function signUp(req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        logger.error('Error attempting to register user');
        console.log(err);
        handleRegisterError(err);
      } else {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        const token = getToken({ _id: user._id })
        const refreshToken = getRefreshToken({ _id: user._id })
        user.refreshToken.push({ refreshToken })
        user.save((err, user) => {
          if (err) {
            logger.error(err);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error attempting to save user');
          } else {
            logger.info(`Successfully register user: ${user._id}`);
            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
            return res.send({ success: true, token });
          }
        })
      }
    }
  )
}

// const login = async (req, res) => {
//   logger.info('login request');
//   passport.authenticate('local', function(err, user, info) {
//     console.log(err);
//     console.log(user);
//     // const token = getToken({ _id: req.user._id })
//     // const refreshToken = getRefreshToken({ _id: req.user._id })
//     // User.findById(req.user._id).then(
//     //   user => {
//     //     user.refreshToken.push({ refreshToken })
//     //     user.save((err, user) => {
//     //       if (err) {
//     //         throw new ApiError(err.status, err.message);
//     //       } else {
//     //         res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
//     //         return { success: true, token };
//     //       }
//     //     })
//     //   },
//     //   err => {throw new ApiError(err.status, err.message)}
//     // )
//   });
// }

function handleRegisterError(err, next) {
  logger.info(err.name);
  if (err.name == 'UserExistsError') {
    logger.info('Cannot create user as they already exist.');
    return next(err);
  } else if (err.name == 'MongoServerError') {
    if (err.message.includes('E11000 duplicate key error')) {
      logger.info('Cannot create user as they already exist.');
      return next(err);
    }
  }
  logger.info('Unknown error when attempting to register');
  logger.info(err);
  return next(err);
}

const refreshToken = async (req) => {
  /*
  Attempt to generate a new refresh token for a given user
  */
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies

  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'No refresh token provided. Please login again.');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token has expired. Please login again.');
   }
  const userId = payload._id
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Unable to find user with ID: ${userId}`);
  }
  const tokenIndex = user.refreshToken.findIndex(
    item => item.refreshToken === refreshToken
  )
  if (tokenIndex === -1) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized.');
  } 

  const token = getToken({ _id: userId })
  // If the refresh token exists, then create new one and replace it.
  const newRefreshToken = getRefreshToken({ _id: userId })
  user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
  await user.save();
  logger.info(`Succesfully updated refresh token for ${userId}`);
  return {refreshToken: newRefreshToken, token: token};
}

const logout = async (req) => {
  /*
  Log user out of their session and delete tokens
  */
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized logout request');
  }
  const tokenIndex = user.refreshToken.findIndex(
    item => item.refreshToken === refreshToken
  )
  if (tokenIndex !== -1) {
    user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove()
  }
  await user.save();
  return {success: true};
}

module.exports = {
  signUp,
  handleRegisterError,
  refreshToken,
  logout
}
const logger = require('../middleware/logger');
const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../models/user');
const { getToken, getRefreshToken, COOKIE_OPTIONS } = require("../middleware/authenticate");

exports.signUp = catchAsync(async (req, res, next) => {
  logger.info('Attempting to create new user...');
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        logger.error('Error attempting to register user');
        console.log(err);
        userService.handleRegisterError(err, next);
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
});

exports.login = catchAsync(async (req, res, next) => {
  logger.info('Processing attempt to login');
  passport.authenticate("local", function(info, user, err) {
    if (err) {
      console.log(err);
      const authErrors = ['IncorrectPasswordError', 'IncorrectUsernameError'];
      if (authErrors.includes(err.name)) {
        return res.status(httpStatus.UNAUTHORIZED).send('Incorrect Username or Password');
      }
      return next(err);
    }
    const token = getToken({ _id: user._id })
    const refreshToken = getRefreshToken({ _id: user._id });
    User.findById(user._id).then(
      user => {
        user.refreshToken.push({ refreshToken })
        user.save((err, user) => {
          if (err) {
            throw new ApiError(err.status, err.message);
          } else {
            logger.info(`Successful login for user ${user._id}`);
            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
            res.send({ success: true, token })
          }
        })
      },
      err => next(err)
    )
  })(req, res, next);
})

exports.refreshToken = catchAsync(async (req, res) => {
  logger.info('Attempting to refresh token');
  const result = await userService.refreshToken(req);
  res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
  res.send({ success: true, token: result.token });
})

exports.logout = catchAsync(async (req, res) => {
  logger.info('Processing attempt to logout');
  const result = await userService.logout(req);
  res.clearCookie("refreshToken", COOKIE_OPTIONS)
  res.send(result);
})
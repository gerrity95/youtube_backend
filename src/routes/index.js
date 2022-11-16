const express = require('express');
const userRouter = require('./user.routes');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/user',
    route: userRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.get('*', async (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});

router.post('*', async (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});


module.exports = router;
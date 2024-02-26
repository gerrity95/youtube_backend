const passport = require("passport")
const jwt = require("jsonwebtoken")
const config = require('../config/config');

exports.COOKIE_OPTIONS = {
  httpOnly: true,
  // Since localhost is not having https protocol,
  // secure cookies do not work correctly (in postman)
  secure: true,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  sameSite: "none",
}

exports.getToken = user => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: eval(process.env.SESSION_EXPIRY),
  })
}

exports.getRefreshToken = user => {
  const refreshToken = jwt.sign(user, config.privateKey, config.jwtSignOptions)
  return refreshToken
}

exports.verifyUser = passport.authenticate("jwt", { session: false });

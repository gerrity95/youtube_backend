const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const {errorConverter, errorHandler} = require('./middleware/error');
const routes = require('./routes');
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require('passport');
require("./strategies/jwt.strategy")
require("./strategies/local.strategy")
require("./middleware/authenticate");
const config = require('./config/config');

app.use(bodyParser.json())
app.use(cookieParser(config.cookieSecret))
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//Add the client URL to the CORS policy
const whitelist = config.whitelistedDomains
  ? config.whitelistedDomains.split(",")
  : []

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions));

app.use(passport.initialize());

app.use('/', routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const {errorConverter, errorHandler} = require('./middleware/error');
const routes = require('./routes');
require('dotenv').config();
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require('passport');
require("./strategies/jwt.strategy")
require("./strategies/local.strategy")
require("./middleware/authenticate")

app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
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
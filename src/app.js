const express = require('express');
const cors = require('cors');
const app = express();
const {errorConverter, errorHandler} = require('./middleware/error');
const routes = require('./routes');
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
require("./middleware/authenticate");
const config = require('./config/config');

app.use(bodyParser.json())
app.use(cookieParser(config.cookieSecret))

// //Add the client URL to the CORS policy - It will also work with Postman for testing
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

app.use('/', routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
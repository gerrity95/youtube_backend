const express = require("express")
const router = express.Router();
const scopes = require('../helpers/scopes');
const validate = require('../middleware/validate');
const youtubeController = require('../controllers/youtube.controller');
const youtubeValidations = require('../validations/youtube.validations');
const { verifyToken } = require('../middleware/authenticate');
const { verifyUser } = require('../middleware/authorize');

router.get('/search',
  validate(youtubeValidations.search), 
  verifyToken, 
  verifyUser([scopes.Search]), 
  youtubeController.search
);


module.exports = router

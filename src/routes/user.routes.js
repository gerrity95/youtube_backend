const express = require("express")
const router = express.Router();
const scopes = require('../helpers/scopes');
const validate = require('../middleware/validate');
const userController = require('../controllers/user.controller')
const userValidations = require('../validations/user.validations');
const { verifyToken } = require('../middleware/authenticate');
const { verifyUser } = require('../middleware/authorize');

router.get('/search', verifyToken, verifyUser([scopes.Search]), userController.search);

router.post('/generate_api', validate(userValidations.generateApi), userController.generateApi);
// router.delete('/delete_api', userController.login);


module.exports = router

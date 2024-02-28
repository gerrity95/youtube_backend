const express = require("express")
const router = express.Router();
const validate = require('../middleware/validate');
const userController = require('../controllers/user.controller')
const userValidations = require('../validations/user.validations');

router.post('/generate_api', validate(userValidations.generateApi), userController.generateApi);
// router.delete('/delete_api', userController.login);


module.exports = router

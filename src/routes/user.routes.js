const express = require("express")
const router = express.Router();
const validate = require('../middleware/validate');
const userController = require('../controllers/user.controller')
const userValidations = require('../validations/user.validations');
const { verifyUser } = require('../middleware/authenticate');

router.get('/logout', verifyUser, userController.logout);
router.get('/', verifyUser, (req, res, next) => {
  res.send(req.user);
});

router.post('/signup', validate(userValidations.signUp), userController.signUp);
router.post('/login', validate(userValidations.login), userController.login);
router.post('/refreshToken', userController.refreshToken);


module.exports = router

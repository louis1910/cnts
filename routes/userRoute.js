const router = require('express').Router();

const {
	userRegister,
	postUserRegister,
	userLogin,
	postUserLogin,
	userLogout
} = require('../controllers/authController');

const {
	isLogin,
	adminDisable
} = require('../middleware/authMiddleware');


// -------------register
router.route('/register').get(userRegister);

router.route('/register').post(postUserRegister);

// -------------login
router.route('/login').get(isLogin, userLogin);

router.route('/login').post(postUserLogin);

router.route('/logout').get(userLogout);


module.exports = router; 
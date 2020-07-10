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
//Thiết lập các định tuyến địa chỉ cho tuyến người dùng
//phương thức get gửi thông tin người dùng đã được mã hóa thêm vào trên yêu cầu trang và GET lộ thông tin trên đường dẫn URL.
//Phương thức POST truyền thông tin thông qua HTTP header, thông tin này được mã hóa như phương thức GET.
// Dữ liệu đươc gửi bởi phương thức POST rất bảo mật vì dữ liệu được gửi ngầm, không đưa lên URL.
router.route('/register').get(userRegister);

router.route('/register').post(postUserRegister);

// -------------login
router.route('/login').get(isLogin, userLogin);

router.route('/login').post(postUserLogin);

router.route('/logout').get(userLogout);


module.exports = router; 
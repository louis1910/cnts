const config = require('../controllers/config.js');
const firebase = config.firebase();
const bodyParser = require('body-parser');

//Middleware sẽ đóng vai trò trung gian giữa request/response (tương tác với người dùng)
// và các xử lý logic bên trong web server.
// Do đó, Middleware trong ExpressJS, sẽ là các hàm được dùng để tiền xử lý,
// lọc các request trước khi đưa vào xử lý logic hoặc điều chỉnh các response trước khi gửi về cho người dùng.
//isLogin đóng vai trò nếu người dùng đã đăng nhập trước đó thì sẽ điều hướng về lại trang chủ

exports.isLogin = (req, res, next)=>{
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user !== null) {
	    res.redirect('/');
	  } else {
	    next();
	  }
	});
}

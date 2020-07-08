const config = require('../controllers/config.js');
const firebase = config.firebase();



module.exports.isLogin = (req, res, next)=>{
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user !== null) {
	    res.redirect('/');
	  } else {
	    next();
	  }
	});
}

module.exports.adminDisable = (req, res, next)=>{
	firebase.auth().onAuthStateChanged(function(user) {
		if (user !== null && user.uid != "2OHNyRCzHxcUHmJrwgo1l3TYC0J3") {
			next();
		} else{
			res.redirect('/');
		}
	});
}
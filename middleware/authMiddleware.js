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
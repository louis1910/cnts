const config = require('./config.js');

const firebase = config.firebase();
const admin = config.admin();

const md5 = require('md5');


module.exports.login = (req, res)=>{
	res.render('./login/login');
}

module.exports.postLogin = async(req, res)=>{
	const random = req.cookies.MK3S2;
	// let uid = '';

	const receiveForm = req.body;

	// const usermail = receiveForm.usermail;
	// const password = receiveForm.password;
	const {usermail, password } =receiveForm;

	firebase.auth()
		.signInWithEmailAndPassword(usermail, md5(password))
		.then(()=>{
			 firebase.auth().currentUser.getIdToken(true)
				.then(function(idToken) {
					res.cookie('idToken', idToken,{
						signed: true
					});
					res.cookie('SSID', random, {
						signed: true
					})

					res.redirect('/');

				})
				.catch(function(error) {
				  console.log(error);
			});
		})
		.catch((err)=>{
			const errors = err.message;
			console.log(errors);
			res.render('./login/login',{
				errors
			});
		});
}


module.exports.logout = (req, res)=>{
  	res.clearCookie("idToken");
  	res.clearCookie("SSID");
  	res.redirect('/');
}
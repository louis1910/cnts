const config = require('./config.js');
const db = config.db();
const admin = config.admin();
const firebase = config.firebase();
const md5 = require('md5');
const shortid = require('shortid');

exports.userRegister = (req, res)=>{
	res.render('./authentication/register',{
		err: "",
		values: ""
	});
}
exports.postUserRegister = (req, res)=>{

	const receiveForm = req.body;
	const randomStr = shortid.generate();

	// const name = receiveForm.name;
	// const password = receiveForm.password;
	// const retype = receiveForm.retype;
	// const usermail = receiveForm.usermail;

	const {
		name,
		password,
		retype,
		usermail
	} = req.body;

	if(password !== retype || !name || !password || !usermail){
		res.render('./authentication/register',{
			err: ["Please fill out correctly!"],
			values: req.body
		});
		return;
	}

	admin.auth().createUser({
		email: usermail,
		emailVerified: false,
		displayName: name,
		password: md5(password),
		disabled: false
	})
	.then((userRecord)=>{
		console.log(userRecord);
		res.redirect('/user/login');
	})
	.catch((err)=>{
		console.log(err);
		res.redirect('/error');
		return;
	});
}

exports.userLogin = (req, res, next)=>{
	res.render('./authentication/login');
}

exports.postUserLogin = async(req, res)=>{

	const { usermail, password } = req.body;

	firebase.auth()
		.signInWithEmailAndPassword(usermail, md5(password))
		.then(()=>{
			 firebase.auth().currentUser.getIdToken(true)
				.then(function(idToken) {
					res.cookie('idToken', idToken,{
						signed: true
					});

					res.redirect('/');

				})
				.catch(function(err) {
					console.log(err);
				 	res.redirect('/error');
			});
		})
		.catch((err)=>{
			const errors = err.message;
			console.log(errors);
			res.render('./authentication/login',{
				errors
			});
		});
}


exports.userLogout = (req, res)=>{
  	res.clearCookie("idToken");
  	res.clearCookie("SSID");
  	res.redirect('/');
}
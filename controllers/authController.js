const config = require('./config.js');
const db = config.db();
const admin = config.admin();
const firebase = config.firebase();
const md5 = require('md5');
const shortid = require('shortid');

exports.userRegister = (req, res)=>{
	res.render('../views/register/register',{
		err: "",
		values: ""
	});
}
exports.postUserRegister = (req, res)=>{

	const receiveForm = req.body;
	const randomStr = shortid.generate();

	const name = receiveForm.name;
	const password = receiveForm.password;
	const retype = receiveForm.retype;
	const usermail = receiveForm.usermail;

	if(password !== retype || !name || !password || !usermail){
		res.render('../views/register/register',{
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
		console.log(err.message);
		res.redirect('/error');
		return;
	});
}

exports.userLogin = (req, res)=>{
	res.render('./login/login');
}

exports.postUserLogin = async(req, res)=>{
	const random = req.cookies.MK3S2;
	// let uid = '';

	const receiveForm = req.body;

	// const usermail = receiveForm.usermail;
	// const password = receiveForm.password;
	const { usermail, password } = receiveForm;

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


exports.userLogout = (req, res)=>{
  	res.clearCookie("idToken");
  	res.clearCookie("SSID");
  	res.redirect('/');
}
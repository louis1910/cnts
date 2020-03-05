const config = require('./config.js');
const db = config.db();
const admin = config.admin();
const shortid = require('shortid');
const md5 = require('md5');

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
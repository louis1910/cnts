const config = require('./config.js');
const db = config.db();
const admin = config.admin();
const firebase = config.firebase();
const md5 = require('md5');
const shortid = require('shortid');

exports.userRegister = (req, res)=>{
	res.render('./authentication/register',{
		err: "",
		values: "",
	});
}
exports.postUserRegister = (req, res)=>{

	const receiveForm = req.body;
	const randomStr = shortid.generate();

	const {
		name,
		password,
		retype,
		usermail,
		phone
	} = req.body;

	if(password !== retype || !name || !password || !usermail || !phone){
		res.render('./authentication/register',{
			err: ["Vui lòng điền đầy đủ thông tin hoặc thông tin phải hợp lệ!"],
			values: req.body
		});
		return;
	}




	admin.auth().createUser({
		email: usermail,
		emailVerified: false,
		displayName: name,
		phoneNumber: "+84" + phone,
		password: md5(password),
		disabled: false
	})
	.then((userRecord)=>{
		console.log(userRecord.uid);

		let userId = userRecord.uid;
		//
		// let additionalClaims = {
		// 	premiumAccount: true,
		// 	role: 'user'
		// };

		// admin.auth().createCustomToken(userId, additionalClaims)
		// 	.then(function(customToken) {
		// 		console.log(customToken);
		//
		// 	})
		// 	.catch(function(error) {
		// 		console.log('Error creating custom token:', error);
		// 	});

		let ref = admin.database().ref("users");
		let role = ref.child(userId).set({
			role: 'user'
		});

		res.redirect('/user/login');
	})
	.catch((err)=>{
		console.log(err.code);
		if(err.code == 'auth/email-already-exists') {
			res.render('./authentication/register', {
				err: "Email đã tồn tại, vui lòng chọn email khác!",
				values: req.body
			});
		}
	});



}

exports.userLogin = (req, res, next)=>{
	res.render('./authentication/login', {
		errors: ""
	});
}

exports.postUserLogin = (req, res)=>{

	const { usermail, password } = req.body;

	firebase.auth()
		.signInWithEmailAndPassword(usermail, md5(password))
		.then(()=>{
			 firebase.auth().currentUser.getIdToken(true)
				.then(function(idToken) {

					admin.auth().verifyIdToken(idToken)
						.then((decodedToken)=> {
							const uid = decodedToken.uid;
							
						})

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
				errors: errors
			});
		});
}


exports.userLogout = (req, res)=>{

  	firebase.auth().signOut().then(function() {
	  	res.clearCookie("idToken");
	  	res.clearCookie("SSID");
	  	res.redirect('/');
	}).catch(function(error) {
		res.redirect('/error');
	});
}
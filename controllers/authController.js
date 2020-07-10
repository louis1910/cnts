const config = require('./config.js');
const db = config.db();
const admin = config.admin();
const firebase = config.firebase();
const md5 = require('md5');
const shortid = require('shortid');


//Dùng phương thức res.render('./authentication/register') để xuất trang web chứa html trong tệp register.ejs
exports.userRegister = (req, res)=>{
	res.render('./authentication/register',{
		err: "",
		values: "",
	});
}


exports.postUserRegister = (req, res)=>{

	const randomStr = shortid.generate();

	//Nhận đầy đủ thông tin từ form bên HTML gửi về
	const {
		name,
		password,
		retype,
		usermail,
		phone
	} = req.body;

	//Báo lỗi nếu có trường nào bị trống
	if(password !== retype || !name || !password || !usermail || !phone){
		res.render('./authentication/register',{
			err: ["Vui lòng điền đầy đủ thông tin hoặc thông tin phải hợp lệ!"],
			values: req.body
		});
		return;
	}



	//sử dụng phương thức auth().createUser() của Firebase để tiến hành tạo hồ sơ người dùng với thông tin nhận được từ form
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


		//Sau khi tạo thành công thì thiết lập quyền người dùng
		let userId = userRecord.uid;
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
		if(err.code == 'auth/invalid-phone-number') {
			res.render('./authentication/register', {
				err: "Số điện thoại đã tồn tại hoặc không hợp lệ, vui lòng chọn email khác!",
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

	//Sử dụng phương thức auth().signInWithEmailAndPassword() để xác minh người dùng bằng email và password
	//họ đã cung cấp khi tạo tài khoản
	//sau khi xác minh thành công sẽ tiến hành đăng nhập và thiết lập một số cookie cần thiết để duy trì dăng nhập
	// và xác nhận phân luồng admin và user
	firebase.auth()
		.signInWithEmailAndPassword(usermail, md5(password))
		.then(()=>{
			 firebase.auth().currentUser.getIdToken(true)
				.then(function(idToken) {

					admin.auth().verifyIdToken(idToken)
						.then((decodedToken)=> {
							const uid = decodedToken.uid;
							let ref = admin.database().ref(`users/${uid}`);
							ref.on('value', (snapshot)=>{
								let data = snapshot.val();

								if(data.role == "user"){
									res.cookie('idToken', idToken,{
										signed: true
									});
									res.redirect('/');
								} else if(data.role == "admin"){
											res.cookie('idToken', idToken,{
												signed: true
											});
											res.redirect('/admin');
								}
							})
						})

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

//sử dụng phương thức firebase.auth().signOut() của Firebase để đăng xuất tài khoản đang đăng nhập hiện tại

exports.userLogout = (req, res)=>{

  	firebase.auth().signOut().then(function() {
	  	res.clearCookie("idToken");
	  	res.clearCookie("SSID");
	  	res.redirect('/');
	}).catch(function(error) {
		res.redirect('/error');
	});
}
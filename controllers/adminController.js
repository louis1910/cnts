const config = require('./config.js');
const db = config.db();
const admin = config.admin();
const firebase = config.firebase();
const bucket = config.bucket();
const shortid = require("shortid");
const fs = require("fs");


exports.admin = (req, res) =>{
	const isAdmin = req.signedCookies.MK3S2;
	if(isAdmin){
		res.render('./layouts/admin');
	} else {
		res.redirect('/unavailable')
	}

}

exports.addCourse = (req, res)=>{

	const isAdmin = req.signedCookies.MK3S2;
	if(isAdmin){
		res.render('layouts/add-new-course.ejs', {
			message: ""
		});
	} else {
		res.redirect('/unavailable')
	}

}

exports.postCourse = async(req, res)=>{
	const cid = shortid.generate();

	const  {
		filename,
		subject,
		grade,
		title,
		description
	} = req.body;

	if(subject == "none" || grade == "none")
	{
		return res.render('layouts/addNewCourse', {
			message: ""
		});
	}
	else{

		const file = req.file;
		const filename = file.filename;

		const pathToUpload = `${file.destination}/${filename}`;

		const option = {
			destination: `tailieumonhoc/${grade}/${filename}`
		}

		await bucket.upload(pathToUpload, option, (err, file)=>{
			if(err) console.log(err);
		});


		const fileStream = bucket.file(option.destination);
		var urlStream = '';

		await fileStream.getSignedUrl({
				action: 'read',
				expires: '03-09-2491'
			}).then(signedUrls => {
				urlStream = signedUrls[0];
		});

		const ref = admin.database().ref(`course/${grade}/${subject}`);

		let atDate = new Date().toString().slice(0, 24);

		await ref.child(cid).set({
		    uploadAt: atDate,
		    title: title,
		    filename: file.originalname,
		    storage: option.destination,
		    grade: grade,
		    subject: subject,
		    description: description,
		    urlStream: urlStream
		});

		fs.unlinkSync(pathToUpload);
	}

	return res.render('success');
}


exports.member = async(req, res)=>{
	const isAdmin = req.signedCookies.MK3S2;
	if(isAdmin){
		let listedUsers = [];
		listAllUsers = async(nextPageToken) => {
			// List batch of users, 1000 at a time.
			admin.auth().listUsers(1000, nextPageToken)
				.then(function(listUsersResult) {
					listUsersResult.users.forEach((userRecord)=>{
						let user = {
							displayName: userRecord.displayName,
							phoneNumber: userRecord.phoneNumber,
							lastSignInTime: userRecord.metadata.lastSignInTime,
							creationTime: userRecord.metadata.creationTime,
							email: userRecord.email
						}

						listedUsers.push(user);
					});
					if (listUsersResult.pageToken) {
						// List next batch of users.
						listAllUsers(listUsersResult.pageToken);
					}
					res.render("layouts/members",{
						listedUsers: listedUsers
					});
				})
				.catch(function(error) {
					console.log('Error listing users:', error);
					res.redirect('/error');
				});
		}
// Start listing users from the beginning, 1000 at a time.
		listAllUsers();
	} else {
		res.redirect('/unavailable')
	}



}

exports.inventory = (req, res)=>{

	const isAdmin = req.signedCookies.MK3S2;
	if(isAdmin){
		let grade = req.query.grade || 12;
		let subject = req.query.subject || "Toán"

		// console.log(grade);
		let ref = admin.database().ref(`course/${grade}/${subject}`);

		// console.log(`course/${grade}/Toán`);

		ref.on('value', (snapshot)=>{

			let data = snapshot.val();
			let listedData = Object.entries(data);
			// console.log(listedData[0][1]);
			res.render('layouts/inventory', {
				listedData: listedData
			});

		}, (err)=>{
			console.log(err);
		});
	} else {
		res.redirect('/unavailable');
	}

}

exports.delPost = (req, res)=>{

	let gradeToDel = req.body.gradeToDel;
	let subjectToDel = req.body.subjectToDel;
	let uidToDel = req.body.uidToDel;

	console.log(gradeToDel, subjectToDel, uidToDel);

	console.log(`course/${gradeToDel}/${subjectToDel}/${uidToDel}`);

	let refToDel = admin.database().ref(`course/${gradeToDel}/${subjectToDel}/${uidToDel}`);
	refToDel.remove();

	return res.render('success2');

}

exports.addDocument = (req, res)=>{
	const isAdmin = req.signedCookies.MK3S2;
	if(isAdmin){
		res.render("layouts/add-new-document");
	} else {
		res.redirect('/unavailable')
	}

}

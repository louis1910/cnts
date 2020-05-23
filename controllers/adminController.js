const config = require('./config.js');
const db = config.db();
const admin = config.admin();
const firebase = config.firebase();
const bucket = config.bucket();
const shortid = require("shortid");
const fs = require("fs");



exports.adminLogin = (req, res)=>{

}

exports.admin = (req, res) =>{
	res.render('./layouts/index');
}

exports.addCourse = (req, res)=>{
	res.render('layouts/addNewCourse', {
		message: ""
	});
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
		res.render('layouts/addNewCourse', {
			message: ""
		});
		return;
	}
	else{

		const file = req.file;
		const filename = file.filename;

		const pathToUpload = `${file.destination}/${filename}`;

		const option = {
			destination: `tailieumonhoc/${grade}/${filename}`
		}

		await bucket.upload(pathToUpload, option, (err, file)=>{
			if(err) res.redirect('/error');
		});


		const fileStream = bucket.file(option.destination);
		var urlStream = '';
		await fileStream.getSignedUrl({
				action: 'read',
				expires: '03-09-2491'
			}).then(signedUrls => {
				urlStream = signedUrls[0];
		});

		const ref = firebase.database().ref(`course/${grade}/${subject}`);

		let atDate = new Date().toString().slice(0, 24);

		await ref.child(cid).set({
		    uploadAt: atDate,
		    title: title,
		    filename: file.originalname,
		    storage: option.destination,
		    grade: grade,
		    subject: subject,
		    title: title,
		    description: description,
		    urlStream: urlStream
		});

		fs.unlinkSync(pathToUpload);

		res.render("layouts/addNewCourse", {
			message: "Upload successfully!"
		})
	}
}

exports.getCourse = (req, res)=>{
	const ref = firebase.database().ref(`course/8/math/`);
}

exports.member = async(req, res)=>{
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
			      	console.log(user);
		      		listedUsers.push(user);
		      	});		      
			    if (listUsersResult.pageToken) {
			        // List next batch of users.
			        listAllUsers(listUsersResult.pageToken);
			    }
			    res.render("layouts/members-v2",{
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
}

exports.inventory = (req, res)=>{
	res.render("layouts/inventory");
}

exports.addDocument = (req, res)=>{
	res.render("layouts/add-new-document");
}

exports.adv = (req, res)=>{
	res.render("layouts/adv")
}

exports.feedback = (req, res)=>{
	res.render("layouts/feedback")
}

exports.settings = (req,res)=>{
	res.render("layouts/settings")
}
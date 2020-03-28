const config = require('./config.js');
const db = config.db();
const admin = config.admin();
const firebase = config.firebase();
const bucket = config.bucket();
const shortid = require("shortid");



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

exports.postCourse = (req, res)=>{
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
		res.render('layouts/addNewCourse');
		return;
	}
	else{



		const file = req.file;
		const filename = file.filename;

		const pathToUpload = `${file.destination}/${filename}`;

		console.log(pathToUpload);

		const option = {
			destination: `thongtintuyensinh/${filename}`
		}

		bucket.upload(pathToUpload, option, (err, file)=>{
			console.log(err);
		});

		const ref = firebase.database().ref(`course/${grade}/${subject}/`);

		let atDate = new Date().toString().slice(0, 24);

		ref.set({
		  [cid]: {
		    uploadAt: atDate,
		    title: "Alan Turing",
		    filename: file.originalname,
		    storage: option.destination,
		    grade: grade,
		    subject: subject,
		    title: title,
		    description: description
		  }
		});




		// res.render("layouts/add-document", {
		// 	message: "Upload successfully!"
		// })
	}
}

exports.getFile = (req, res)=>{
	bucket.getFiles(function(err, files) {
		if (!err) {
    // files is an array of File objects.

    	console.log(files[0].name);
		}
	});
}
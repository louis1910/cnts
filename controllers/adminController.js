const config = require('./config.js');
const db = config.db();
const admin = config.admin();
const firebase = config.firebase();
const bucket = config.bucket();
const shortid = require("shortid");

// const {Storage} = require('@google-cloud/storage'); 
// const multer = require('multer');


// const projectId = 'camnangtuyensinh2020';
// const keyFilename = '../serviceAccountKey.json';
// const storage = new Storage({projectId, keyFilename});

// const bucket = storage.bucket("camnangtuyensinh2020.appspot.com");


exports.adminLogin = (req, res)=>{

}

exports.admin = (req, res) =>{
	res.render('./layouts/index');
}

exports.addCourse = (req, res)=>{
	res.render('layouts/add-document', {
		message: ""
	});
}

exports.postCourse = (req, res)=>{
	const cid = shortid.generate();

	const  {
		filename,
		subject,
		grade
	} = req.body;

	if(subject == "none" || grade == "none")
	{	
		res.render('layouts/add-document');
		return;
	}
	else
	{
		const ref = firebase.database().ref(`course/${grade}/${subject}/`);

		let atDate = new Date().toString().slice(0, 24);

		ref.set({
		  [cid]: {
		    uploadAt: atDate,
		    title: "Alan Turing",
		    filename: filename,
		    grade: grade,
		    subject: subject
		  }
		});

		const option = {
			destination: `thongtintuyensinh/${req.body.filename}`
		}

		const file = `${filename}`;

		console.log(file);

		bucket.upload(file, option, (err, file)=>{
			// if(err) res.redirect('/error');
			if(err) console.log(err);
		});


		// res.render("layouts/add-document", {
		// 	message: "Upload successfully!"
		// })
	}
	

}
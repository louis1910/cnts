const config = require('./config.js');
const db = config.db();
const admin = config.admin();
const firebase = config.firebase();
const shortid = require("shortid");


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
		res.render("layouts/add-document", {
			message: "Upload successfully!"
		})
	}
	

}
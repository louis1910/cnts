const shortid = require('shortid');
const random = shortid.generate();

const config = require('./config.js');

const admin = config.admin();
const firebase = config.firebase();

exports.home = async(req, res)=>{
	const idToken = req.signedCookies.idToken;
	const refCourse = firebase.database().ref(`course`);
	const refSubjects = firebase.database().ref(`subjects`);


	let grade, subjects;

	await refCourse.on("value", (snapshot)=>{
		let value = snapshot.val();

		grade = Object.keys(value);
	});

	refSubjects.on("value", (snapshot)=>{
		let value = snapshot.val();

		subjects = Object.keys(value);


	});


	if(typeof(idToken) != 'undefined' && idToken != false){
		admin.auth().verifyIdToken(idToken)
		  	.then((decodedToken)=> {
		    	const uid = decodedToken.uid;
		    	admin.auth().getUser(uid)
		    		.then((user)=>{
		    			let displayName = user.displayName;
		    			try{
			    			res.render('indexv2', {
			    				displayName: displayName,
			    				grade: grade,
			    				subjects: subjects
			  				})
		    			} catch(err){
		    				res.redirect("/error")
		    			}

		    		})
		    		.catch((err)=>{
		    			console.log(err);
		    		});
		  	})
		  	.catch(function(error) {
		  		res.redirect('/error');
		  		return;
			});
		return;
	}else {
		res.cookie('MK3S2', random);
		res.render('indexv2', {
			displayName: '',
		   	grade: grade,
		   	subjects: subjects
		});
	}
}


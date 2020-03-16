const shortid = require('shortid');
const random = shortid.generate();

const config = require('./config.js');

const admin = config.admin();
const firebase = config.firebase();

exports.home = (req, res)=>{
	const idToken = req.signedCookies.idToken;
	if(typeof(idToken) != 'undefined' && idToken != false){
		admin.auth().verifyIdToken(idToken)
		  	.then((decodedToken)=> {
		    	const uid = decodedToken.uid;
		    	admin.auth().getUser(uid)
		    		.then((user)=>{
		    			let displayName = user.displayName;
		    			res.render('index', {
		    				displayName: displayName
		  				})
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
		res.render('index', {
			displayName: ''
		});
	}
}


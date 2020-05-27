const shortid = require('shortid');
const random = shortid.generate();

const config = require('./config.js');

const admin = config.admin();
const firebase = config.firebase();


exports.home = async(req, res)=>{
	const idToken = req.signedCookies.idToken;
	let listedData;
	let numPage = req.query.page || 1;
	let perPage = 16;


	if(typeof(idToken) != 'undefined' && idToken != false){
		admin.auth().verifyIdToken(idToken)
		  	.then((decodedToken)=> {
		    	const uid = decodedToken.uid;
		    	admin.auth().getUser(uid)
		    		.then((user)=>{


		    			let displayName = user.displayName;
		    			try{
							let ref = admin.database().ref(`course/12/Toán`);
							ref.on('value', (snapshot)=>{
								let data = snapshot.val();
								let start = (numPage - 1) * perPage;
								let end = numPage * perPage;
								listedData = Object.entries(data);
								let len = Math.ceil(listedData.length / 8);

								let pagination = listedData.slice(start, end);
				    			res.render('indexfinal', {
				    				displayName: displayName,
				    				listedData: pagination,
									pageLen: len,
									numPage: numPage
				  				})
							}, (err)=>{
								console.log(err);
							});

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
		let ref = admin.database().ref(`course/12/Toán`);
		ref.on('value', (snapshot)=>{
			let data = snapshot.val();
			let start = (numPage - 1) * perPage;
			let end = numPage * perPage;
			listedData = Object.entries(data);
			let len = Math.ceil(listedData.length / 16);

			pagination = listedData.slice(start, end);

			res.cookie('MK3S2', random);
			res.render('indexfinal', {
				displayName: '',
				listedData: pagination,
				pageLen: len,
				numPage: numPage
			});
		}, (err)=>{
			console.log(err);
		});

	}
}


const config = require('../controllers/config.js');
const admin = config.admin();

exports.Math = ()=>{
let ref = admin.database().ref(`course/12/Toán`);
	ref.on('value', (snapshot)=>{
		let data = snapshot.val();
		return listedData = Object.entries(data);
	}, (err)=>{
		console.log(err);
	});
}
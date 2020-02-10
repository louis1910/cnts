const config = require('./config.js');
const db = config.db();

module.exports.index = async(req, res)=>{
	// Try remove async await
	await db.collection('users').get()
		.then((data)=>{
			data.forEach((doc)=>{
				console.log(doc.data());
			})
		})
		.catch((err)=>{
			throw new Error(err);
			// console.log('Error: ' + err);
		});
}



const config = require('./config.js');
const db = config.db();
const admin = config.admin();
const firebase = config.firebase();

exports.adminLogin = (req, res)=>{

}

exports.addDocs = (req, res)=>{
	res.render('./layouts/add-document');
}
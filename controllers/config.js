let admin = require("firebase-admin");
let firebase = require('firebase');

const serviceAccount = require("../serviceAccountKey.json");

const firebaseConfig = {
    apiKey: "AIzaSyCc0j_dam6pibLY5fkbKFucKd4lBUnchTc",
    authDomain: "camnangtuyensinh2020.firebaseapp.com",
    databaseURL: "https://camnangtuyensinh2020.firebaseio.com",
    projectId: "camnangtuyensinh2020",
    storageBucket: "camnangtuyensinh2020.appspot.com",
    messagingSenderId: "711303108590",
    appId: "1:711303108590:web:5a2bd6400a462a0f7220ff",
    measurementId: "G-GE3RS7VCB8"
 };

firebase.initializeApp(firebaseConfig);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://camnangtuyensinh2020.firebaseio.com",
    storageBucket: "camnangtuyensinh2020.appspot.com"
});



module.exports.db = ()=>{ 
	let db = admin.firestore();
	return db;
}

module.exports.bucket = ()=>{
    var bucket = admin.storage().bucket("camnangtuyensinh2020.appspot.com");
    return bucket;
}

module.exports.admin = ()=>{
	return admin;
}

module.exports.firebase = ()=>{
	return firebase;
}

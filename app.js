const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
let shortid = require('shortid');
let random = shortid.generate();

const multer = require('multer');

const config = require('./controllers/config.js');
const bucket = config.bucket();

const port = 9090;


const homeController = require('./controllers/homeController');
const middlewareAuth = require('./middleware/authencation.middleware');

const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');

var upload = multer({ dest: 'uploads/file/' });

app.set('view engine', 'ejs');
app.set('./views', 'view');


app.use(express.static('source'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser(random));

app.use('/user', userRoute);
app.use('/admin', adminRoute);
//-------------index
app.get('/', homeController.home);

app.get('/error',(req, res)=>{
	res.render('404/404');
})


app.get('/sample', (req, res)=>{

	res.render('sampleUploads');
})

app.post('/sample', upload.single('filename'), (req, res)=>{

	console.log(req.file);

	const path = req.file.path;
	console.log(req.file);
	// const pathToUpload = path.split("\\").splice(0, 2).join('/') + "/";

	

	// const option = {
	// 	destination: `thongtintuyensinh/`
	// }

	// const filename = req.file.originalname;
	// console.log(pathToUpload + filename);
	// console.log(filename);

	bucket.upload(path, (err, file)=>{
		console.log(err);
	});

	// function main(bucketName, filename) {
 //  		const {Storage} = require('@google-cloud/storage');
	// 	const storage = new Storage();

	// 	async function uploadFile() {
	// 	    // Uploads a local file to the bucket
	// 	    await storage.bucket(bucketName).upload(filename, {
	// 	      // Support for HTTP requests made with `Accept-Encoding: gzip`
	// 	      gzip: true,
	// 	      // By setting the option `destination`, you can change the name of the
	// 	      // object you are uploading to a bucket.
	// 	      metadata: {
	// 	        // Enable long-lived HTTP caching headers
	// 	        // Use only if the contents of the file will never change
	// 	        // (If the contents will change, use cacheControl: 'no-cache')
	// 	       cacheControl: 'public, max-age=31536000',
	// 	    },
	// 	});

 //    	console.log(`${filename} uploaded to ${bucketName}.`);

 // 		};

 // 		uploadFile().catch(console.error);
	//   // [END storage_upload_file]
	// }

	// main();
})










app.listen(port, ()=>console.log("Server is listening on port: " + port));
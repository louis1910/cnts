const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
let shortid = require('shortid');
let random = shortid.generate();

const port = 9090;


const index = require('./controllers/index.controller');
const middlewareAuth = require('./middleware/authencation.middleware');

const userRoute = require('./routes/user.route');


app.set('view engine', 'ejs');
app.set('./views', 'view');


app.use(express.static('source'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser(random));

app.use('/user', userRoute);

//-------------index
app.get('/', index.index);

app.get('/error',(req, res)=>{
	res.render('404');
})


app.get('/sample', (req, res)=>{
	res.render('sampleUploads');
})

app.post('/sample', (req, res)=>{
	const bucketName = 'thogntintuyensinh';
	const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';


	function main(bucketName, filename = './local/path/to/file.txt') {
  		const {Storage} = require('@google-cloud/storage');
		const storage = new Storage();

		async function uploadFile() {
		    // Uploads a local file to the bucket
		    await storage.bucket(bucketName).upload(filename, {
		      // Support for HTTP requests made with `Accept-Encoding: gzip`
		      gzip: true,
		      // By setting the option `destination`, you can change the name of the
		      // object you are uploading to a bucket.
		      metadata: {
		        // Enable long-lived HTTP caching headers
		        // Use only if the contents of the file will never change
		        // (If the contents will change, use cacheControl: 'no-cache')
		       cacheControl: 'public, max-age=31536000',
		    },
		});

    	console.log(`${filename} uploaded to ${bucketName}.`);

 		}

 		uploadFile().catch(console.error);
	  // [END storage_upload_file]
	}
})










app.listen(port, ()=>console.log("Server is listening on port: " + port));
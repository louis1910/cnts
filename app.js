const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
let shortid = require('shortid');
let random = shortid.generate();

const port = 9090;


const homeController = require('./controllers/homeController');
const middlewareAuth = require('./middleware/authencation.middleware');

const {
	isLogin,
	adminDisable
} = require('./middleware/authMiddleware');

const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');

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




app.listen(port, ()=>console.log("Server is listening on port: " + port));
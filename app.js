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




//-------------index
app.get('/', index.index);

app.get('/error',(req, res)=>{
	res.render('404');
})


app.use('/user', userRoute);





app.listen(port, ()=>console.log("Server is listening on port: " + port));
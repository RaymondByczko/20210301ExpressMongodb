const express = require('express');
const { MongoClient } = require("mongodb");
const json2html = require("node-json2html");
const mongodbqo  = require("./mongodbqo"); //.working;
const mongodbops = require("./mongodbops");
const conlogin = require("./controllers/conlogin");
const texttoimage = require("text-to-image");
const cors = require('cors');
const conroom = require("./controllers/conroom");
const pug = require('pug');

const canvas = require('canvas');
var bodyParser = require('body-parser');

var session = require('express-session');
const uuid = require('uuid');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

canvas.registerFont('Playfair.ttf', { family: 'Playfont' });
// const { registerFont } = require('canvas');

async function mainapp() {
const app = express();
app.set('view engine', 'pug');
app.set('views', './views');

let i=process.env.I;
let j=process.env.J;
let s1=process.env.S1;

let pingStatus = await mongodbops.pingWithCredentials(i,j);
let mongodbContact = pingStatus;


let uri = "mongodb+srv://"+i+":" + j+"@cluster0.c2u9s.mongodb.net/houseDB?retryWrites=true&w=majority";

await mongodbops.add(uri, "7 Main St", "dining room").catch((err)=>{
	console.log("add:dining err:start");
	// console.dir(err);
	console.log("add:dining err:end");
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("css"));
app.use ((err, req, res, next)=>{
	console.log('err='+err.stack);
	res.status(500).send('Something broken');
});
app.use(session({
	secret: process.env.S1,
	saveUninitialized: false,
  resave: false
}));
/******
app.use(session({
	secret: [s1],
	cookie: {
		maxAge: 300000
	},
	saveUninitialized: false,
	resave: true,
	secure: true,
	genid: (req)=>{
		return uuid.v4();
	}
}));
******/

app.set('trust proxy',1);
/**
 * PASSPORT
 */
passport.serializeUser(function(user, done) {
	console.log('... trying serializeUser');
	console.log('... ... user='+user);
	console.log('... ... user.id='+user.id);
  // done(null, user.id);
	done(null, user);
});

passport.deserializeUser(function(user, done) {
		// TODO check this
		let err=null;
    done(err, user);
  }
);

passport.use(new LocalStrategy(function(username, password, done){
	if (username != 'blue') {
		return done(null, false, { message: 'Incorrect username.' });
	}
	if (password != 'fisherman') {
		return done(null, false, { message: 'Incorrect password.' });
	}
	return done(null, username);
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res, next)=>{
	console.log('... first handler');
	next();
})

app.all('/', (req, res, next)=>{
	console.log('... app.all');
	next();
});

app.get('/', (req, res, next)=>{
	console.log('... second handler');
	next();
})

app.get('/', (req, res) => {
	console.log('... app.get');
	//if (req.session.user) //{
	//} else {
		// req.session.user = 'donut';
	//}
  res.render('index', {dbStatus: mongodbContact, title:'Express Mongo App',message:'Hi there'});
});

app.get('/login', conlogin.get_login(mongodbContact));

app.post('/login', /*(req, res, next)=>{*/
	//console.log('... app.post prelogin ');
	passport.authenticate('local', {
		successRedirect:'./',
		failureRedirect:'./loginfailed',
		failureFlash:false
	}));
	// next();
// })

app.post('/login', (req, res)=>{
	console.log('... app.post login');
	console.log('... ... req.body.username='+req.body.username);
	console.log('... ... req.body.password='+ req.body.password);
	res.location('/postlogin');
	res.status(303).send('... app.post login completed');
});

app.get('/logout', (req, res)=>{
	req.logOut();
	req.session.destroy();
	res.redirect('./');
});

/*
app.post('/login', (req, res, next)=>{
	console.log('... app.post postlogin ');
	passport.authenticate('local', {
		successRedirect:'./',
		failureRedirect:'./login',
		failureFlash:true
	});
	next();
})
*/
app.get('/loginfailed', (req, res)=>{
	res.send('Login failed..sorry');
});

app.get('/pagewithnoa', (req,res)=>{
	if (req.isAuthenticated() ){
		console.log('.. pagewithnoa is Authenticated');
	}
	else
	{
		console.log('.. pagewithnoa is not Authenticated');
	}
	res.send('Page no auth');
});

app.get('/pagewitha', (req,res)=>{
	//passport.authorize('local', {failureRedirect:'./accessprohibited'});

/**
	passport.authenticate('local', {
		successRedirect:'./pagewithauth',
		failureRedirect:'./accessprohibited',
		failureFlash:false
	});
	**/
	if (req.isAuthenticated()){
		console.log("... pagewitha is Authenticated");
		res.send('Pagewitha here');
	}
	else {
		console.log("...pagewitha is not Authenticated");
		res.redirect('./accessprohibited');
	}
});

app.get('/accessprohibited', (req,res)=>{
	res.send('Access denied');
});

app.get('/postlogin', (req, res)=>{
	res.send('We are in postlogin');
})

app.get('/dbstatus', async (req, res)=>{
	let pingStatus = await mongodbops.pingWithCredentials(i,j);
	// let mongodbContact = pingStatus;
	console.log('user='+req.session.user);
	res.json({'pingstatus':pingStatus})
});

app.post('/', async (req, res) => {
	console.log('.../index post reached');
	console.log(req.body);
	console.log('The fish equals ' + req.body.fish);
	// res.send('Post index reached');
	delete req.body.fish;
	let addRet = await conroom.addRoomNoRes(req, res);
	console.log('addRet='+addRet);
	res.redirect('./');
});

app.get('/rooms/readone', async (req, res)=>{
	let roomrecord = await mongodbops.getone(uri, null);
	console.log('roomrecord='+JSON.stringify(roomrecord));
	let uriNext = "/rooms";
	let uriPrev = "/rooms";
	res.links({
		next: uriNext,
		previous: uriPrev
	});
	res.send('readone is done');
});

app.get('/rooms/getnext/:id', async (req, res)=>{
	let id = req.params.id;
	let sortcode = 1;
	// id = "603e3d5281dfda975bb32c0a";
	let nextid = await mongodbops.getadjacent(mongodbqo.onegreater, sortcode, uri, "houseDB", "roomsCOL", id);
	console.log("... nextid="+nextid);
	res.send("id is " + nextid);
});

app.get('/rooms/getprev/:id', async (req, res)=>{
	let id = req.params.id;
	let sortcode = -1;
	let previd = await mongodbops.getadjacent(mongodbqo.onelesser, sortcode, uri, "houseDB", "roomsCOL", id);
	console.log("... previd="+previd);
	res.send("id is " + previd);
});


app.get('/rooms/:id', async (req, res)=>{
	let id = req.params.id;
	let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	console.log("fullUrl="+fullUrl);
	let reqDoc = await mongodbops.getone(uri, id);
	console.log("reqDoc=" + JSON.stringify(reqDoc));

	let sortcodedescend = -1;
	let previd = await mongodbops.getadjacent(mongodbqo.onelesser, sortcodedescend, uri, "houseDB", "roomsCOL", id);
	let sortcodeascend = 1;
	let nextid = await mongodbops.getadjacent(mongodbqo.onegreater, sortcodeascend, uri, "houseDB", "roomsCOL", id);
	console.log("... previd="+previd);
	console.log("... nextid="+nextid);
	let hostBase = req.protocol + "://" + req.get('host');
	let uriNext = hostBase + "/rooms/"+nextid;
	let uriPrev = hostBase + "/rooms/"+previd;
	res.links({
		next: uriNext,
		previous: uriPrev
	});
	// res.json({"recname":"recvalue"});
	res.format({
		'text/html': function (){
			// res.json(reqDoc);
			// res.send("textformatrecognized");
			let template=	{
				"<>":"li",
				"id":"${_id}",
				"html":[{"<>":"span","html":"${houseaddress} has a ${roomname}"}]
			};
			let theHtml = json2html.transform(reqDoc, template);
			// res.set('Access-Control-Allow-Origin','*');
			res.send(theHtml);
		},
		'application/json': function() {
			res.json(reqDoc);
		},
		// 'text/html': function() {
		'image/png': function() {
			// image/png should be set in call back.
			/*
			let genPromise = texttoimage.generate('Test png');
			genPromise.then((bufPng)=>{
				res.write(bufPng);
			}).catch((err)=>{console.log('err='+err)});
			*/
			let bufImg = texttoimage.generateSync('pg',{
				debug: true,
  			maxWidth: 100,
  			fontSize: 12,
  			fontFamily: 'Playfont',
  			lineHeight: 30,
  			margin: 5,
  			bgColor: "blue",
  			textColor: "red"
			});
			
			// var img = Buffer.from(bufImg, 'base64');
			// var img = Buffer.from(bufImg);
			// console.log('img0..20='+ img.slice(0,20).toString());
			var base64Data = bufImg.replace(/^data:image\/png;base64,/, '');
			// var base64Data = imageData1.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  var img = Buffer.from(base64Data, 'base64');
			// res.status(200).send(base64Data);
			// res.set('Content-Type', 'image/png');
			res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length
		// 'Access-Control-Allow-Origin': '*',
		// 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
			});
  		res.end(img);
			// res.send(bufImg);
			// res.send(img);
		}
	});
	// res.json(reqDoc);
	res.status(200);
});

app.post('/rooms', async (req, res)=>{
		await conroom.addRoom(req, res);
	}
);

app.listen(3000, () => {
  console.log('server started');
});
}

let mainret = mainapp();
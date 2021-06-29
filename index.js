/*
 * Provides the mainapp which creates an express application.  It is
 * defined as a async function, so we can then call await.  Especially
 * with regard to mongodb operations, it is useful to make these await.
 * Otherwise, call back handlers have to be supplied, and the code becomes
 * less linear, and less understandable.
 */
/*
 * Revision history
 * 2021-06-29, RByczko, Recent focus on the /users DELETE route.
 * Testing conuser.deleteUser interface. Added more console_log
 * for debugging. Added file documentation and revision history.
 * @TODO Clean up commented out code for testing the
 * conuser.deleteUser interface. @DONE 2021-06-29
 */
// import {createRequire} from "module";
// const require = createRequire(import.meta.url);
const express = require('express');
const mongoose = require('mongoose');
const stringifysafe = require('json-stringify-safe');
const { MongoClient } = require("mongodb");
const json2html = require("node-json2html");
const mongodbqo = require("./mongodbqo"); //.working;
const mongodbops = require("./mongodbops");
const util = require("./util");
// const console_log = util.console_log;
const console_log = util.produce_console_log('index.js');
const conlogin = require("./controllers/conlogin");
const texttoimage = require("text-to-image");
const cors = require('cors');
const conroom = require("./controllers/conroom");
const conuser = require("./controllers/conuser");
const conlimited = require("./controllers/conlimited");
const conlimiteduserjoin = require("./controllers/conlimiteduserjoin");
const conlimitedusage = require("./controllers/conlimitedusage");
const conuserlimitedusagejoin = require("./controllers/conuserlimitedusagejoin");
// conuserlimitedusagejoin.postUserLimitedUsageJoin

const modlimitedusage = require("./models/modlimitedusage");

const midlimited = require("./middleware/midlimited");
const rfetch = require("./fetch_commonjs");

// import {fetchDelete, validateDelete, fetchUserAll, alertFetchResponse} from './fetch.js';
// import * as rfetch from './esmodules/fetch.mjs';

const pug = require('pug');
const path = require('path');

const canvas = require('canvas');
var bodyParser = require('body-parser');

var session = require('express-session');
const uuid = require('uuid');
var passport = require('passport');
var bcryptjs = require('bcryptjs');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

canvas.registerFont('Playfair.ttf', { family: 'Playfont' });
// const { registerFont } = require('canvas');

/****
function console_log(x) {
	let clog=process.env.CLOG;
	if (clog) {	
		console.log(x);
	} else {
		const noop=()=>{};
		noop();
	}
}
****/

async function mainapp() {
	const app = express();
	app.set('view engine', 'pug');
	app.set('views', './views');


	let i = process.env.I;
	let j = process.env.J;

	let s1 = process.env.S1;

	let pingStatus = await mongodbops.pingWithCredentials(i, j);
	let mongodbContact = pingStatus;

	/***
	let uri = "mongodb+srv://"+i+":" + j+"@cluster0.c2u9s.mongodb.net/houseDB?retryWrites=true&w=majority";
	***/
	let uri = util.uri();
	await mongodbops.add(uri, "7 Main St", "dining room").catch((err) => {
		console_log("add:dining err:start");
		// console.dir(err);
		console_log("add:dining err:end");
	});

	////
	// DIFFERENT WAYS OF EXPLORING express.static
	// See p.161, Diary#16
	////
	// One way of using express.static
	//  - not active at this time
	if (false) {
		app.use(express.static(path.join(__dirname, "css")));
		app.use(express.static(path.join(__dirname, "webcomponents")));
		app.use('/limiteduserjoin', express.static(path.join(__dirname, "css")));
		app.use('/limiteduserjoin', express.static(path.join(__dirname, "webcomponents")));
	}

	// A second way of using express.static
	//  - not active at this time
	if (false) {
		app.use(express.static("css"));
		app.use(express.static("webcomponents"));
		app.use('/limiteduserjoin', express.static("css"));
		app.use('/limiteduserjoin', express.static("webcomponents"));
		app.use('/limited/user', express.static("css"));
		app.use('/limited/user', express.static("webcomponents"));
	}

	app.use(express.static("css"));
	app.use(express.static("webcomponents"));
	app.use('/fetch_ecmascriptmodule.js', express.static(__dirname + '/fetch_ecmascriptmodule.js'));


	app.use(cors());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json({type:"application/json"}));

	app.use((err, req, res, next) => {
		console_log('err=' + err.stack);
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

	app.set('trust proxy', 1);
	/**
	 * PASSPORT
	 */
	passport.serializeUser(async function(user, done) {
		console_log('... trying serializeUser');
		console_log('... ... user=' + user);
		console_log('... ... user.id=' + user.id);
		// done(null, user.id);

		let userDocument = await mongodbops.getUser(uri, user);
		console_log("... ... userDocument=" + JSON.stringify(userDocument));
		done_info = userDocument._id;
		// let done_info = user;
		// Substitute an id name for a username.
		// done_info = "11234";
		done(null, done_info);
	});

	app.use(util.lookfor('isAuthenticated', 'PREDESERIAL'));
	passport.deserializeUser(function(user, done) {
		// TODO check this
		console_log('... tryng deserializeUser');
		console_log('... ...  user =' + user);
		let err = null;
		done(err, user);
	}
	);

	app.use(util.lookfor('isAuthenticated', 'PRIOR NEW LOCAL'));

	passport.use(new LocalStrategy(async function(username, password, done) {
		console_log('passport.use::START');
		console_log('... username=' + username);
		console_log('... password=' + password);

		let userDocument = await mongodbops.getUser(uri, username);
		console_log("passport:use:userDocument=" + userDocument);

		if (userDocument == null) {
			// no account with that user
			console_log("... username not found");
			return done(null, false, { message: 'Incorrect username.' });
		}
		let compare = bcryptjs.compareSync(password, userDocument.password);
		if (!compare) {
			console_log("... password does not verify");
			return done(null, false, { message: 'Incorrect password.' });
		}
		return done(null, username);
	}));

	app.use(util.lookfor("isAuthenticated", "NEW STRATEGY"));
	app.use(passport.initialize());

	app.use(util.lookfor('isAuthenticated', 'PASSPORT.INITIALIZE'));
	app.use(passport.session());

	app.use(flash());

	app.get('/', (req, res, next) => {
		console_log('... first handler');
		next();
	})

	app.all('/', (req, res, next) => {
		console_log('... app.all');
		next();
	});

	app.get('/', (req, res, next) => {
		console_log('... second handler');
		next();
	})

	app.get('/', (req, res) => {
		console_log('... app.get');
		res.render('index', { dbStatus: mongodbContact, title: 'Express Mongo App', message: 'Hi there' });
	});

	app.get('/login', conlogin.get_login(mongodbContact));

	app.post('/login', /*(req, res, next)=>{*/
		// console_log('... app.post preauthenticate');
		passport.authenticate('local', {
			successRedirect: './',
			failureRedirect: './loginfailed',
			failureFlash: true
		}));

	// next();
	// })

	app.post('/login', (req, res) => {
		console_log('... app.post login');
		console_log('... ... req.body.username=' + req.body.username);
		console_log('... ... req.body.password=' + req.body.password);
		res.location('/postlogin');
		res.status(303).send('... app.post login completed');
	});

	app.get('/logout', (req, res) => {
		console_log('... logout');
		req.logOut();
		req.session.destroy();
		res.redirect('./');
	});

	/*
	app.post('/login', (req, res, next)=>{
		console_log('... app.post postlogin ');
		passport.authenticate('local', {
			successRedirect:'./',
			failureRedirect:'./login',
			failureFlash:true
		});
		next();
	})
	*/
	app.get('/loginfailed', (req, res) => {
		res.send('Login failed..sorry');
	});

	app.get('/pagewithnoa', (req, res) => {
		if (req.isAuthenticated()) {
			console_log('.. pagewithnoa is Authenticated');
		}
		else {
			console_log('.. pagewithnoa is not Authenticated');
		}
		res.send('Page no auth');
	});

	// Some half generic middleware for authentication.
	// In this enhanced example, give an array for set of routes.

	app.get(['/pagewitha1', '/pagewitha2'], (req, res, next) => {
		console_log("app.get pagewitha1[2]");
		if (req.isAuthenticated()) {
			console_log("... " + req.path + " is Authenticated");
			next();
		}
		else {
			console_log("..." + req.path + " is not Authenticated");
			res.redirect('./accessprohibited');
		}
	});

	function midlimitedtemp(req, res, next) {
		console_log('midlimitedtemp:START');
		next();
	}
	app.get(['/pagewitha1', '/pagewitha2'], midlimited.midlimited);

	app.get('/pagewitha1', (req, res) => {
		//passport.authorize('local', {failureRedirect:'./accessprohibited'});

		/**
			passport.authenticate('local', {
				successRedirect:'./pagewithauth',
				failureRedirect:'./accessprohibited',
				failureFlash:false
			});
			**/
		/*****
		if (req.isAuthenticated()){
			console_log("... pagewitha is Authenticated");
			res.send('Pagewitha here');
		}
		else {
			console_log("...pagewitha is not Authenticated");
			res.redirect('./accessprohibited');
		}
		****/
		// Lets rely on middleware for just authentication.
		console_log("... req=" + stringifysafe(req, null, 2));
		res.send('new Pagewitha1 here');
	});

	app.get('/pagewitha2', (req, res) => {
		res.send('new Pagewitha2 here');
	});

	app.get('/pagewitha3', (req, res) => {
		// passport.authenticate('session', {failureRedirect:'./accessprohibited'});
		res.send('new Pagewitha3 here');
	});

	app.get('/accessprohibited', (req, res) => {
		res.send('Access denied');
	});

	app.get('/postlogin', (req, res) => {
		res.send('We are in postlogin');
	})

	app.get('/dbstatus', async (req, res) => {
		let pingStatus = await mongodbops.pingWithCredentials(i, j);
		// let mongodbContact = pingStatus;
		console_log('user=' + req.session.user);
		res.json({ 'pingstatus': pingStatus })
	});

	app.post('/', async (req, res) => {
		console_log('.../index post reached');
		console_log(req.body);
		console_log('The fish equals ' + req.body.fish);
		// res.send('Post index reached');
		delete req.body.fish;
		let addRet = await conroom.addRoomNoRes(req, res);
		console_log('addRet=' + addRet);
		res.redirect('./');
	});

	app.get('/rooms/readone', async (req, res) => {
		let roomrecord = await mongodbops.getone(uri, null);
		console_log('roomrecord=' + JSON.stringify(roomrecord));
		let uriNext = "/rooms";
		let uriPrev = "/rooms";
		res.links({
			next: uriNext,
			previous: uriPrev
		});
		res.send('readone is done');
	});

	app.get('/rooms/getnext/:id', async (req, res) => {
		let id = req.params.id;
		let sortcode = 1;
		// id = "603e3d5281dfda975bb32c0a";
		let nextid = await mongodbops.getadjacent(mongodbqo.onegreater, sortcode, uri, "houseDB", "roomsCOL", id);
		console_log("... nextid=" + nextid);
		res.send("id is " + nextid);
	});

	app.get('/rooms/getprev/:id', async (req, res) => {
		let id = req.params.id;
		let sortcode = -1;
		let previd = await mongodbops.getadjacent(mongodbqo.onelesser, sortcode, uri, "houseDB", "roomsCOL", id);
		console_log("... previd=" + previd);
		res.send("id is " + previd);
	});


	app.get('/rooms/:id', async (req, res) => {
		let id = req.params.id;
		let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		console_log("fullUrl=" + fullUrl);
		let reqDoc = await mongodbops.getone(uri, id);
		console_log("reqDoc=" + JSON.stringify(reqDoc));

		let sortcodedescend = -1;
		let previd = await mongodbops.getadjacent(mongodbqo.onelesser, sortcodedescend, uri, "houseDB", "roomsCOL", id);
		let sortcodeascend = 1;
		let nextid = await mongodbops.getadjacent(mongodbqo.onegreater, sortcodeascend, uri, "houseDB", "roomsCOL", id);
		console_log("... previd=" + previd);
		console_log("... nextid=" + nextid);
		let hostBase = req.protocol + "://" + req.get('host');
		let uriNext = hostBase + "/rooms/" + nextid;
		let uriPrev = hostBase + "/rooms/" + previd;
		res.links({
			next: uriNext,
			previous: uriPrev
		});
		// res.json({"recname":"recvalue"});
		res.format({
			'text/html': function() {
				// res.json(reqDoc);
				// res.send("textformatrecognized");
				let template = {
					"<>": "li",
					"id": "${_id}",
					"html": [{ "<>": "span", "html": "${houseaddress} has a ${roomname}" }]
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
				}).catch((err)=>{console_log('err='+err)});
				*/
				let bufImg = texttoimage.generateSync('pg', {
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
				// console_
				log('img0..20=' + img.slice(0, 20).toString());
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

	app.post('/rooms', async (req, res) => {
		await conroom.addRoom(req, res);
	}
	);

	// Presents a form to add a user.
	// Its processed by post /users.
	app.get('/users', (req, res) => {
		console_log('... app.get /users');
		res.render('useradd', { dbStatus: mongodbContact, title: 'Express Mongo App', message: 'Add User Here' });
	});

	// Takes the form data from get /users
	// and adds the user to the database collection.
	app.post('/users', async (req, res) => {
		try {
			const console_log = util.produce_console_log('APP_POST_USERS');
			console_log('... app.post /users');
			let sendResponse = false;
			// When false, prevent conuser.addUser from sending
			// response.  And just let this function send it.
			let addUserRet = await conuser.addUser(req.body);
			let user_id = addUserRet.id;
			console_log("... addUserRet.id=" + addUserRet.id);
			let defaultLimitedUsage = modlimitedusage.defaultDocument();
			// @todo addLimitedUsage only needs a small subset of req.  Possibly change this interface to
			// use something other than req.
			let addLimitedUsageRet = await conlimitedusage.addLimitedUsage(defaultLimitedUsage);
			let limitedUsage_id = addLimitedUsageRet.id;
			console_log("... limitedUsage_id=" + limitedUsage_id);

		  let userLimitedUsageDoc = {
				user:user_id,
				limitedUsage:limitedUsage_id
			}
			// @get id of added document to limitedusage
			// collection.
			let postULUJ = await conuserlimitedusagejoin.postUserLimitedUsageJoin(userLimitedUsageDoc);
			// @todo Add user-limitedusage document to relevant collection here.
			if (!sendResponse) {
				res.send('User added - join - success');
			}
		}
		catch (e) {
			console.log("e=" + e);
			console.error("Something for error");
			if (e.stack) {
				console.log("e.stack exists");
			}
			else {
				console.log("e.stack does not exist");
			}
			let tr = console.trace();
			console.error("tr="+tr);
			console.error(e.stack);
			res.send('User added - join - fail');
		}
	});

	app.delete('/users', async (req, res)=>{
		const console_log = util.produce_console_log('APP_DELETE_USERS');
		try {
			console_log('... delete /users');
			console_log('... ... users_id='+req.body.users_id);

            // The following works well.
            let retDel = await conuser.deleteUser(conuser.getId(req.body.users_id));
            console_log("... ... retDel="+retDel);
			// res.send('User delete - success');
			res.format({
				'application/json': function() {
					console_log("... ... ... delete /users format application/json");
					res.status(200).json(

						// rfetch.delete_users_200_json_response()
						/**/
						{
							status:"success",
							origin:"app.delete /users",
							file: "index.js"
						}
						);
					},
				'text/csv': function() {
					console_log("... ... ... delete /users format text/csv");
					res.status(200).send('Response to text-csv');
				},
				'application/sql': function() {
					console_log("... ... ... delete /users format application/sql");
					res.status(200).send("selectbbbb");
				},
				default: function() {
					console_log("... ... ... delete /users format DEFAULT");
					res.status(200).json({default:"ison"});
				}
			});
		} catch (e) {
			// res.send('User delete - fail)');
			console_log("... ... ... delete /users catch");
			console_log("... ... ... ... e.message="+e.message);
			console_log("... ... ... ... e.stack="+e.stack);
			res.status(500).json(
				{
					status:"failure",
					origin:"app.delete /users",
					file: "index.js"
				}
			)
		}
	});

/// STA-1
	// Presents a form to delete a user.
	// Its processed by post /users.
	app.get('/users/delete', async (req, res) => {
		const console_log = util.produce_console_log("APP_GET_USERS_DELETE");
		console_log('... app.get /users/delete');
		// Get users here
		let userAll = await conlimiteduserjoin.getUserAll(req, res);
		console_log('... userAll='+userAll);
		res.render('userdelete', { dbStatus: mongodbContact, title: 'Express Mongo App', message: 'Delete User Here', userAll: userAll });
	});
//  END-1
	/*
	 * Presents the page to enter data into /users/deletethe limited
	 * collection.  This form will
	 * then reference a post route to add the data to a mongodb.
	 * 
	 */
	app.get('/limited', (req, res) => {
		console_log('... app.get /limited');
		res.render('limitedadd', {
			dbStatus: mongodbContact, title: 'Express Mongo App', message: 'Add Limited Here'
		});
	}
	);

	app.post('/limited', async (req, res) => {
		console_log('app.post limited:start');
		console_log('... req.body=' + JSON.stringify(req.body));
		let byTimeOfDayParsed = JSON.parse(req.body.byTimeOfDay);
		console_log('... byTimeOfDayParsed=' + byTimeOfDayParsed);
		console_log('... byTimeOfDayParsed=' + JSON.stringify(byTimeOfDayParsed));
		req.body.byTimeOfDay = byTimeOfDayParsed;
		await conlimited.addLimited(req, res);
	}
	);
	app.get('/limited/user/join', async (req, res) => {
		console_log('app.get /limited/user/join');
		// present the forms to allow joining two collections with a third collection.
		res.render('limiteduserjoin', {
			dbStatus: mongodbContact, title: 'Express Mongo App', message: 'limited-user-join here'
		});
	});

	/*
	 * This is a form action for a form found
	 * in /limited/user/join.
	 * 
	 * The two important named values are:
	 * 	selectuser
	 *  selectlimited
	 */
	app.post('/limited/user/join', async (req, res) => {
		console_log('app.post /limited/user/join');
		console_log('... selectuser=' + req.body.selectuser);
		console_log('... selectlimited=' + req.body.selectlimited);
		await conlimiteduserjoin.postLimitedUserJoin(req, res);
		// res.send('l u join processed');

	});

	/*
	 * /useall - an endpoint for getting all
	 * of the documents in the Users collection.
	 *  - currently it is stubbed with a
	 *  non-mongodb test implementation.
	 *  - need to add controller code to it.
	 *  - will probably be renamed, with possible query
	 *  parameters used.
	 */
	app.get('/userall', async (req, res) => {
		console_log("app get /userall");
		let userDocs = await conlimiteduserjoin.getUserAll(req, res);
		// The following is suitable test data to return.
		/**
		let userDocs = [
			{
				name:"Person1",
				id:"123456"
			},
			{
				name:"Person2",
				id:"789012"
			}
		];
		**/
		return res.json(userDocs);
	});


	/*
	 * Returns a json data of all documents in the
	 * Limited collection.  name and _id are selected
	 * in each document.
	 */
	app.get('/limitedall', async (req, res) => {
		console_log("app get /limitedall");
		let userDocs = await conlimiteduserjoin.getLimitedAll(req, res);
		return res.json(userDocs);
	});


	app.listen(3000, () => {
		console_log('server started');
	});
}

let mainret = mainapp();
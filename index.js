const express = require('express');
const { MongoClient } = require("mongodb");
const json2html = require("node-json2html");
const mongodbqo  = require("./mongodbqo"); //.working;
const mongodbops = require("./mongodbops");
const texttoimage = require("text-to-image");
const cors = require('cors');
const conroom = require("./controllers/conroom");
const pug = require('pug');

const canvas = require('canvas');
var bodyParser = require('body-parser');

canvas.registerFont('Playfair.ttf', { family: 'Playfont' });
// const { registerFont } = require('canvas');

async function mainapp() {
const app = express();
app.set('view engine', 'pug');
app.set('views', './views');

let i=process.env.I;
let j=process.env.J;

let pingStatus = await mongodbops.pingWithCredentials(i,j);
let mongodbContact = pingStatus;

// Connection URI
/**** below is refactored into pingWithCredentials
let uri = "mongodb+srv://"+i+":" + j+"@cluster0.c2u9s.mongodb.net/houseDB?retryWrites=true&w=majority";

let mongodbContact = "beforeping";
console.log("mongodbContact(INI)="+mongodbContact);
await mongodbops.ping(uri).catch((err)=>{
	console.log('mongodbContact(CATCH):'+mongodbContact);
	mongodbContact = "pingfailed";
	// console.dir(err);
}).finally(()=>{
	console.log("mongodbContact(FINALLY)="+ mongodbContact);
	if (mongodbContact == "pingfailed"){
		console.log("pingfailed detected");
	}
	else {
		console.log("pingfailed not detected");
		mongodbContact="pingsuccess";
	}
	// if (mongodbContact.localeCompare("beforeping") === 0) {
	// 	mongodbContact = "pingsuccess";
	// }
});
console.log("mongodbContact(LAST)="+mongodbContact);
****/
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
})

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
  res.render('index', {dbStatus: mongodbContact, title:'Express Mongo App',message:'Hi there'});
	// res.render('index');
	// res.send('Hello Express app-enhanced!')
});

app.get('/dbstatus', async (req, res)=>{
	let pingStatus = await mongodbops.pingWithCredentials(i,j);
	// let mongodbContact = pingStatus;
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
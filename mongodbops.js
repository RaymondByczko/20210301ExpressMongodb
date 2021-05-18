const { MongoClient } = require("mongodb");
const mongodbqo = require("./mongodbqo");

const console_log = require('./util').console_log;
/****
function console_log(x){
	let clog=process.env.CLOG;
	if (clog) {
		console.log(x);
	} else {
		const noop=()=>{};
		noop();
	}
}
****/

async function ping(uri) {
	let client = null;
  try {
		client = new MongoClient(uri, {useUnifiedTopology: true});
    await client.connect();

    // Establish and verify connection
    await client.db("houseDB").command({ ping: 1 });
    console_log("Able to ping server");
  } finally {
    await client.close();
  }
}
//STHERE
async function pingWithCredentials(U,P)
{
let uri = "mongodb+srv://"+U+":" + P+"@cluster0.c2u9s.mongodb.net/houseDB?retryWrites=true&w=majority";

let mongodbContact = "beforeping";
console_log("mongodbContact(INI)="+mongodbContact);
await ping(uri).catch((err)=>{
	console_log('mongodbContact(CATCH):'+mongodbContact);
	mongodbContact = "pingfailed";
	// console_dir(err);
}).finally(()=>{
	console_log("mongodbContact(FINALLY)="+ mongodbContact);
	if (mongodbContact == "pingfailed"){
		console_log("pingfailed detected");
	}
	else {
		console_log("pingfailed not detected");
		mongodbContact="pingsuccess";
	}
});
console_log("mongodbContact(LAST)="+mongodbContact);
return mongodbContact;
}
//ENHERE

async function add(uri, houseaddress, roomname) {
	let client = null;
  try {
		client = new MongoClient(uri, {useUnifiedTopology: true});
    await client.connect();

    // Establish and verify connection
    await client.db("houseDB").collection("roomsCOL").insertOne(
			{ "houseaddress": houseaddress,
				"roomname": roomname
				});
    console_log("Add successfull to server");
  } finally {
    await client.close();
  }
}

async function getone(uri, theId) {
  let client = null;
	let onerec = null;
	try {
		client = new MongoClient(uri, {useUnifiedTopology: true});
		console_log('getone:start');
    await client.connect();
		console_log('... after getone: connect');
		let query = {};
		
		if (theId == null) {
			console_log('getone: theId is null');
		}
		else {
			console_log('getone: theId is not null');
		}
		
		query = mongodbqo.onewithid(theId).query;
		options = mongodbqo.onewithid(theId).options;

    onerec = await client.db("houseDB").collection("roomsCOL").findOne(query, options);
    console_log("Successful getone:onerec="+JSON.stringify(onerec));
		console_log("onerec._id="+onerec._id);
		// return onerec;
  } finally {
    // Ensures that the client will close when you finish/error
    console_log("getone: finally");
		await client.close();
  }
	console_log("getone reached here");
	return onerec;
}

async function getone_notused(uri, theId) {
  let client = null;
	let onerec = null;
	try {
		client = new MongoClient(uri, {useUnifiedTopology: true});
		console_log('getone:start');
    await client.connect();
		console_log('... after getone: connect');
		let query = {};
		
		if (theId == null) {
			console_log('getone: theId is null');
		}
		else {
			console_log('getone: theId is not null');
		}
		
		query = mongodbqo.working().query;
		options = mongodbqo.working().options;

    onerec = await client.db("houseDB").collection("roomsCOL").findOne(query, options);
    console_log("Successful getone:onerec="+JSON.stringify(onerec));
		console_log("onerec._id="+onerec._id);
		// return onerec;
  } finally {
    // Ensures that the client will close when you finish/error
    console_log("getone: finally");
		await client.close();
  }
	console_log("getone reached here");
	return onerec;
}

/*
 * returns the _id of the adjacent document
 * assuming that collection is in ascending
 * order by _id.
 * 
 * Whether that adjacent record is the
 * previous or the next one is set by
 * prevornext.
 * 
 * prevornext is set to either onelesser
 * or onegreater. These are functions in
 * mongodbqo module.
 * 
 * sortcode indicates ascending or descend-
 * ing sorting.  Its actually a deeper
 * implementation issue, but allows
 * flexibity in development.
 */
async function getadjacent(prevornext, sortcode, uri, db, coll, theId) {
  let client = null;
	let onerec = null;
	let docs = null;
	try {
		client = new MongoClient(uri, {useUnifiedTopology: true});
		console_log('getadjacent:start');
    await client.connect();
		console_log('... after getadjacent: connect');
		let query = {};
		
		if (theId == null) {
			console_log('getadjacent: theId is null');
		}
		else {
			console_log('getadjacent: theId is not null');
		}
		
		query = prevornext(theId).query;
		options = prevornext(theId).options;
		// query = mongodbqo.onegreater(theId).query;
		// options = mongodbqo.onegreater(theId).options;

    docs = await client.db(db).collection(coll).find(query).sort({_id:sortcode}).limit(2).toArray();
    console_log("Successful getadjacent:docs="+JSON.stringify( docs));
  } finally {
    // Ensures that the client will close when you finish/error
    console_log("getadjacent: finally");
		await client.close();
  }
	console_log("getadjacent reached here");
	return (docs.length == 2)?docs[1]._id:null;
}
/// Added getUser START
async function getUser(uri,name) {
	  let client = null;
	let onerec = null;
	try {
		client = new MongoClient(uri, {useUnifiedTopology: true});
		console_log('getUser:start');
    await client.connect();
		console_log('... after getUser: connect');
		let query = {};
		
		if (name == null) {
			console_log('getUser: name is null');
		}
		else {
			console_log('getUser: name is not null');
		}
		
		query = mongodbqo.onewithuser(name).query;
		options = mongodbqo.onewithuser(name).options;

    onerec = await client.db("houseDB").collection("usersCOL").findOne(query, options);
    console_log("Successful getUser:onerec="+JSON.stringify(onerec));
		if (onerec != null) {
			console_log("getUser: onerec._id="+onerec._id);
		}
  } finally {
    console_log("getUser: finally");
		await client.close();
  }
	console_log("getUser reached here");
	return onerec;
}
/// Added getUser END


exports.ping = ping;
exports.pingWithCredentials = pingWithCredentials;
exports.add = add;
exports.getone = getone;
exports.getadjacent= getadjacent;
exports.getUser = getUser;
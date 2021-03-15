const { MongoClient } = require("mongodb");
const mongodbqo = require("./mongodbqo");

async function ping(uri) {
	let client = null;
  try {
		client = new MongoClient(uri, {useUnifiedTopology: true});
    await client.connect();

    // Establish and verify connection
    await client.db("houseDB").command({ ping: 1 });
    console.log("Able to ping server");
  } finally {
    await client.close();
  }
}

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
    console.log("Add successfull to server");
  } finally {
    await client.close();
  }
}

async function getone(uri, theId) {
  let client = null;
	let onerec = null;
	try {
		client = new MongoClient(uri, {useUnifiedTopology: true});
		console.log('getone:start');
    await client.connect();
		console.log('... after getone: connect');
		let query = {};
		
		if (theId == null) {
			console.log('getone: theId is null');
		}
		else {
			console.log('getone: theId is not null');
		}
		
		query = mongodbqo.onewithid(theId).query;
		options = mongodbqo.onewithid(theId).options;

    onerec = await client.db("houseDB").collection("roomsCOL").findOne(query, options);
    console.log("Successful getone:onerec="+JSON.stringify(onerec));
		console.log("onerec._id="+onerec._id);
		// return onerec;
  } finally {
    // Ensures that the client will close when you finish/error
    console.log("getone: finally");
		await client.close();
  }
	console.log("getone reached here");
	return onerec;
}

async function getone_notused(uri, theId) {
  let client = null;
	let onerec = null;
	try {
		client = new MongoClient(uri, {useUnifiedTopology: true});
		console.log('getone:start');
    await client.connect();
		console.log('... after getone: connect');
		let query = {};
		
		if (theId == null) {
			console.log('getone: theId is null');
		}
		else {
			console.log('getone: theId is not null');
		}
		
		query = mongodbqo.working().query;
		options = mongodbqo.working().options;

    onerec = await client.db("houseDB").collection("roomsCOL").findOne(query, options);
    console.log("Successful getone:onerec="+JSON.stringify(onerec));
		console.log("onerec._id="+onerec._id);
		// return onerec;
  } finally {
    // Ensures that the client will close when you finish/error
    console.log("getone: finally");
		await client.close();
  }
	console.log("getone reached here");
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
		console.log('getadjacent:start');
    await client.connect();
		console.log('... after getadjacent: connect');
		let query = {};
		
		if (theId == null) {
			console.log('getadjacent: theId is null');
		}
		else {
			console.log('getadjacent: theId is not null');
		}
		
		query = prevornext(theId).query;
		options = prevornext(theId).options;
		// query = mongodbqo.onegreater(theId).query;
		// options = mongodbqo.onegreater(theId).options;

    docs = await client.db(db).collection(coll).find(query).sort({_id:sortcode}).limit(2).toArray();
    console.log("Successful getadjacent:docs="+JSON.stringify( docs));
  } finally {
    // Ensures that the client will close when you finish/error
    console.log("getadjacent: finally");
		await client.close();
  }
	console.log("getadjacent reached here");
	return (docs.length == 2)?docs[1]._id:null;
}



exports.ping = ping;
exports.add = add;
exports.getone = getone;
exports.getadjacent= getadjacent;
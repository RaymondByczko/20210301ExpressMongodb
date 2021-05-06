/*
 * This is a controller invoked by the route call back.
 * It provides the major function,
 * addLimited, that is invoked by
 * that callback.  Basically, a Limited document is added to the Limited collection.
 * Here is how it works.
 * 
 * When produceLimited is invoked, the
 * Limited model is returned.  That
 * model is used to add a Limited document
 * to a collection.  To see what is
 * stored in a Limited document, see
 * models/modlimited.
 */
const produceLimited  = require('../models/modlimited').produceLimited;

const produceUsers = require('../models/moduser').produceUsers;

async function getLimited(req, res) {
	console.log("getLimited:start");
	// console.log("... req.body="+req.body);
	// console.log("... req.body(str)="+JSON.stringify(req.body));
	function processError(err) {
		console.log('processError: '+err);
	}
	let Limited = produceLimited();


	let newLimited = new Limited(req.body);
	let allDocs = await newLimited.find({}, ["name", "_id"]).catch(processError);

	// Assume no error if this point is reached.
	/*
	newLimited.save((err, limited)=>{
		if (err) {
			console.log("getLimited:err");
			res.send(err);
		}
		else {
			console.log("getLimited:noerr");
			res.json(limited);
		}
	})
	*/
	console.log("allDocs="+JSON.stringify(allDocs));
	return allDocs;
};

async function getUser(req, res) {
	console.log("getUser:start");
	// console.log("... req.body="+req.body);
	// console.log("... req.body(str)="+JSON.stringify(req.body));
	function processError(err) {
		console.log('processError: '+err);
	}
	let User = produceUsers();
	/* Use singular of User. */


	// let newUser = new User(req.body);
	let allDocs = await User.find({}, ["name", "_id"]).catch(processError);

	// Assume no error if this point is reached.
	console.log("getUser:allDocs="+JSON.stringify(allDocs));
	return allDocs;
};

exports.getLimited = getLimited;
exports.getUser = getUser;
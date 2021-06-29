/*
 * Contains various operations (i.e. functions used to operate
 * on the user collection.
 */
/*
 * Revision history
 * 2021-06-29, RByczko, Enhanced parameter checking for deleteUser interface.
 * 2021-06-29, RByczko, Added a number of override functions for getId, all of
 * which can be used with deleteUser.
 *
 */
const produceUsers  = require('../models/moduser').produceUsers;
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const console_log = require('../util').produce_console_log("conuser.js");

/*
 * addUser depends on the presence of the following
 * properties at userObject (e.g. req.body) a) name b) password.
 *
 * sendResponse: boolean indicating whether to actually 
 * send the response, or just return saved document todo
 * calling code. @note No longer needed.
 *
 * Changing signature from addUser(req,res,sendResponse)
 * to addUser(userObject).  For the most part, userObject
 * is set to req.body.  But it can be set to other things
 * and have nothing to do with the request object in a
 * handler.
 */
async function addUser(userObject) {
	console_log("conuser.js:addUser:start");
	if (!(userObject.name&&userObject.password)) {
		throw 'name and or body missing';
	}
	let Users = produceUsers();
	console_log("... userObject.name="+userObject.name);
	// @todo remove the following before production.
	console_log("... userObject.password="+userObject.password);
	let password = userObject.password;
	// Performing hash of password.
	// @todo put this into its own module.
	let salt = bcryptjs.genSaltSync(12);
	let hash = bcryptjs.hashSync(password, salt);
	userObject.password=hash;

	/***
	 alternativeUsersCreate(Users, req, res, sendResponse){
	***/
	let usersRet = await Users.create(userObject);
	return usersRet;
};

/*
 * This is an alternative to Users.create, relying
 * instead on callbacks.  It is maintained here
 * to document now to a) new Users b) newUser.save
 * c) determine outcome from err supplied in callback.
 * It probably won't be useful but a record of
 * how to do this is here.  The promise based
 * Users.create is better.
 */
function alternativeUsersCreate(Users, req, res, sendResponse){
	let newUser = new Users(req.body);
	newUser.save((err, user)=>{
		if (err) {
			console_log("... addUser:err");
			if (sendResponse) {
				res.send(err);
			}
			else {
				return err;
			}
		}
		else {
			console_log("... addUser:noerr");
			if (sendResponse) {
				res.json(user);
			}
			else {
				console_log("... user="+user);
				return user;
			}
		}
	})
}

/*
 * Deletes one document from the User collection
 * given the id of that document. id must be
 * a non-empty string.  An exception will be throw
 * if a) id is undefined b) id is an empty string
 * c) id is not of type string.
 */
async function deleteUser(id) {
	console_log("conuser.js:deleteUser:start");
	if (id) {

	}
	else {
		throw Error("conuser.js:deleteUser: id not defined")
	}
	if (id === "") {
		throw Error("conuser.js:deleteUser: id is empty string");
	}
	if ( !(typeof(id)== "string") || (id instanceof mongoose.Types.ObjectId) )
	{
		throw Error("conuser.js:deleteUser id is not a string and is not ObjectId");
	}
	// if (typeof(id) !== "string") {
	//	throw Error("conuser.js:deleteUser: id is not string, it is " + typeof(id));
	// }
	let Users = produceUsers();
	let retDel = await Users.deleteOne({_id:id});
	return retDel;
}

/*
 * Allows us to inject the normal id expected, but if an override
 * is present, it will use that.  This allows experimental code
 * to be factored away and preserved, without making the call to
 * deleteUser messy (with lots of commented out code etc).
 */
function getId(normalId, override=null) {
	if (override == null) {
		return normalId;
	}
	if (typeof(override) == "function" ) {
		let retOverride = override();
		return retOveride;
	}
	return override;
}

/*
 * Help to test more defined interface for conuser.deleteUser.
 * This returns an empty string.  Most likely an error can be
 * thrown and picked up by catch.
 */
function overrideEmptyString() {
	return "";
}

function overrideNumber() {
	return 5;
}

/*
 * Help to test more defined interface for conuser.deleteUser.
 * This returns an invalid id.  This will probably lead to the
 * following error observed. "Cast to ObjectId failed for value
 * "1234" at path "_id" for model "UsersCol".
 */
function overrideIdInvalid() {
	return "1234";
}

/*
 * Help to test more defined interface for conuser.deleteUser.
 */
function overrideIdCastOkStillInvalid() {
	return "123456789012345678901234";
}

function overrideObjectIdInvalid() {
	return mongoose.Types.ObjectId("123456789012345678901234");
}

function override12Hex() {
	return "012345678912";
}

exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.getId = getId;
exports.overrideEmptyString = overrideEmptyString;
exports.overrideNumber = overrideNumber;
exports.overrideIdInvalid = overrideIdInvalid;
exports.overrideIdCastOkStillInvalid = overrideIdCastOkStillInvalid;
exports.overrideObjectIdInvalid = overrideObjectIdInvalid;
exports.override12Hex = override12Hex;
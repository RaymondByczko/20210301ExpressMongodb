/*
 * Contains various operations (i.e. functions used to operate
 * on the user collection.
 */
const produceUsers  = require('../models/moduser').produceUsers;
const bcryptjs = require('bcryptjs');

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

exports.addUser = addUser;
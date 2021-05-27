const produceUsers  = require('../models/moduser').produceUsers;
const bcryptjs = require('bcryptjs');

const console_log = require('../util').produce_console_log("conuser.js");

/*
 * sendResponse: boolean indicating whether to actually 
 * send the resonse, or just return saved document todo
 * calling code.
 */
async function addUser(req, res, sendResponse) {
	console_log("conuser.js:addUser:start");
	let Users = produceUsers();
	console_log("... req.body.name="+req.body.name);
	// @todo remove the following before production.
	console_log("... req.body.password="+req.body.password);
	let password = req.body.password;
	// Perorming hash of password.
	// @todo put this into its own module.
	let salt = bcryptjs.genSaltSync(12);
	let hash = bcryptjs.hashSync(password, salt);
	req.body.password=hash;

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
				return user;
			}
		}
	})
};

exports.addUser = addUser;
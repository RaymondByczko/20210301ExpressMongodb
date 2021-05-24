const produceUsers  = require('../models/moduser').produceUsers;
const bcryptjs = require('bcryptjs');

const console_log = require('../util').produce_console_log("conuser.js");

async function addUser(req, res) {
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
			res.send(err);
		}
		else {
			console_log("... addUser:noerr");
			res.json(user);
		}
	})
};

exports.addUser = addUser;
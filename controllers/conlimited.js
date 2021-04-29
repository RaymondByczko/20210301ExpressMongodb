const produceLimited  = require('../models/modlimited').produceLimited;
const bcryptjs = require('bcryptjs');

async function addLimited(req, res) {
	console.log("addLimited:start");
	let Limited = produceLimited();
	console.log("... req.body.name="+req.body.name);
	// @todo remove the following before production.
	console.log("... req.body.password="+req.body.password);
	let password = req.body.password;
	// Perorming hash of password.
	// @todo put this into its own module.
	let salt = bcryptjs.genSaltSync(12);
	let hash = bcryptjs.hashSync(password, salt);
	req.body.password=hash;

	let newLimited = new Limited(req.body);
	newLimited.save((err, limited)=>{
		if (err) {
			console.log("addLImited:err");
			res.send(err);
		}
		else {
			console.log("addLimited:noerr");
			res.json(limited);
		}
	})
};

exports.addLimited = addLimited;
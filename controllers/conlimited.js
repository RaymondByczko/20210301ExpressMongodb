const produceLimited  = require('../models/modlimited').produceLimited;
const bcryptjs = require('bcryptjs');

async function addLimited(req, res) {
	console.log("addLimited:start");
	let Limited = produceLimited();
	// console.log("... req.body.name="+req.body.name);

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
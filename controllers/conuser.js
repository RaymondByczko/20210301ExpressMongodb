const produceUsers  = require('../models/moduser').produceUsers;

async function addUser(req, res) {
	console.log("addUser:start");
	let Users = produceUsers();
	let newUser = new Users(req.body);
	newUser.save((err, user)=>{
		if (err) {
			console.log("addUser:err");
			res.send(err);
		}
		else {
			console.log("addUser:noerr");
			res.json(user);
		}
	})
};
const Rooms  = require('../models/modroom').Rooms;

async function addRoom(req, res) {
	console.log("addRoom:start");
	let newRoom = new Rooms(req.body);
	newRoom.save((err, room)=>{
		if (err) {
			console.log("addRoom:err");
			res.send(err);
		}
		else {
			console.log("addRoom:noerr");
			res.json(room);
		}
	})
};

exports.addRoom = addRoom;
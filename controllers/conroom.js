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

async function addRoomNoRes(req, res) {
	console.log("addRoomNoRes:start");
	let newRoom = new Rooms(req.body);
	newRoom.save((err, room)=>{
		if (err) {
			console.log("addRoomNoRes:err="+err);
			// res.send(err);
			return false;
		}
		else {
			console.log("addRoomNoRes:noerr");
			// res.json(room);
			return true;
		}
	})
};

exports.addRoom = addRoom;
exports.addRoomNoRes = addRoomNoRes;
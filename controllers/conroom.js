/*
 * This file provides a controller called by a
 * routing callback, allowing
 * for the eventual adding a Rooms
 * document to its corresponding
 * collecton.
 */

const produceRooms  = require('../models/modroom').produceRooms;

async function addRoom(req, res) {
	console.log("addRoom:start");
	let Rooms = produceRooms();
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
	let Rooms = produceRooms();
	let newRoom = new Rooms(req.body);
	newRoom.save((err, room)=>{
		if (err) {
			console.log("addRoomNoRes:err="+err);
			return false;
		}
		else {
			console.log("addRoomNoRes:noerr");
			return true;
		}
	})
};

exports.addRoom = addRoom;
exports.addRoomNoRes = addRoomNoRes;
/*
 * This file provides a controller called by a
 * routing callback, allowing
 * for the eventual adding a Rooms
 * document to its corresponding
 * collecton.
 */

const produceRooms  = require('../models/modroom').produceRooms;

const console_log = require('../util').console_log;

async function addRoom(req, res) {
	console_log("addRoom:start");
	let Rooms = produceRooms();
	let newRoom = new Rooms(req.body);
	newRoom.save((err, room)=>{
		if (err) {
			console_log("addRoom:err");
			res.send(err);
		}
		else {
			console_log("addRoom:noerr");
			res.json(room);
		}
	})
};

async function addRoomNoRes(req, res) {
	console_log("addRoomNoRes:start");
	let Rooms = produceRooms();
	let newRoom = new Rooms(req.body);
	newRoom.save((err, room)=>{
		if (err) {
			console_log("addRoomNoRes:err="+err);
			return false;
		}
		else {
			console_log("addRoomNoRes:noerr");
			return true;
		}
	})
};

exports.addRoom = addRoom;
exports.addRoomNoRes = addRoomNoRes;
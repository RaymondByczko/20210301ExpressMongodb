const mongoose = require('mongoose');
const console_log = require('../util').console_log;

function produceRooms() {
let i=process.env.I;
let j=process.env.J;

let uri = "mongodb+srv://"+i+":" + j+"@cluster0.c2u9s.mongodb.net/houseDB?retryWrites=true&w=majority";

function onMError(err) {
	console_log("onMError:err="+err);
}

console_log("mongoose.connect::prior");
mongoose.connect
(uri, {useNewUrlParser: true, useUnifiedTopology: true}).catch((err)=>{onMError(err);});

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
	houseAddress: {
		type: String
	},
	roomName: {
		type: String
	},
	location: {
		type: String
	},
	sqfootage: {
		type: Number
	}
});

let colName = "roomsCOL";
const Rooms = mongoose.model('RoomsCol', RoomSchema, colName);
return Rooms;
}

exports.produceRooms = produceRooms;
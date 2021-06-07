const mongoose = require('mongoose');
// import mongoose = require("mongoose");
const console_log = require('../util').console_log;

let Users = null;

function produceUsers() {
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
const options = {
	discriminatorKey: 'kind'
}

const UserSchema = new Schema({
		name: {
			type: String
		},
		password: {
			type: String
		},
		role: {
			type: String
		},
		active: {
			type: Boolean
		}
	},
	options);

if (Users == null) {
	let colName = "usersCOL";
	Users = mongoose.model('UsersCol', UserSchema, colName);
}
return Users;
}

exports.produceUsers = produceUsers;
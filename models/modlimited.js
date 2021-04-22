/*
	This is a model for the 'limited' class of
	data, that helps manage user interaction with
	a website.  For example, a user can be limited by the
	number of good login attempts, allowing part
	functionality of a website.
*/
const mongoose = require('mongoose');
const util = require('util');

function produceLimited() {
let i=process.env.I;
let j=process.env.J;

let uri = util.uri();

function onMError(err) {
	console.log("onMError:err="+err);
}

console.log("mongoose.connect::prior");
mongoose.connect
(uri, {useNewUrlParser: true, useUnifiedTopology: true}).catch((err)=>{onMError(err);});

const Schema = mongoose.Schema;

const TimeSchema = new Schema({
	hour: {type: Number, min:0, max:24},
	minute: {type: Number, min:0, max:59},
	second: {type: Number, min:0, max:59}
});
const TimeRangeSchema = new Schema({
	startTime: TimeSchema,
	endTime: TimeSchema,
	required: function() {
		let startTimeSeconds = startTime.hour*60*60+startTime.minute*60+ startTime.second;
		let endTimeSeconds = startTime.hour*60*60+startTime.minute*60+ startTime.second;
		/**** 
		let endTimeSeconds = 
		if (startTime.hour > endTime.hour) {
			return true;
		}
		if (startTime.hour == endTime.hour) {
			if (startTime.minute > endTime.minute) {
				return true
			}
		}
		****/
		if (startTimeSeconds < endTimeSeconds) {
			return true;
		}
		else {
			return false;
		}
	}
});

// A set of Limitations as applied to each
// user of a website.
const LimitedSchema = new Schema({
	byGoodLoginAttempts: {
		type: Number
	},
	byTimeOfDay: {
		type: [ TimeRangeSchema]
	},
	byDayOfWeek: {
		type: [ String ]
	},
	byTimeTotal: {
		type: Number
	},
	byNumberFilesToUpload: {
		type: Number
	},
	byBadLoginAttempts: {
		type: Number
	},
	bySizeOfImageUpload: {
		[Number, Number]
	}
});

let colName = "limitsCOL";
const Rooms = mongoose.model('LimitedCol', LimitedSchema, colName);
return Rooms;
}

exports.produceLimited = produceLimited;
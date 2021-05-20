// INPROGRESS - 2021-05-20
//STA1
const mongoose = require('mongoose');
const util = require('../util');
const console_log = util.console_log;

let Time = null;
let TimeRange = null;
let Limited = null

function produceLimitedusage() {
let i=process.env.I;
let j=process.env.J;

let uri = util.uri();

function onMError(err) {
	console_log("onMError:err="+err);
}

console_log("mongoose.connect::prior");
mongoose.connect
(uri, {useNewUrlParser: true, useUnifiedTopology: true}).catch((err)=>{onMError(err);});

const Schema = mongoose.Schema;


const TimeRangeSchema = new Schema({
	/// startTime: TimeSchema,
	/// endTime: TimeSchema,
	startTime: Time.schema,
	endTime: Time.schema
	/***
	requirednotused: function() {
		let startTimeSeconds = startTime.hour*60*60+startTime.minute*60+ startTime.second;
		let endTimeSeconds = startTime.hour*60*60+startTime.minute*60+ startTime.second;
	
		if (startTimeSeconds < endTimeSeconds) {
			return true;
		}
		else {
			return false;
		}
	}
	***/
});

if (TimeRange == null){
	let colName = 'timeRangeCOL';
	TimeRange = mongoose.model('TimeRangeCol', TimeRangeSchema, colName);
}

// A set of Limitations as applied to each
// user of a website.
const LimitedSchema = new Schema({
	byGoodLoginAttempts: {
		type: Number
	},
	byTimeOfDay: {
		// type: [ TimeRangeSchema]
		// type: TimeRangeSchema,
		type: TimeRange.schema,
		default: ()=>({timeStart:{hour:11, minute:22,second:44}, timeEnd: {hour:11,minute:24,second:33}}),
		required: function() {
///sta
		console_log('INSIDE REQUIRED');
		return true;
		console_log('... byTimeOfDay='+JSON.stringify(this.byTimeOfDay));
		console_log('... this= '+JSON.stringify(this));
		console_log('... this._id='+JSON.stringify(this._id));
		let startTimeSeconds = this.byTimeOfDay.startTime.hour*60*60+this.byTimeOfDay.startTime.minute*60+ this.byTimeOfDay.startTime.second;
		let endTimeSeconds = this.byTimeOfDay.startTime.hour*60*60+this.byTimeOfDay.startTime.minute*60+ this.byTimeOfDay.startTime.second;
		console_log("startTimeSeconds="+startTimeSeconds);
		console_log("endTimeSeconds="+endTimeSeconds);
		if (startTimeSeconds < endTimeSeconds) {
			return true;
		}
		else {
			return false;
		}
		}
///end
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
		type: [Number, Number]
	}
});

/***
 * DOCUMENTATION FOR Schema
 * 
 * byGoodLoginAttempts: the number of login attempts that
 * are allowed to succeed, after which the user will not
 * have access to the website.  This setting is for limiting
 * the number of times the user can use the protected areas
 * of the website.
 * 
 * This setting can be mixed with other settings.
 * 
 * A value of 0 means that the user has no allowed login attempts
 * that were successful.  The user may supply correct user/pass,
 * but a setting of 0 will stop them.
 * 
 * Indicating infinite can be done by specifying -1.
 * 
 * byTimeOfDay: indicates when one or more pages, or the entire
 * website in general, can be accessed.  Time outside of these can 
 * be considered blackout times.
 * 
 * Basically an array of TimeRangeSchema can be specified.
 * @todo Local etc and GMT considerations have to be handled.
 */

let colName = "limitsCOL";
if (Limited == null){
	Limited = mongoose.model('LimitedCol', LimitedSchema, colName);
}
return Limited;
}

exports.produceLimited = produceLimited;
//END1
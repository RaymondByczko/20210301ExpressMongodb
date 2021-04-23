/*
	This is a model for the 'limited' class of
	data, that helps manage user interaction with
	a website.  For example, a user can be limited by the
	number of good login attempts, allowing part
	functionality of a website.

  This module was inspired by the need to need to demo portal type
	websites, by giving someone a limited account for evaluation
	purposes.  Although such a user might register themselves, it 
	is also possible to hand them a sample account.
  Such a sample account would be limited so as to decrease security
	risk.

	Resource limitation comes immediately to mind.  They can only
	upload a certain number of files for a total accumulated size,
	for example.  Or they can only login say 5 times.

	Limitation can be a very granular subject.  Outright removing the
	account is one possibility.  But it requires more manual intervention.
	This module hopes to address some of that granular aspect.

  To do this, this can be seen as middleware.
	Middleware functionality that can be attached to one or more
	routes are possible.  
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
const Rooms = mongoose.model('LimitedCol', LimitedSchema, colName);
return Rooms;
}

exports.produceLimited = produceLimited;
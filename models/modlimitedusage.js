/*
 * This produces a mongoose Model from a schema that
 * is for something called 'Limitedusage'.  This is a
 * collection that serves to gather stats on Limited properties, so that
 * a possible limitation can be determined.
 * and then applied.
 * 
 * Basically usage stats are kept in This
 * collection.  The stats are kept per user.
 * 
 * The user is not indicated in the limitedusageCOL.
 * The connecting of a user with their stat is done
 * via a third intermediate collection. (Some SQL
 * RDBMS applied to nosql databases.)
 * 
 * 
 */

const mongoose = require('mongoose');
const util = require('../util');
const console_log = util.produce_console_log("modlimitedusage.js");

let Limitedusage = null

// @todo capitalize u in Usage (name change).
function produceLimitedusage() {
	console_log("modlimitedusage.js:produceLimitedusage:start");
	// let i = process.env.I;
	// let j = process.env.J;

	let uri = util.uri();

	function onMError(err) {
		console_log("modlimitedusage.js:onMError:err=" + err);
	}

	console_log("mongoose.connect::prior");
	mongoose.connect
		(uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => { onMError(err); });

	const Schema = mongoose.Schema;


	// A subset of Limitations as usage stats kept
	// for each user of a website.
	const LimitedusageSchema = new Schema({
		byGoodLoginAttempts: {
			type: Number
		},
		byTimeTotal: {
			type: Number
		},
		byNumberFilesToUpload: {
			type: Number
		},
		byBadLoginAttempts: {
			type: Number
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
	 */

	// collection Name (colName)
	let colName = "limitedusageCOL";
	if (Limitedusage == null) {
		Limitedusage = mongoose.model('LimitedUsageCol', LimitedusageSchema, colName);
	}
	return Limitedusage;
}

exports.produceLimitedusage = produceLimitedusage;
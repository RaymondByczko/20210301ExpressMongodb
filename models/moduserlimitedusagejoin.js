/*
 * Provide a function to produce a limitedusage-user join collection.  Each
 * document of which will contain an id
 * from the limitedusage collection and an id
 * from the user collection.
 */
/// STA1
const mongoose = require('mongoose');
const util = require('../util');
const console_log = util.produce_console_log("moduserlimitedusagejoin.js");

let UserLimitedUsageJoin = null;

function produceUserLimitedUsageJoin() {

	let uri = util.uri();
	// console.log('uri='+uri);
	// uri();

	function onMError(err) {
		console_log("onMError:err=" + err);
	}

	console_log("mongoose.connect::prior");
	mongoose.connect
		(uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => { onMError(err); });

	const Schema = mongoose.Schema;

	const UserLimitedUsageJoinSchema = new Schema({
		user: {
			type: String
		},
		limitedUsage: {
			type: String
		}
	});

	if (UserLimitedUsageJoin == null) {
		let colName = "userlimitedusagejoinCOL";
		UserLimitedUsageJoin = mongoose.model('UserLimitedusagejoinCol', UserLimitedUsageJoinSchema, colName);
	}
	return UserLimitedUsageJoin;
}

exports.produceUserLimitedUsageJoin = produceUserLimitedUsageJoin;
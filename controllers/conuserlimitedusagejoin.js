/*
 * Provides a controller set of functionality to manipulate the UserLimitedUsageJoin collection.
 * Posting (that is adding) is the first function to add to this controller set.
 */

const console_log = require("../util").produce_console_log("conuserlimitedusagejoin.js");

const produceUserLimitedUsageJoin = require("../models/moduserlimitedusagejoin").produceUserLimitedUsageJoin;

/*
 * This posts (or adds) a document into the
 * UserLimitedUsageJoin collection.
 * @todo consider changing the name
 * to utilize 'add' instead of 'post'.
 *
 * @todo Change signature to include
 * just document object to be added.
 * req and res not need.
 */

async function postUserLimitedUsageJoin(userLimitedUsageDoc) {
	console_log("postUserLimitedUsageJoin: start");
	let UserLimitedUsageJoin = produceUserLimitedUsageJoin();
	if (false) {
		let newULUJ = new UserLimitedUsageJoin(req.body);
		newULUJ.save((err, uluj) => {
			if (err) {
				console_log("postUserLimitedUsageJoin:err");
				res.send(err);
			}
			else {
				console_log("postUserLimitedUsageJoin:noerr");
				res.json(uluj);
			}
		})
	}
	let joinRet = await UserLimitedUsageJoin.create(userLimitedUsageDoc);
}

exports.postUserLimitedUsageJoin = postUserLimitedUsageJoin;
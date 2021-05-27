const produceLimitedUsage  = require('../models/modlimitedusage').produceLimitedUsage;

const console_log = require('../util').produce_console_log("conlimitedusage.js");

/*
 * Adds a document to a limited usage collection.
 * Certain properties are required in req.body.
 * Check required body properties below in code.
 * 
 * sendResponse: boolean indicating whether to actually 
 * send the resonse, or just return saved document todo
 * calling code.
 */
async function addLimitedUsage(req, res, sendResponse) {
	console_log("conlimitedusage.js:addLimitedUsage:start");
	let LimitedUsage = produceLimitedUsage();

	// Required request body properties.
  // @todo possible refactor with modlimitedusage.js
  // @todo possibly refactor by centralizing schema objects somewhere.
	console_log("... req.body.byGoodLoginAttempts="+req.body.byGoodLoginAttempts);
	console_log("... req.body.byTimeTotal="+req.body.byTimeTotal);
	console_log("... req.body.byNumberFilesToUpload="+req.body.byNumberFilesToUpload);
  console_log("... req.body.byBadLoginAttempts="+req.body.byBadLoginAttempts);


	let newLU = new LimitedUsage(req.body);
	newLU.save((err, limitedusage)=>{
		if (err) {
			console_log("... addLimitedUsage:err");
			if (sendResponse) {
				res.send(err);
			}
			else {
				return err;
			}
		}
		else {
			console_log("... addLimitedUsage:noerr");
			if (sendResponse) {
				res.json(limitedusage);
			}
			else {
				return limitedusage;
			}
		}
	})
};

exports.addLimitedUsage = addLimitedUsage;
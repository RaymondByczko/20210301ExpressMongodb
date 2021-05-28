const produceLimitedUsage = require('../models/modlimitedusage').produceLimitedUsage;

const console_log = require('../util').produce_console_log("conlimitedusage.js");

/*
 * Adds a document to a limited usage collection.
 * Certain properties are required in req.body.
 * Check required body properties below in code.
 * 
 * sendResponse: boolean indicating whether to actually 
 * send the resonse, or just return saved document todo
 * calling code.
 * 
 * Update doc: This function may not require direct access to request and response
 * for route handlers.  Accordingly the
 * signature of this function is being changed.
 * 
 * @todo allow for throwing exception.
 */
async function addLimitedUsage(docToAdd) {
	console_log("conlimitedusage.js:addLimitedUsage:start");
	let LimitedUsage = produceLimitedUsage();

	// Required request body properties.
	// @todo possible refactor with modlimitedusage.js
	// @todo possibly refactor by centralizing schema objects somewhere.
	if (true) {
		console_log("... docToAdd.byGoodLoginAttempts=" + docToAdd.byGoodLoginAttempts);
		console_log("... docToAdd.byTimeTotal=" + docToAdd.byTimeTotal);
		console_log("... docToAdd.byNumberFilesToUpload=" + docToAdd.byNumberFilesToUpload);
		console_log("... docToAdd.byBadLoginAttempts=" + docToAdd.byBadLoginAttempts);
	}

	if (false) {
		let newLU = new LimitedUsage(docToAdd);
		let retSave = null;
		newLU.save((err, limitedusage) => {
			if (err) {
				console_log("... addLimitedUsage:err");
				if (false) {
					if (sendResponse) {
						res.send(err);
					}
					else {
						return err;
					}
				}
				// @todo possibly throw exception here.
				// return err;
				retSave = err;
			}
			else {
				console_log("... addLimitedUsage:noerr");
				if (false) {
					if (sendResponse) {
						res.json(limitedusage);
					}
					else {
						console_log("... limitedusage=" + limitedusage);
						return limitedusage;
					}
				}
				console_log("...limitedusage=" + limitedusage);
				retSave = limitedusage;
			}
		});
		// return retSave;
	}
	let retCreate = await LimitedUsage.create(docToAdd);
	return retCreate;
};

exports.addLimitedUsage = addLimitedUsage;
const conlimiteduserjoin = require('../controllers/conlimiteduserjoin');
const conlimited = require('../controllers/conlimited');

const console_log = require('../util').produce_console_log("midlimited.js");

async function midlimited(req, res, next) {
		console_log('midlimited:START');
		console_log('... req.user = ' + req.user);
		let selectuser = req.user;
		let docs = await conlimiteduserjoin.getLimitedUserJoin(selectuser);
		// @todo Do something with docs and
		// allow request to proceed to next
		// middleware, or cancel.
		console_log('...docs='+docs);
		let selectlimited_id = docs[0].selectlimited;
		console_log('...selectlimited_id='+selectlimited_id);
		let limitDoc = await conlimited.getLimited(selectlimited_id);
		console_log('...limitDoc='+limitDoc);
		next();
}

exports.midlimited = midlimited;
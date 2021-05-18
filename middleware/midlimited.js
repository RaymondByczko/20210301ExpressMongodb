const conlimiteduserjoin = require('../controllers/conlimiteduserjoin');
const console_log = require('../util').console_log;

async function midlimited(req, res, next) {
		console_log('midlimited:START');
		console_log('... req.user = ' + req.user);
		let selectuser = req.user;
		let docs = await conlimiteduserjoin.getLimitedUserJoin(selectuser);
		// @todo Do something with docs and
		// allow request to proceed to next
		// middleware, or cancel.

		next();
}

exports.midlimited = midlimited;
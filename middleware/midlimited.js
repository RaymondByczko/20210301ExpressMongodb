const conlimiteduserjoin = require('../controllers/conlimiteduserjoin');

async function midlimited(req, res, next) {
		console.log('midlimited:START');
		console.log('... req.user = ' + req.user);
		let selectuser = req.user;
		let docs = await conlimiteduserjoin.getLimitedUserJoin(selectuser);
		// @todo Do something with docs and
		// allow request to proceed to next
		// middleware, or cancel.

		next();
}

exports.midlimited = midlimited;
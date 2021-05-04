function midlimited(req, res, next) {
		console.log('midlimited:START');
		console.log('... req.user = ' + req.user);
		next();
}

exports.midlimited = midlimited;
/*
 * This does a type of export you might
 * say, to get access to conlimiteduserjoin.getUserAll.
 * This is intended to be a source file
 * for browserify, and it will be bundled.
 * (Hence its name.)
 */

const conlimiteduserjoin = require("./controllers/conlimiteduserjoin");

async function getUserAll() {
	return await conlimiteduserjoin.getUserAll(null, null);
}

exports.getUserAll = getUserAll;
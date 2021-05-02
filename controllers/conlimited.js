/*
 * This is a controller invoked by the route call back.
 * It provides the major function,
 * addLimited, that is invoked by
 * that callback.  Basically, a Limited document is added to the Limited collection.
 * Here is how it works.
 * 
 * When produceLimited is invoked, the
 * Limited model is returned.  That
 * model is used to add a Limited document
 * to a collection.  To see what is
 * stored in a Limited document, see
 * models/modlimited.
 */
const produceLimited  = require('../models/modlimited').produceLimited;
const bcryptjs = require('bcryptjs');

async function addLimited(req, res) {
	console.log("addLimited:start");
	console.log("... req.body="+req.body);
	console.log("... req.body(str)="+JSON.stringify(req.body));
	let Limited = produceLimited();
	// console.log("... req.body.name="+req.body.name);
	/*
	req.body = {
		byGoodLoginAttempts:22,
		active: true,
		byTimeOfDay: {
			startTime: {
				hour:22,
				minute:11,
				second:58
			},
			endTime: {
				hour:23,
				minute:12,
				second:33
			}
		},
		bytimetotal: "25"
	}
	*/
	/*
	req.body.byTimeOfDay = {
			startTime: {
				hour:02,
				minute:11,
				second:40
			},
			endTime: {
				hour:03,
				minute:12,
				second:42
			}
		};
		*/

	let newLimited = new Limited(req.body);
	newLimited.markModified("byTimeOfDay");
	newLimited.save((err, limited)=>{
		if (err) {
			console.log("addLImited:err");
			res.send(err);
		}
		else {
			console.log("addLimited:noerr");
			res.json(limited);
		}
	})
};

exports.addLimited = addLimited;
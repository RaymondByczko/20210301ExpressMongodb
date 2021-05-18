const console_log = require('../util').console_log;
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

async function addLimited(req, res) {
	console_log("addLimited:start");
	console_log("... req.body="+req.body);
	console_log("... req.body(str)="+JSON.stringify(req.body));
	let Limited = produceLimited();
	
	/*
	 * The following code fragement represents an interesting way
	 * to directly override the
	 * 'byTimeOfDay' part that will
	 * injected into the document.
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
			console_log("addLImited:err");
			res.send(err);
		}
		else {
			console_log("addLimited:noerr");
			res.json(limited);
		}
	})
};

exports.addLimited = addLimited;
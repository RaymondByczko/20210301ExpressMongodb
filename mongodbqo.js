let ObjectId = require('mongodb').ObjectId;
/*
A working set of query and options,
especially for findOne access of
mongodb.
*/
let working = function(){
	return {
		query:{},
		options:{}
	};
};

/*
A proposed query and options to find something greater.
 */
let onegreater = function(theId) {
	let oid = new ObjectId(theId);
	return {
		query: {
				_id: {$gte: oid}
		},
		options: {
			limit:1
		}
	}
};

let onelesser = function(theId) {
	let oid = new ObjectId(theId);
	return {
		query: {
				_id: {$lte: oid}
		},
		options: {
			limit:1
		}
	}
};

/*
A proposed query and options to find something greater.  This one kind of works but with
a count equal to 63.
 */
let manygreater = function(theId) {
	let oid = new ObjectId(theId);
	return {
		query: {
				_id: {$gte: oid}
		},
		options: {

		}
	}
};

let onewithid = function(theId) {
	let oid = new ObjectId(theId);
	return {
		query: {
				_id: oid
		},
		options: {

		}
	}
};

let onewithuser = function(name) {
	return {
		query: {
			name: {$eq: name}
		},
		options: {

		}
	}
}

exports.working=working;
exports.onegreater=onegreater;
exports.onelesser=onelesser;
exports.onewithid=onewithid;
exports.onewithuser=onewithuser;
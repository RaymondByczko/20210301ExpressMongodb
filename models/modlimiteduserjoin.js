const mongoose = require('mongoose');
const util = require('../util');

let Limiteduserjoin = null;

function produceLimiteduserjoin() {

// let i=process.env.I;
// let j=process.env.J;
// let uri = "mongodb+srv://"+i+":" + j+"@cluster0.c2u9s.mongodb.net/houseDB?retryWrites=true&w=majority";

let uri = util.uri();
// console.log('uri='+uri);
// uri();

function onMError(err) {
	console.log("onMError:err="+err);
}

console.log("mongoose.connect::prior");
mongoose.connect
(uri, {useNewUrlParser: true, useUnifiedTopology: true}).catch((err)=>{onMError(err);});

const Schema = mongoose.Schema;

const LimiteduserjoinSchema = new Schema({
	selectlimited: {
		type: String
	},
	selectuser: {
		type: String
	}
});

if (Limiteduserjoin == null) {
	let colName = "limiteduserjoinCOL";
	Limiteduserjoin = mongoose.model('LimiteduserjoinCol', LimiteduserjoinSchema, colName);
}

return Limiteduserjoin;
}

exports.produceLimiteduserjoin = produceLimiteduserjoin;
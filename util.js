
function uri(){
	let i=process.env.I;
	let j=process.env.J;
	// let i=null;
	// let j=null;
	let uri = "mongodb+srv://"+i+":" + j+"@cluster0.c2u9s.mongodb.net/houseDB?retryWrites=true&w=majority";
	return uri;
}

function lookfor(prop1, after) {
	return (req,res,next)=>{
		console.log(after)
		if (req[prop1]){
			console.log("... " + prop1 + " exists");
		}
		else {
			console.log("... " + prop1 + " does not exist");
		}
		next();
	};
}

exports.uri = uri;
exports.lookfor = lookfor;
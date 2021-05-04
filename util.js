
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

/*
 * Given a document retrieved from the Users collection,
 * this function constructs and populates 
 * a HTML select.
 * 
 * usersResponse is the json returned from the fetch
 * of a get url.
 * 
 * id is the DOM id associated with the select element.
 * 
 * The value of each select option is the id of the document.
 * 
 * @todo Consider that the length of usersResp can be
 * quite substantial
 */
function populateUserSelect(usersResp, id) {
	let select = document.createElement("select");
	select.setAttribute('id', id);
	for (let i=0; i<userResp.length; i++) {
		let option =  document.createElement("option");
		option.value = usersResp[i]._id;
		option.text = usersResponse[i].name +
			usersResponse[i].id;
		select.appendChild(option);
	}
}

exports.uri = uri;
exports.lookfor = lookfor;
exports.populateUserSelect = populateUserSelect;

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
 * parentId is the id of the parent in which The
 * formed select is appended to.
 * 
 * @todo Consider that the length of usersResp can be
 * quite substantial
 */
function populateUserSelect(usersResp, id, parentId) {
	let select = document.createElement("select");
	select.setAttribute('id', id);
	for (let i=0; i<usersResp.length; i++) {
		if ((usersResp[i]._id != undefined) && (usersResp[i].name != undefined)){
			let option =  document.createElement("option");
			option.value = usersResp[i]._id;
			option.text = usersResp[i].name +
			usersResp[i]._id;
			select.appendChild(option);
		}
	}
	document.querySelector('#'+parentId).appendChild(select);
}

function bodyonload() {
	alert('bodyloaded');
	fetch('/userall',{method:'GET'}).
		then(resp=>{
			alert('...rr='+JSON.stringify(resp)); return resp;
		}).
		then(response=>response.json()).
		then(resp=>{
			alert('...r='+JSON.stringify(resp)); return resp;
			}).
		then(data=>{
			populateUserSelect(data, 'id_selectuser', 'id_selectuser_parent');
			}).
		catch(error=>alert('caught error='+error));
}

exports.uri = uri;
exports.lookfor = lookfor;
exports.populateUserSelect = populateUserSelect;
exports.bodyonload = bodyonload;
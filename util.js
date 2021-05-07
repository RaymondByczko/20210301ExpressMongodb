
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

/*
 * Populate (and generate) the select html element with data from the limited
 * collection.  The data is from limitedResp.  This is a json collection delivered probably from a controller which
 * gets it in a route handler.
 * 
 * The id of the generated select element is specified by id.  The parent element in which the select element is put
 * into is given by parentId.
 */
function populateLimitedSelect(limitedResp, id, parentId) {
		let select = document.createElement("select");
	select.setAttribute('id', id);
	for (let i=0; i<limitedResp.length; i++) {
		if ((limitedResp[i]._id != undefined) && (limitedResp[i].name != undefined)){
			let option =  document.createElement("option");
			option.value = limitedResp[i]._id;
			option.text = limitedResp[i].name +
			limitedResp[i]._id;
			select.appendChild(option);
		}
	}
	document.querySelector('#'+parentId).appendChild(select);
}

/*
 * This is an event handler used for the body tag
 * in views/limiteduserjoin.pug.  Its purpose
 * is to basically create and populate two select
 * elements.
 * 
 * @todo At this point, the code works. But it can be
 * named better.  Further, the ids and parent ids related
 * to the previously mentioned selects are hardcoded
 * inside the funnction definition.  It would better
 * to parameterize these.
 */
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
			// @todo The following is hardcoded.  It should
			// be a parameter.
			populateUserSelect(data, 'id_selectuser', 'id_selectuser_parent');
			}).
		catch(error=>alert('caught error='+error));

		fetch('/limitedall',{method:'GET'}).
		then(resp=>{
			alert('...rr='+JSON.stringify(resp)); return resp;
		}).
		then(response=>response.json()).
		then(resp=>{
			alert('...r='+JSON.stringify(resp)); return resp;
			}).
		then(data=>{
			// @todo The following is hardcoded.  It should
			// be a parameter.
			populateLimitedSelect(data, 'id_selectlimited', 'id_selectlimited_parent');
			}).
		catch(error=>alert('caught error='+error));
}

exports.uri = uri;
exports.lookfor = lookfor;
exports.populateUserSelect = populateUserSelect;
exports.bodyonload = bodyonload;
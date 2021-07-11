/*
 * A collection of utility functions, for debugging (console_log,
 * notice the underscore) and other misc purposes.  This is slightly
 * a catch all area for holding functions.
 * REVISION HISTORY
 * 2021-07-09, RByczko, Added this file documentation header.
 * Removed exports at end, since this is for commonjs, and this
 * will be a universal base for commonjs and ecmascript modules.
 * Note this file was originally copied from util.js.
 */
function console_log(x){
	let clog=process.env.CLOG;
	let bclog = (clog=="true")?true:false;
	if (bclog) {
		console.log(x);
	} else {
		const noop=()=>{};
		noop();
	}
}
// Implementing a closure.  produce_console_log
// returns a function that mostly acts like
// console.log, except when it is desired to
// be a noop.
//
// Part of the implementation of acting
// like a proxy for console.log or noop, is
// to allow specification where this is valid.
// It will be allowed for some source files and
// not others.
//
// Part of the enable/disable console.log
// is to specify the current script in
// produce_console_log.
//
// Then, in a certain environment variable,
// that is CONSOLELOGENABLED, each and every
// script basename is specified, if it is
// to be enabled.  If it is not enabled, it is
// omitted.
//
// The script basenames are colon seperated.
//
// All specified scriptnames can be disabled,
// regarding console.log, and a noop will be
// used, if CLOG is specified as "true" (string).
//
function produce_console_log(scriptName) {
	let currentScript = scriptName;

	function console_log(x){
		let clog=process.env.CLOG;
		let bclog = (clog=="true")?true:false;

		let enabled = false;
		let enabledScripts = process.env.CONSOLELOGENABLED;
		let arrayES = enabledScripts.split(':');
		// console.log('arrayES='+arrayES);
		// console.log('currentScript='+currentScript);
		let indexFound = arrayES.indexOf(currentScript);
		// console.log('enabled='+enabled);
		if (indexFound != -1) {
			enabled = true;
		}
		// console.log('enabled2='+enabled);

		if (bclog && enabled) {
			console.log('FULLENABLED');
			console.log(x);
		} else {
			console.log('NOTFULLENABLED');
			const noop=()=>{};
			noop();
		}
	}
	return console_log;
}

function uri(){
	let i=process.env.I;
	let j=process.env.J;
	// let i=null;
	// let j=null;
	let uriValue = "mongodb+srv://"+i+":" + j+"@cluster0.c2u9s.mongodb.net/houseDB?retryWrites=true&w=majority";
	return uriValue;
}

function lookfor(prop1, after) {
	return (req,res,next)=>{
		console_log(after)
		if (req[prop1]){
			console_log("... " + prop1 + " exists");
		}
		else {
			console_log("... " + prop1 + " does not exist");
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
function populateUserSelect(usersResp, id, parentId, name) {
	let select = document.createElement("select");
	select.setAttribute('id', id);
	select.setAttribute('name', name);
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
function populateLimitedSelect(limitedResp, id, parentId, name) {
		let select = document.createElement("select");
	select.setAttribute('id', id);
	select.setAttribute('name',name);
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
			populateUserSelect(data, 'id_selectuser', 'id_selectuser_parent',
			'selectuser');
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
			populateLimitedSelect(data, 'id_selectlimited', 'id_selectlimited_parent',
			'selectlimited');
			}).
		catch(error=>alert('caught error='+error));
}

function userdelete_testoptions() {
	alert("userdelete_testoptions:start");
	let option1 = document.createElement('option');
	option1.text = "TurkeyBurgerA";
	option1.value = "12345678";
	document.querySelector('#id_select').add(option1);
	let option2 = document.createElement('option');
	option2.text = "TurkerBurgerB";
	option2.value = "56789999";
	document.querySelector('#id_select').add(option2);
	console.log("userdelete_testoption:end");
}
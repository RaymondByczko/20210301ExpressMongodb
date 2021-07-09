/*
 * Implements various fetch API calls for several operations.
 * These operations include a) delete based on user_id b) getting
 * all user documents.
 *
 * This is the base for fetch operations.  It needs to be adjusted
 * for the module approach required.  This could be ecmascript (which
 * is used by the javascript world via import) or commonjs (which
 * is used by node, via require).  See prerun under scripts in
 * package.json.  Basically cat fetch_base.js with fetch_ending_*.js
 * to obtain what is needed. '*' is either commonjs or ecmascriptmodule.
 *
 * A helper is supplied for fetchDelete, that is supplied
 * to it by client code.  If something is not correct,
 * via the checking it implements, it will do something
 * (exception, logging).  That helper is validateDelete.
 *
 * Another helper is provided for debugging.  It is:
 * alertFetchResponse.
 */
/* Revision History
 * 2021-06-29, RByczko, Added file documentation. Adjusted interface
 * for fetchDelete.  Added a number of alerts for debugging. Adjusted
 * interface for alertFetchResponse.
 * 2021-07-09, RByczko, Added function idInUserAll.
 */
async function fetchDelete(users_id, validateDelete) {
    debugger;
		alert("fetchDelete: start");
		alert("... users_id="+users_id);
    try {
        let url = '/users';
        let data = {
            'users_id':users_id
        };
				// @todo put 'Accept' header of application/json.  This will
				// be consistent with res.status(200).json
				// of app.delete('users') (in index.js)
        let opt = {
            method: 'DELETE',
            headers: {
                // Headers implemented in /users DELETE route.
                'Content-Type':'application/json',
                'Accept': 'application/json',

                /// The following is experimentation only.
                // 'Content-Type': 'text/csv',
                // 'Content-Type': 'x-www-form-urlencoded'
                // 'Content-Type': 'application/pdf',
                // 'Accept': 'application/sql'
            },
            body: JSON.stringify(data)
        }
        let response = await fetch(url, opt);
        validateDelete(response);
        await alertFetchResponse(response);
        return response;
    } catch (e) {
        alert("fetchDelete caught");
        alert("... e.message="+e.message);
        alert("... e.stack="+e.stack);
        // @todo return bad status here.
    }
}


/*
 * A validation function for fetchDelete, to see
 * if status is good etc to proceed.  Otherwise,
 * throw exception. 
 */
async function validateDelete(response) {
    alert('validateDelete: start');
	let responseClone = response.clone();
	let body = await responseClone.json();
	alert('validateDelete: end');
}

async function fetchUserAll() {
    try {
        let url = '/userall';
        let data = {};
        let opt = {
            method: 'GET',
            headers: {
                'Accept':'application/json'
                //'Content-Type':'x-www-form-urlencoded'
            }
            // body: JSON.stringify(data)
        }
        let response = await fetch(url, opt);
        await alertFetchResponse(response, "fetchUserAll");
        // alert("retFetch="+retFetch);
        // alert("JS(retFetch)="+JSON.stringify(retFetch));
        return response;
    } catch (e) {
        alert("fetchUserAll caught");
    }
}
/*
 * Displays the response to fetch  with a bunch of
 * alerts.  Just an example of what can be done.
 *
 * The body of the the original response will be consumed,
 * via applying the json() method to it.
 * So we clone it, and use that, preserving this for the client
 * code of alertFetchResponse.
 */
async function alertFetchResponse(responseOriginal, firstAlert="",numberHeaders=5) {

    let response = responseOriginal.clone();
    alert("alertFetchResponse:start");
    alert(firstAlert);
    alert("response="+response);
    alert("response.headers="+response.headers);
    let i = 0;
    for (const pair of response.headers.entries()){
        alert("pair0, pair1="+pair[0]+":"+pair[1]);
        i++;
        if (i===numberHeaders) {
            break;
        }
    }
    alert("responseheaders end");
    alert("response.body="+response.body);
    let bd = await response.json();
    alert("response.json()="+JSON.stringify(bd));
    alert("response.status="+response.status);
    alert("JS(response)="+JSON.stringify(response));
}

/*
 * Checks to see if id is present in userAll.  id is the id of a document
 * in a mongodb collection.  userAll is an array of users.  This function
 * returns a boolean, true or false.
 * @todo This function may not belong here, however its second parameter
 * userAll is derived from the call to fetchUserAll.  fetchUserAll
 * is defined in this file, so because of the connection, idInUserAll
 * lives here.
 */
function idInUserAll(id, userAll) {
    alert("idInUserAll: start");
    let retValue = null;
    let produceForEachFunction = function(i){
        return function(u) {
            if (u._id === i) {
                retValue = true
            }
            else {
                retValue = false;
            }
        }
    }
    let forEachFunction = produceForEachFunction(id);
    userAll.forEach(forEachFunction);
    alert("... retValue="+retValue);
    alert("idInUserAll: end");
    return retValue;
}
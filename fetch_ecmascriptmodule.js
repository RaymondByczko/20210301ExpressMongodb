async function fetchDelete(users_id) {
    debugger;
		alert("fetchDelete: start");
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
								// Following is good
                // 'Content-Type':'application/json',
								// 'Content-Type': 'text/csv',
                //'Content-Type':'x-www-form-urlencoded'
								'Content-Type': 'application/pdf',

								// 'Accept': 'application/json'
								'Accept': 'application/sql'
            },
            // Following is correct
						body: JSON.stringify(data)
						// body: 'user_id, 4'
        }
        let response = await fetch(url, opt);
        await alertFetchResponse(response);
        return response;
    } catch (e) {
        alert("fetchDelete caught");
        // @todo return bad status here.
    }
}


/*
 * A validation function for fetchDelete, to see
 * if status is good etc to proceed.  Otherwise,
 * throw exception. 
 */
async function validateDelete(response) {
	let responseClone = response.clone();
	let body = await responseClone.json();
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
async function alertFetchResponse(responseOriginal, firstAlert="") {

    let response = responseOriginal.clone();
    alert("alertFetchResponse:start");
    alert(firstAlert);
    alert("response="+response);
    alert("response.headers="+response.headers);
    let i = 0;
    for (const pair of response.headers.entries()){
        alert("pair0, pair1="+pair[0]+":"+pair[1]);
        i++;
        if (i===5) {
            break;
        }
    }
    alert("response.body="+response.body);
    let bd = await response.json();
    alert("response.json()="+JSON.stringify(bd));
    alert("response.status="+response.status);
    alert("JS(response)="+JSON.stringify(response));
}// file: fetch_ecmascriptmodule.js
// purpose: This is the ending appended to a fetch_base.js
// to produce a ecmascript compliant module.  HTML files and the
// like will need these to incorporate these javascript functions.
export {fetchDelete, validateDelete, fetchUserAll, alertFetchResponse};
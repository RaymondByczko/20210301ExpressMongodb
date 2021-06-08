async function fetchDelete(users_id) {
    debugger;
    try {
        let url = '/users';
        let data = {
            'users_id':users_id
        };
        let opt = {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json'
                //'Content-Type':'x-www-form-urlencoded'
            },
            body: JSON.stringify(data)
        }
        let response = await fetch(url, opt);
        await alertFetchResponse(response);
        return response;
    } catch (e) {
        alert("fetchDelete caught");
        // @todo return bad status here.
    }
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
        let retFetch = await fetch(url, opt);
        alert("retFetch="+retFetch);
        alert("JS(retFetch)="+JSON.stringify(retFetch));
    } catch (e) {
        alert("fetchUserAll caught");
    }
}
/*
 * Displays the response to fetch  with a bunch of
 * alerts.  Just an example of what can be done.
 */
async function alertFetchResponse(response) {
    alert("alertFetchResponse:start");
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
}
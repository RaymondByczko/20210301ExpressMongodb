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
        let retFetch = await fetch(url, opt);
        alert("retFetch.response="+retFetch.response);
        alert("JS(retFetch)="+JSON.stringify(retFetch));
        return retFetch;
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
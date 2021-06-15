/*
 * The 200 response for the HTTP DELETE method
 * of the /users route, assuming a json response.
 * Hopefully this facilitates DRY (do not repeat
 * yourself) in this code base.
 */
function delete_users_200_json_response() {
    return {
        status:"success",
        origin:"app.delete /users",
        file: "index.js"
    };
}
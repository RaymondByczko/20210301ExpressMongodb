const modusers = require("./models/mosuder");
function produceUsersLimited() {
	let Users = modusers.produceUsers();
	Users.discriminator("UsersLimited", new mongoose.Schema({}));

}
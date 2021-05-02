/*
 * This file contains a controller that is
 * called for the route login (as a GET method).
 * There is not much to this controller.  It responds with rendering of a form allowing a person to login in.
 * 
 * The login route (as a POST method) will proces
 * that form.)
 */

function get_login(mongodbContact){
return (req, res)=>{
	console.log('... conlogin.get_login');
	/**
	if (req.session.user) {
	} else {
		req.session.user = 'donut';
	}
	**/
  res.render('login', {dbStatus: mongodbContact, title:'Express Mongo App',message:'Please login here'});
};
}

exports.get_login = get_login;

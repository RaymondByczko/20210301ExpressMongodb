function get_login(mongodbContact){
return (req, res)=>{
	console.log('... app.get');
	if (req.session.user) {
	} else {
		req.session.user = 'donut';
	}
  res.render('login', {dbStatus: mongodbContact, title:'Express Mongo App',message:'Please login here'});
};
}

exports.get_login = get_login;

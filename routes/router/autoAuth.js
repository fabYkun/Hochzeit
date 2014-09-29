module.exports = function(app, models)
{
	var mongoose = require("mongoose");
	var UserModel = models.users;

	app.use(function (req, res, next)
	{
		if (mongoose.connection.readyState == 0)
		{
			var err = new Error();

			err.status = 503;
			return (next(err));
		}
		next();
	});

	// set and unset the auth Cookie
	app.use(function (req, res, next){
		if (req.session && req.session.admin && req.session.admin.autoAuth)
			res.cookie("adminAutoAuth", req.session.admin.autoAuth, { maxAge: 900000, httpOnly: true });
		if (req.session && req.session.user && req.session.user.autoAuth)
			res.cookie("userAutoAuth", req.session.user.autoAuth, { maxAge: 900000, httpOnly: true });
		next();
	});

	// connect you if the authCookie is available
	app.use(function (req, res, next){
		if (req.session && !req.session.user && req.cookies.userAutoAuth)
		{
			var query = UserModel.UsersSchema.findOne({AuthCookie: req.cookies.userAutoAuth});
			query.exec(function(err, user)
			{
				if (user)
					req.session.user = user;
			});
		}
		if (req.session && !req.session.admin && req.cookies.adminAutoAuth)
		{
			var query = UserModel.AdminSchema.findOne({AuthCookie: req.cookies.adminAutoAuth});
			query.exec(function(err, admin)
			{
				if (admin)
					req.session.admin = true;
			});
		}
		next();
	});
}
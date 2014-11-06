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

	// connects you if the authCookie is available
	app.use(function (req, res, next){

		function searchAdmin(auth, callback)
		{
			var query;

			if (req.session && !req.session.admin && auth)
			{
				query = UserModel.AdminSchema.findOne({AuthCookie: auth});
				query.exec(function(err, admin)
				{
					if (err) console.error("TS: " + Date.now() + " - " + err);
					else if (admin) req.session.admin = {autoAuth: admin.AuthCookie};
					callback();
				});
			}
			else return (callback())
		}

		function searchUser(auth, callback)
		{
			var query;

			if (req.session && !req.session.user && auth)
			{
				query = UserModel.UsersSchema.findOne({AuthCookie: auth});
				query.exec(function(err, user)
				{
					if (err) console.error("TS: " + Date.now() + " - " + err);
					else if (user)
					{
						req.session.user =
						{
							authCookie:	user.AuthCookie,
							"pseudo":	user.Pseudo,
							room:		user.Room
						}
					}
					return (callback(req.cookies.adminAutoAuth, next));
				});
			}
			else return (callback(req.cookies.adminAutoAuth, next));
		}

		searchUser(req.cookies.userAutoAuth, searchAdmin);
	});
}
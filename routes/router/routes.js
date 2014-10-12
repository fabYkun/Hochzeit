module.exports = function(all)
{
	var app = all.app;

	// loading models

	var users = require(all.root + "/models/users")();
	var rooms = require(all.root + "/models/room")();
	var models = {"users": users, "rooms": rooms};

	// autoAuth
	require("./autoAuth")(app, models);

	// loading handlers

	var player = require(all.root + "/routes/handler/player")(all);
	var admin = require(all.root + "/routes/handler/admin")(all);
	var display = require(all.root + "/routes/handler/display")(all);

	// on set les listeners
	all.SessionSockets.on("connection", function (err, socket, session)
	{
		if (err)
			return (console.error("TS: " + Date.now() + " - " + err));
	});

	all.SessionSockets.on("connection", function (err, socket, session)
	{
		if (err)
			return (console.error("TS: " + Date.now() + " - " + err));
		for (var i = admin.sessionNeeded.length - 1; i >= 0; --i)
			admin.sessionNeeded[i](all, socket, session, models);
	});

	function adminIsSet(req, res, next)
	{
		var query = users.AdminSchema.findOne({});
		query.exec(function(err, user)
		{
			if (user)
				return (next());
			else
			{
				console.log("admin required, redirecting a guest to /setadmin");
				res.redirect("/setadmin");
			}
		});
	}

	function adminIsntSet(req, res, next)
	{
		var query = users.AdminSchema.findOne({});
		query.exec(function(err, user)
		{
			if (user)
				res.redirect("/admin");
			else
				next();
		});
	}

	function isAdmin(req, res, next)
	{
		if (req.session && req.session.admin)
			return (next());
		res.redirect("/");
	}

	function isUser(req, res, next)
	{
		if (req.session && req.session.user)
			return (next());
		res.redirect("/");
	}

	function setLanguage(req, res, next)
	{
		if (req.session && req.session.language == undefined)
			req.session.language = app.get("lang");
		next();
	}

	app.use(setLanguage);
	app.get("/", adminIsSet, player.regular);
	app.get("/admin", adminIsSet, admin.regular);
	app.get("/display", adminIsSet, display.regular);
	app.get("/setadmin", adminIsntSet, admin.new)
	require("./errors")(all);
};
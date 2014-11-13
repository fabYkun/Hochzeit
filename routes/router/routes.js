module.exports = function(all)
{
	var app = all.app;
	var mongoose = require("mongoose");

	// loading models

	var users = require(all.root + "/models/users")();
	var rooms = require(all.root + "/models/room")();
	var models = {"users": users, "rooms": rooms};

	// autoAuth
	require("./autoAuth")(app, models);

	// loading handlers
	var index = require(all.root + "/routes/handler/index")(all);
	var admin = require(all.root + "/routes/handler/admin")(all);
	var player = require(all.root + "/routes/handler/player")(all);
	var display = require(all.root + "/routes/handler/display")(all);

	// upload
	var upload = require(all.root + "/routes/handler/upload")(all, rooms);

	// on set les listeners
	all.SessionSockets.on("connection", function (err, socket, session)
	{
		if (err)
			return (console.error("TS: " + Date.now() + " - " + err));
	});

	all.SessionSockets.on("connection", function (err, socket, session)
	{
		var fxArray = [index, admin, player, display];
		var i = -1;
		var j;

		if (err) return (console.error("TS: " + Date.now() + " - " + err));
		require(all.root + "/models/admin")(all, socket, session, models);
		require(all.root + "/models/adminControl")(all, socket, session, models);
		require(all.root + "/models/roomAccess")(all, socket, session, models);
		require(all.root + "/models/player")(all, socket, session, models);
	});

	function adminIsSet(req, res, next)
	{
		var query = users.AdminSchema.findOne({});
		query.exec(function(err, user)
		{
			if (user) return (next());
			console.log("admin required, redirecting a guest to /setadmin");
			res.redirect("/setadmin");
		});
	}

	function adminIsntSet(req, res, next)
	{
		var query = users.AdminSchema.findOne({});
		query.exec(function(err, user)
		{
			if (!user) return (next());
			res.redirect("/admin");
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

	function bdd_fail(err, res)
	{
		var messages = {
			"en":	"An error occured",
			"fr":	"Une erreur est apparue",
			"de":	"Fehlermeldung"
		}
		console.error("TS: " + Date.now() + " - " + err);
		return (res.redirect("/"));
	}

	function verifyRoom(req, res, next)
	{
		var roomID = req.params.room || "";
		var query = rooms.RoomSchema.findOne({Identifer: roomID});

		query.exec(function(err, result)
		{
			if (err) return (bdd_fail(err, res));
			if (result) return (next());
			res.redirect("/");
		});
	}

	function setUser(req, res, next)
	{
		var randPseudo = ["Chewbacca", "Grotadmorv", "Derrick", "Julien Le Perse", "Gai Maito", "Pandakun", "Giga Puddy", "Sailor Moon", "Chtulhu", "Severus Snape"];
		var roomID = req.params.room ? req.params.room : "";
		var query = rooms.RoomSchema.findOne({Identifer: roomID});

		if (req.session.user && req.session.user.room == roomID) return (next());
		query.exec(function(err, result)
		{
			if (err || !result) return (bdd_fail(err || "Attempt to reach "+roomID+": room undefined", res));
			if (result.State != "Open") return (bdd_fail("Room is private", res));
			var attemps = 100;
			var pseudo;
			var i;

			while (--attemps > 0 && !pseudo)
			{
				pseudo = randPseudo[Math.floor(Math.random() * randPseudo.length)];
				i = -1;

				while (result.Players[++i] && pseudo)
					if (result.Players[i].pseudo == pseudo)
						pseudo = undefined;
			}

			if (attemps <= 0 || !pseudo) return (bdd_fail("Too many players", res));
			result.Players.push({
				"pseudo":	pseudo,
				points:		0,
				answers:	[]
			});
			result.save(function(err)
			{
				if (err) return (bdd_fail(err, res));
				var auth = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
				var tmpUser = new users.UsersSchema({
					Pseudo:		pseudo,
					Room:		roomID,
					AuthCookie:	auth
				});
				tmpUser.save(function(err)
				{
					if (err) return (bdd_fail(err, res));
					req.session.user = {
						autoAuth:	auth,
						"pseudo":	pseudo,
						room:		roomID
					};
					res.cookie("userAutoAuth", req.session.user.autoAuth, { maxAge: 900000, httpOnly: true });
					next();
				});
			});
		});
	}

	function isInRoom(req, res, next)
	{
		if (!req.session.user || !req.session.user.room || !req.session.user.pseudo) return (next());

		var query = rooms.RoomSchema.findOne({Identifer: req.session.user.room, State: "In Game"});
		query.exec(function(err, result)
		{
			if (err) return (bdd_fail(err));
			else if (result) return (res.redirect("/player/" + req.session.user.room));
			req.session.user = undefined;
			return (next());
		});
	}

	app.use(setLanguage);
	app.get("/", adminIsSet, isInRoom, index.regular);
	app.get("/admin/:room", adminIsSet, isAdmin, admin.room);
	app.get("/admin", adminIsSet, admin.regular);
	app.get("/player/:room", adminIsSet, verifyRoom, setUser, player.regular);
	app.get("/display/:room", adminIsSet, display.regular);
	app.get("/setadmin", adminIsntSet, admin.new);
	app.post("/upload", adminIsSet, upload.quest, admin.regular);
	require("./errors")(all);
};
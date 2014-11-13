module.exports = function(all, socket, session, models)
{
	var bcrypt = require(all.root + "/conf/bcrypt");
	var mongoose = require("mongoose");
	var users = models.users;

	function bdd_fail(err)
	{
		var messages = {
			"en":	"An error occured",
			"fr":	"Une erreur est apparue",
			"de":	"Fehlermeldung"
		}
		console.error("TS: " + Date.now() + " - " + err);
		socket.emit("err", [{error: true, message: ((session.language && messages[session.language]) ? messages[session.language] : "An error occured") + " (" + err + ")"}]);
	}

	socket.on("setnewadmin", function(pwd){ setNewAdmin(pwd) });
	socket.on("adminauth", function(pwd){ adminAuth(pwd) });
	socket.on("changeLang", function(newLanguage){
		session.language = newLanguage; // we trust it first and we'll fallback later if not supported
		session.save();
		socket.emit("changeLang");
	});

	function setNewAdmin(password)
	{
		var messages = {
			"en":	"New admin registered",
			"fr":	"Nouvel admin enregistré",
			"de":	"Neuer Admin"
		}

		if (!session) return;
		bcrypt.genSalt(10, function (err, salt){
			if (err) return (bdd_fail(err));
			bcrypt.hash(password, salt, null, function (err, hash){
				if (err)
					return (socket.emit("err"));

				var authCookie = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

				var newAdmin = new users.AdminSchema({
					Password: hash,
					AuthCookie: authCookie
				});
				newAdmin.save(function (err){
					if (err) return (bdd_fail(err));
					session.admin = {autoAuth: authCookie};
					session.save();
					return (socket.emit("success", [{message: ((session.language && messages[session.language]) ? messages[session.language] : "New admin registered")}]));
				});
			});
		});
	}

	function adminAuth(password)
	{
		var messages = {
			"en":	"Connexion successful",
			"fr":	"Connection réussie",
			"de":	"Erfolgreich Verbindung"
		}

		users.AdminSchema.findOne({}).exec(function(err, user)
		{
			if (!user) return (socket.emit("err"));
			bcrypt.compare(password, user.Password, function (err, res) {
				if (err || !res) return (bdd_fail());
				else
				{
					session.admin = {autoAuth: user.AuthCookie};
					session.save();
					return (socket.emit("success", [{message: ((session.language && messages[session.language]) ? messages[session.language] : "Connexion successful")}]));
				}
			});
		});
	}
}
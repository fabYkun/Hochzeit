module.exports = function(all, socket, session, models)
{
	var mongoose = require("mongoose");
	var users = models.users;

	require("./adminControl")(all, socket, session, models);
	socket.on("setnewadmin", function(pwd){ setNewAdmin(pwd) });
	socket.on("adminauth", function(pwd){ adminAuth(pwd) });
	socket.on("changeLang", function(newLanguage){
		session.language = newLanguage; // on vérifie dans les handlers si il existe ou pas
		session.save();
		socket.emit("changeLang");
	});

	function setNewAdmin(password)
	{
		var bcrypt = require(all.root + "/conf/bcrypt");
		bcrypt.genSalt(10, function (err, salt){
			if (err)
				return (socket.emit("err"));

			bcrypt.hash(password, salt, null, function (err, hash){
				if (err)
					return (socket.emit("err"));

				var Admin = mongoose.model("admin");
				var authCookie = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

				var newAdmin = new Admin({
					Password: hash,
					AuthCookie: authCookie
				});
				newAdmin.save(function (err){
					if (err || !session)
						return (socket.emit("err"));
					session.admin = {autoAuth: authCookie};
					session.save();
					return (socket.emit("success"));
				});
			});
		});
	}

	function adminAuth(password)
	{
		var bcrypt = require(all.root + "/conf/bcrypt");

		var query = users.AdminSchema.findOne({});
		query.exec(function(err, user)
		{
			if (user)
			{
				bcrypt.compare(password, user.Password, function (err, res) {

					if (err == true || res != true)
						return (socket.emit("err"));
					else
					{
						session.admin = {autoAuth: user.AuthCookie};
						session.save();
						return (socket.emit("success"));
					}
				});
			}
			else
				return (socket.emit("err"));
		});
	}
}
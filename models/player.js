module.exports = function(all, socket, session, models)
{
	var users = models.users;
	var rooms = models.rooms;

	function bdd_fail(err)
	{
		var messages = {
			"en":	"An error occured",
			"fr":	"Une erreur est apparue"
		}
		console.error("TS: " + Date.now() + " - " + err);
		socket.emit("err", [{error: true, message: ((session.language && messages[session.language]) ? messages[session.language] : "An error occured") + " (" + err + ")"}]);
	}

	socket.on("changePseudo", function(pseudo)
	{
		var failure = {
			"en":	"Pseudo already taken",
			"fr":	"Pseudo déjà pris"
		};
		var success = {
			"en":	"Pseudo changed",
			"fr":	"Pseudo changé"
		};

		if (!session.user || !session.user.pseudo || !session.user.room) return;
		var query = users.UsersSchema.findOne({Pseudo: pseudo, Room: session.user.room});
		query.exec(function(err, result)
		{
			if (err) return (bdd_fail(err));
			if (result) return (socket.emit("err", [{error: true, message: ((session.language && failure[session.language]) ? failure[session.language] : "Pseudo already taken")}]));
			query = users.UsersSchema.findOne({Pseudo: session.user.pseudo, Room: session.user.room});
			query.exec(function(err, result)
			{
				if (err || !result) return (bdd_fail(err || "Session expired"));
				result.Pseudo = pseudo;
				result.save(function(err)
				{
					if (err) return (bdd_fail(err));
					query = rooms.RoomSchema.findOne({Identifer: session.user.room});
					query.exec(function(err, result)
					{
						if (err || !result) return (bdd_fail(err || "Room expired"));
						var i = -1;
						while (result.Players[++i] && result.Players[i].pseudo != session.user.pseudo);
						if (result.Players[i] && result.Players[i].pseudo == session.user.pseudo)
							result.Players[i].pseudo = pseudo;
						else
							return (bdd_fail("You've been banned"));
						result.save(function(err)
						{
							if (err) return (bdd_fail(err));
							session.user.pseudo = pseudo;
							session.save();
							socket.to(session.user.room).emit("newPlayer", i, result.Players[i]);
							return (socket.emit("success", [{message: ((session.language && success[session.language]) ? success[session.language] : "Pseudo changed")}]));
						});
					});
				});
			});
		});
	});

	socket.on("sendAnswer", function(index, answer)
	{
		if (!session.user || !session.user.pseudo || !session.user.room) return;
		console.log(session.user.pseudo + ": " + answer);
		var query = rooms.RoomSchema.findOne({Identifer: session.user.room});
		query.exec(function(err, room)
		{
			if (err || !room) return (bdd_fail(err || "Room expired"));
			var i = -1;
			while (room.Players[++i].pseudo != session.user.pseudo);
			if (!room.Players[i]) return (bdd_fail(err || "You've been banned"));
			if (!room.Quest[index] || room.Players[i].answers.length > index) return (socket.emit("hasResponded"));
			room.Players[i].answers.push(answer);
			if (room.Quest[index].correctAnswer.indexOf(answer) >= 0)
				room.Players[i].points += room.Quest[index].points;
			room.save(function(err)
			{
				if (err) return (bdd_fail(err));
				socket.to(room.Identifer).emit("newAnswer", session.user.pseudo, answer, room.Players[i].points);
				socket.emit("hasResponded");
			});
		});
	});

	socket.on("buzzer", function()
	{
		if (!session.user || !session.user.pseudo || !session.user.room) return (bdd_fail("Session expired"));
		var query = rooms.RoomSchema.findOne({Identifer: session.user.room});
		query.exec(function(err, room)
		{
			if (err) return (bdd_fail(err));
			if (room.Buzzer) return;
			room.Buzzer = session.user.pseudo;
			room.save(function(err)
			{
				socket.to(session.user.room).emit("buzzer", session.user.pseudo);
				socket.emit("buzzer", session.user.pseudo);
			});
		});
	});
}
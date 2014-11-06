module.exports = function(all, socket, session, models)
{
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

	socket.on("getRooms", function(state)
	{
		var possibilities = ["Open", "In Game", "Closed"];
		var package = [];
		var tmp;
		var i = -1;
		var j;

		if (state && possibilities.indexOf(state) < 0) return ;
		var query = rooms.RoomSchema.find((state) ? {State: state} : {});
		query.exec(function(err, result)
		{
			if (err) return (bdd_fail(err));
			if (!result) return;
			while (result[++i])
			{
				tmp = {name: result[i].Name, url: result[i].Identifer, state: result[i].State, players: result[i].Players};
				j = -1;
				while (tmp.players[++i])
					tmp.players[i] = {
						pseudo: tmp.players[i].pseudo,
						points: tmp.players[i].points,
						answers: tmp.players[i].answers
					}
				package.push(tmp);
			}
			socket.emit("getRooms", package);
		});
	});

	socket.on("getRoom", function(roomID)
	{
		var failure = {
			"en":	"No room found",
			"fr":	"Room introuvable"
		};

		var query = rooms.RoomSchema.findOne({Identifer: roomID});
		query.exec(function(err, result)
		{
			if (err) return (bdd_fail(err));
			if (!result) return (socket.emit("err", [{error: true, message: ((session.language && failure[session.language]) ? failure[session.language] : "No room found")}]));
			socket.join(result.Identifer);
			socket.emit("getRoom",
				{
					name:		result.Name,
					languages:	result.Languages,
					identifer:	result.Identifer,
					quest:		result.Quest,
					index:		result.Index,
					players:	result.Players,
					state:		result.State,
					buzzer:		result.Buzzer,
					created:	result.Created
				});
		});
	});

	socket.on("getMyRoom", function()
	{
		var failure = {
			"en":	"No room found",
			"fr":	"Room introuvable"
		};
		var notConnected = {
			"en":	"Session expired",
			"fr":	"Session expirée"
		}

		if (!session.user || !session.user.room || !session.user.pseudo) return (socket.emit("err", [{error: true, message: ((session.language && notConnected[session.language]) ? notConnected[session.language] : "Session expired")}]));
		var query = rooms.RoomSchema.findOne({Identifer: session.user.room});
		query.exec(function(err, result)
		{
			var i = -1;
			if (err) return (bdd_fail(err));
			if (!result) return (socket.emit("err", [{error: true, message: ((session.language && failure[session.language]) ? failure[session.language] : "No room found")}]));
			socket.join(session.user.room);
			while (result.Players[++i].pseudo != session.user.pseudo);
			if (result.Players[i])
				socket.to(session.user.room).emit("newPlayer", i, result.Players[i]);
			socket.emit("getRoom",
				{
					name:		result.Name,
					languages:	result.Languages,
					identifer:	result.Identifer,
					quest:		result.Quest,
					index:		result.Index,
					players:	result.Players,
					state:		result.State,
					buzzer:		result.Buzzer,
					created:	result.Created
				});
		});
	});
}
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

	socket.on("getQuestionnaires", function()
	{
		var query = rooms.QuestSchema.find({});

		query.exec(function(err, quests)
		{
			var package = [];
			var i = -1;

			if (err) return (bdd_fail(err));
			if (quests)
			{
				while (quests[++i])
				{
					package.push({
						name: quests[i].Name,
						languages: quests[i].Languages,
						questions: quests[i].Data.length
					});
				}
				socket.emit("getQuestionnaires", package);
			}
		});
	});

	socket.on("deleteRoom", function(name)
	{
		var roomID;
		var messages = {
			fr: {
				roomDeleted:		"Session détruite",
				roomDoesntExist:	"Cette session n'existe pas"
			},
			en: {
				roomDeleted:		"Room destroyed",
				roomDoesntExist:	"This room doesn't exist"
			}
		};

		var query = rooms.RoomSchema.findOne({Name: name});
		query.exec(function(err, result){
			if (err) return (bdd_fail(err));
			if (!result)
				return (socket.emit("success", [{message: (session.language && messages[session.language]) ? messages[session.language].roomDoesntExist : "This room is already missing"}]));
			roomID = result.Identifer;
			result.remove();

			query = users.UsersSchema.remove({Room: roomID});
			query.exec(function(err){
				if (err) return (bdd_fail(err));
				return (socket.emit("deleteRoom", name));
			});
		});
	});

	socket.on("createRoom", function(data)
	{
		var query;
		var newRoom;
		var reg = /^[a-z A-Z0-9\[\]\(\)]+$/;
		var messages = {
			fr: {
				incorrectName:		"Le nom d'une session ne doit pas comporter d'autres signes que A-Za-z, 0-9, [] et ()",
				roomAlreadyExists:	"Une session comportant ce nom a déjà été crée",
				questDoesntExist:	"Le questionnaire associé n'existe pas",
				roomCreated:		"La session a été créee"
			},
			en: {
				incorrectName:		"Only A-Za-z, 0-9, [] and () symbols are allowed within a room's name",
				roomAlreadyExists:	"A room named this way has already been created",
				questDoesntExist:	"The assigned quest does not seem to exist",
				roomCreated:		"The room has been created"
			}
		}

		if (!data.name || !data.model) return;
		if (!reg.test(data.name))
			return (socket.emit("err", [{error: true, message: (session.language && messages[session.language]) ? messages[session.language].incorrectName : "Only A-Za-z, 0-9, [] and () symbols are allowed within a room's name"}]));
		
		var identifer = Math.random().toString(36).slice(-8);
		query = rooms.RoomSchema.findOne({$or: [{Name: data.name}, {Identifer: identifer}]});
		query.exec(function(err, result)
		{
			if (err) return (bdd_fail(err));
			if (result)
				return (socket.emit("err", [{
					error: true,
					message: (session.language && messages[session.language]) ? messages[session.language].roomAlreadyExists : "A room named this way has already been created"
				}]));
			query = rooms.QuestSchema.findOne({Name: data.model});
			query.exec(function(err, quest)
			{
				if (err) return (bdd_fail(err));
				if (!quest)
					return (socket.emit("err", [{
						error: true,
						message: (session.language && messages[session.language]) ? messages[session.language].questDoesntExist : "A room named this way has already been created"
					}]));
				newRoom = new rooms.RoomSchema({
					Name: data.name,
					Identifer: identifer,
					Languages: quest.Languages,
					Quest: quest.Data,
					Players: [],
					State: "Open"
				});
				newRoom.save(function(err) {
					if (err) return (bdd_fail(err));
					socket.emit("createRoom", {name: data.name, state: "Open", url: identifer});
					return (socket.emit("success", [{message: (session.language && messages[session.language]) ? messages[session.language].roomCreated : "The room has been created"}]));
				});
			});
		});
	});

	socket.on("roomChangeState", function(roomID)
	{
		var states = ["Open", "In Game", "Closed"];
		var index;

		var query = rooms.RoomSchema.findOne({Identifer: roomID});
		query.exec(function(err, result)
		{
			if (err) return (bdd_fail(err));
			if (!result) return ;
			index = states.indexOf(result.State) + 1;
			result.State = states[index] ? states[index] : result.State;
			result.save(function(err)
			{
				if (err) return (bdd_fail(err));
				socket.to(result.Identifer).emit("stateChanged", result.State);
				socket.emit("stateChanged", result.State);
			});
		});
	});

	function nextQuestion(roomID)
	{
		var query = rooms.RoomSchema.findOne({Identifer: roomID});
		query.exec(function(err, result)
		{
			if (err) return (bdd_fail(err));

			if (!result) return ;
			if (result.Quest[result.Index + 1])
			{
				var i = -1;
				while (result.Players[++i])
					if (!result.Players[i].answers[result.Index])
						result.Players[i].answers[result.Index] = "";
				++result.Index;
				result.Buzzer = "";
				result.save(function(err)
				{
					if (err) return (bdd_fail(err));
					socket.to(roomID).emit("buzzer", "");
					socket.emit("buzzer", "");
					socket.to(result.Identifer).emit("nextQuestion");
					socket.emit("nextQuestion");
				});
			}
		});
	}

	socket.on("nextQuestion", nextQuestion);
	socket.on("addPts", function(roomID, pseudo, points)
	{
		var query = rooms.RoomSchema.findOne({Identifer: roomID});
		query.exec(function(err, room)
		{
			if (err || !room) return (bdd_fail(err || "Room has expired"));
			var i = -1;

			while (room.Players[++i] && room.Players[i].pseudo != pseudo);
			if (!room.Players[i]) return (bdd_fail("Session has expired"));
			room.Players[i].points += points;
			room.Buzzer = undefined;
			room.save(function(err)
			{
				if (err) return (bdd_fail(err));
				return (nextQuestion(roomID));
			});
		});
	});

	socket.on("denyBuzzer", function(roomID)
	{
		var query = rooms.RoomSchema.findOne({Identifer: roomID});
		query.exec(function(err, room)
		{
			if (err || !room) return (bdd_fail(err || "Room has expired"));
			room.Buzzer = undefined;
			room.save(function(err)
			{
				if (err) return (bdd_fail(err));
				socket.to(roomID).emit("buzzer", "");
				socket.emit("buzzer", "");
			});
		});
	});
}
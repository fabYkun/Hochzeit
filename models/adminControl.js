module.exports = function(all, socket, session, models)
{
	var rooms = models.rooms;

	function bdd_fail(err)
	{
		var languages = {
			"en": "An error occured",
			"fr": "Une erreur est apparue"
		}
		console.error("TS: " + Date.now() + " - " + err);
		socket.emit("err", [{error: true, message: ((session.language && languages[session.language]) ? languages[session.language] : "An error occured") + ": " + err}]);
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

	socket.on("getRooms", function()
	{
		var i = -1;
		var package = [];
		var query = rooms.RoomSchema.find({});
		query.exec(function(err, result)
		{
			if (err) return (bdd_fail(err));
			if (!result) return;
			while (result[++i])
				package.push({name: result[i].Name, state: result[i].State});
			socket.emit("getRooms", package);
		});
	});

	socket.on("deleteRoom", function(name)
	{
		var messages = {
			fr: {
				roomDeleted: "Session détruite",
				roomDoesntExist: "Cette session n'existait déjà plus"
			},
			en: {
				roomDeleted: "Room destroyed",
				roomDoesntExist: "This room is already missing"
			}
		};
		var query = rooms.RoomSchema.findOne({Name: name});
		query.exec(function(err, result){
			if (err) return (bdd_fail(err));
			if (!result)
				return (socket.emit("success", [{message: (session.language && messages[session.language]) ? messages[session.language].roomDoesntExist : "This room is already missing"}]));
			result.remove();
			return (socket.emit("deleteRoom", name));
		});
	});

	socket.on("createRoom", function(data)
	{
		var query;
		var newRoom;
		var reg = /^[a-zA-Z0-9\[\]\(\)]+$/;
		var messages = {
			fr: {
				incorrectName: "Le nom d'une session ne doit pas comporter d'autres signes que A-Za-z, 0-9, [] et ()",
				roomAlreadyExists: "Une session comportant ce nom a déjà été crée",
				questDoesntExist: "Le questionnaire associé n'existe pas",
				roomCreated: "La session a été créee"
			},
			en: {
				incorrectName: "Only A-Za-z, 0-9, [] and () symbols are allowed within a room's name",
				roomAlreadyExists: "A room named this way has already been created",
				questDoesntExist: "The assigned quest does not seem to exist",
				roomCreated: "The room has been created"
			}
		}

		if (!data.name || !data.model) return;
		if (!reg.test(data.name))
			return (socket.emit("err", [{error: true, message: (session.language && messages[session.language]) ? messages[session.language].incorrectName : "Only A-Za-z, 0-9, [] and () symbols are allowed within a room's name"}]));
		query = rooms.RoomSchema.findOne({Name: data.name});
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
					Languages: quest.Languages,
					Quest: quest.Data,
					Players: [],
					State: "Open"
				});
				newRoom.save(function(err) {
					if (err) return (bdd_fail(err));
					socket.emit("createRoom", {name: data.name, state: "Open"});
					return (socket.emit("success", [{message: (session.language && messages[session.language]) ? messages[session.language].roomCreated : "The room has been created"}]));
				});
			});
		});
	});
}
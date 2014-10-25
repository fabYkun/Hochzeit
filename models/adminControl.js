module.exports = function(all, socket, session, models)
{
	var rooms = models.rooms;

	socket.on("getQuestionnaires", function()
		{
			var query = rooms.QuestSchema.find({});

			query.exec(function(err, quests)
			{
				console.log("couco")
				if (quests)
					socket.emit("getQuestionnaires", quests);
			});
		});

	socket.on("getRooms", function()
		{
			var query = rooms.RoomSchema.find({});
			query.exec(function(err, rooms)
			{
				if (rooms)
					socket.emit("getRooms", rooms);
			});
		});
}
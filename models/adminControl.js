module.exports = function(all, socket, session, models)
{
	var rooms = models.rooms;

	socket.on("gamesList", function()
		{
			var query = rooms.RoomSchema.find({});
			query.exec(function(err, rooms)
			{
				if (rooms)
					socket.emit(rooms);
			});
		});
}
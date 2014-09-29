module.exports = function()
{
	var module = {};
	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;

	/*
	** Songs is an array containing all the songs that must be played
	song {
		title:				String,
		author:				String,
		minInterval:		Number,	(min and max interval represent the begin and the end of the portion of the song that will be played, in seconds)
		maxInterval:		Number,
		points:				Number,
		found:				String (contain the name of the person that has found it, empty else)
	}

	** Rounds describe the progress of the game
	round {
		propositions:		Array[
			name:			String, (name of the person)
			guess:			String,
			isCorrect:		Boolean
		]
	}
	*/
	var RoomsSchema = new Schema({
		Name: String,
		Songs: [Object],
		Rounds: [Object],
		Created: {type: Date, default: Date.now}
	});

	module.RoomSchema = mongoose.model("rooms", RoomsSchema);
	return (module);
};
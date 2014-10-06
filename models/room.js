module.exports = function()
{
	var module = {};
	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;

	/*

	** --- Data ---
	**
	** Array containing all questions
	**
	-- Multiple Choice
	data = {
		title:				String,
		question:			String,
		answers:			[String],
		points:				Number,
		found:				[String]
	}
	-- Songs
	data = {
		title:				String,
		author:				String,
		minInterval:		Number,	(min and max interval represent the begin and the end of the portion of the song that will be played, in seconds)
		maxInterval:		Number,
		points:				Number,
		found:				String (contain the name of the person that has found it, empty else)
	}

	** Rounds describe the progress of the game
	round = {
		propositions:		Array[
			name:			String, (name of the person)
			guess:			String,
			isCorrect:		Boolean
		]
	}
	*/
	var RoomSchema = new Schema({
		Name: String,
		Data: [Object],
		Rounds: [Object],
		Created: {type: Date, default: Date.now}
	});

	module.RoomSchema = mongoose.model("rooms", RoomSchema);
	return (module);
};
module.exports = function()
{
	var module = {};
	var mongoose = require("mongoose");
	var Schema = mongoose.Schema;

	/*

	** --- Data ---
	**
	** Array containing all questions

	data = {
		languages:			[String] (["en", "fr", "de", "es"...]) languages.length is very important !
		question:			[String], here for exemple he'll receive the question question[languages.indexOf(hisLanguage)], if it's undefined he'll get question[0] by default
		media:				String, (pathname)
		points:				Number, (gained by the winner(s))
		time:				time in seconds given to answer the question (no time limit if set to 0)
		answers:			[String], (if empty the game will switch to buzzer-mode @@') to respect languages you must provide the same number of answers for each language, following the data.languages order
		correctAnswer:		[String] (it must match with one of the previous answers if any, otherwise the admin decides)
	}
	*/

	var QuestSchema = new Schema
	({
		Name:				String,
		Languages:			[String],
		Data:
		[{
			question:		[String],
			media:			String,
			points:			Number,
			time:			Number,
			answers:		[String],
			correctAnswer:	[String]
		}],
		Created:			{type: Date, default: Date.now}
	});

	var RoomSchema = new Schema
	({
		Name:				String,
		Languages:			[String],
		Identifer:			String,
		Quest:
		[{
			question:		[String],
			media:			String,
			points:			Number,
			time:			Number,
			answers:		[String],
			correctAnswer:	[String]
		}],
		Index:				{type: Number, default: 0}, 
		Players:
		[{
			pseudo:			String,
			points:			Number,
			answers:		[String]
		}],
		State:				String,
		Created:			{type: Date, default: Date.now}
	});

	module.QuestSchema = mongoose.model("quests", QuestSchema);
	module.RoomSchema = mongoose.model("rooms", RoomSchema);

	return (module);
};
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
		question:			[String], note: languages.length will be used to target each question for each language
		media:				String, (pathname)
		points:				Number, (gained by the winner(s))
		answers:			[String], (if empty the game will switch to buzzer-mode @@') note: languages.length will be used to target each answers for each language
		correctAnswer:		[String] (it must match with one of the previous answers if any, otherwise the admin decides) note: languages.length will be used again
	}
	*/

	var QuestSchema = new Schema
	({
		Name:				String,
		Data:
		[{
			languages:		[String],
			question:		[String],
			media:			String,
			points:			Number,
			answers:		[String],
			correctAnswer:	[String]
		}],
		Created:			{type: Date, default: Date.now}
	});

	var RoomSchema = new Schema
	({
		Name:				String,
		Quest:
		[{
			languages:		[String],
			question:		[String],
			media:			String,
			points:			Number,
			answers:		[String],
			correctAnswer:	[String]
		}],
		Players:			[Object],
		History:			[Object], // will retrace the run
		State:				{type: String, default: "Open"},
		Created:			{type: Date, default: Date.now}
	});

	module.RoomSchema = mongoose.model("rooms", RoomSchema);
	module.QuestSchema = mongoose.model("quests", QuestSchema);


	/*
	** TESTS

	var Room = module.RoomSchema;
	var Quest = module.QuestSchema;

	var questionnaire = [
		{
			question: ['Comment se termine la phrase philosophique: "Le ciel est "', 'Complete the philosophical sentence "The sky is "'],
			media: "",
			points: 4,
			answers: ["bleu", "pomme", "en haut", "essen-CIEL ahahaha", "blue", "apple", "up there", "I DON'T HAVE TIME TO FIND A JOKE"],
			correctAnswer: ["bleu", "blue"]
		},
		{
			question: ["Quel est le nom du groupe de cette chanson ?", "Which band did this song ?"],
			media: "babymetal.mp3",
			points: 8,
			answers: ["babymetal", "justin bieber"],
			correctAnswer: ["babymetal"]
		}
	];

	var newQuest = new Quest({
		Name:	"Test1",
		Data:	questionnaire
	});

	newQuest.save(function(err) { if (err) return (console.log(err)); });

	*/

	return (module);
};
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
			answers:		[String],
			correctAnswer:	[String]
		}],
		Created:			{type: Date, default: Date.now}
	});

	var RoomSchema = new Schema
	({
		Name:				String,
		Languages:			[String],
		Quest:
		[{
			question:		[String],
			media:			String,
			points:			Number,
			answers:		[String],
			correctAnswer:	[String]
		}],
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
		Languages: ["fr", "en"],
		Data:	questionnaire
	});

	newQuest.save(function(err) { if (err) return (console.log(err)); })
	*/

	return (module);
};
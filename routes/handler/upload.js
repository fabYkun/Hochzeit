module.exports = function(all, roomsModel)
{
	var mongoose = require("mongoose");
	var app = all.app;
	var module = {};

	module.quest = function(req, res, next)
	{
		var formidable = require("formidable");

		function error(err)
		{
			console.error("TS: " + Date.now() + " - " + err);
			next();
		}

		if (req.session.admin)
		{
			var form = new formidable.IncomingForm();
			var fs = require("fs");

			form.encoding = "utf-8";
			form.parse(req, function(err, fields, files) {
				var name, lang, file;
				if (err) return (error(err));

				name = fields.title;
				lang = fields.lang;
				file = files.upload;

				if (!name || !lang || !file)
					return (error("Missing data (name: " + name + ", lang: " + lang + "file: " + ((!file) ? (file) : ("OK")) + ")"));
				else if (file.name.split(".").pop().toLowerCase() != "json")
					return (error("File uploaded is not a .json"));

				fs.readFile(files.upload.path, "utf-8", function(err, data) {
					if (err) return (error(err));

					var quest, newQuest;
					var warning = 0;
					var medias = [];
					var i = -1;

					try { quest = JSON.parse(data); }
					catch (err) { return (error("Bad JSON syntax: " + err)); };

					fs.unlink(files.upload.path);
					console.log('\n -- New quest: "' + name + '" (' + lang + ")\n");
					lang = lang.replace(/ /g, "").split(",");
					while (quest[++i])
					{
						if (!quest[i].question || typeof quest[i].question != "object")
							return (error("At index " + i + ", questions are missing (" + quest[i].question + ")"));
						else if (quest[i].question.length < lang.length)
							console.log("Warning[" + warning++ + ']: Translation(s) for "' + quest[i].question[0] + '" are missing');

						if (quest[i].answers && typeof quest[i].answers != "object")
							return (error("Type error at index " + i + " (answers), expecting array"));
						if (quest[i].correctAnswer && typeof quest[i].correctAnswer != "object")
							return (error("Type error at index " + i + " (correctAnswer), expecting array"));

						quest[i] = {
							question: quest[i].question,
							media: quest[i].media || "",
							points: quest[i].points || 0,
							time: quest[i].time || 0,
							answers: quest[i].answers || [],
							correctAnswer: quest[i].correctAnswer || [],
						}
						if (quest[i].media) medias.push(quest[i].media);
					}

					function checkMedias(media, index)
					{
						fs.exists("/media/" + medias[index], function (exists) {
							if (!exists) console.log("Warning[" + warning++ + "]: " + medias[index] + " does not exist");
							if (media[++index]) return (checkMedias(media, index));
							return (console.log('\n - Warning found for "' + name + '": ' + warning + "\n\n"));
						});
					}

					if (medias.length > 0) checkMedias(medias, 0);
					else console.log('\n - Warning found: ' + warning + "\n\n");

					newQuest = new roomsModel.QuestSchema({
						Name:		name,
						Languages:	lang,
						Data:		quest
					});
					newQuest.save(function(err) { if (err) return (error(err)) })
				});
			});
		}
		next();
	}

	return (module);
}
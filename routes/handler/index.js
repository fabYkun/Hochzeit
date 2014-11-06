module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.regular = function(req, res)
	{
		var swig = {
			"fr": {
				main:		app.get("main"),
				title:		"Sélection d'un jeu en cours",
				rooms:		"Salles disponibles",
				views:		"Salles visibles",
				join:		"Rejoindre",
				lang:		"fr"
			},
			"en": {
				main:		app.get("main"),
				title:		"Current game selection",
				rooms:		"Rooms available",
				views:		"Salles visibles",
				join:		"Join",
				lang:		"en"
			}
		};

		res.render("index", swig[((req.session && req.session.language && swig[req.session.language]) ? req.session.language : app.get("lang"))]);
	}

	module.sessionNeeded = []; // listeners
	module.sessionNeeded.push(require(all.root + "/models/roomAccess"));

	return (module);
}
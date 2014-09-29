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
				lang:		"fr"
			},
			"en": {
				main:		app.get("main"),
				title:		"Current game selection",
				lang:		"en"
			}
		};

		res.render("index", swig[((req.session && req.session.language && swig[req.session.language]) ? req.session.language : app.get("lang"))]);
	}
	return (module);
}
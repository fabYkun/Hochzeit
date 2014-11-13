module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.regular = function(req, res)
	{
		if (!req.params.room || !req.session.user || !req.session.user.pseudo) return (res.redirect("/"));

		var swig = all.translations.translate(all.translations.handlers.player, req.session.language);
		swig.roomID = req.params.room ? req.params.room : "";
		swig.main = app.get("main");

		res.render("player", swig);
	}

	module.sessionNeeded = []; // listeners

	return (module);
}
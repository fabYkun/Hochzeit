module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.regular = function(req, res)
	{
		if (!req.params.room) return (res.redirect("/"));

		var swig = all.translations.translate(all.translations.handlers.display, req.session.language);
		swig.roomID = req.params.room ? req.params.room : "";
		res.render("display", swig);
	}
	return (module);
}
module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.regular = function(req, res)
	{
		var swig = all.translations.translate(all.translations.handlers.index, req.session.language);
		swig.main = app.get("main");

		res.render("index", swig);
	}

	module.sessionNeeded = []; // listeners

	return (module);
}
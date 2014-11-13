module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.room = function(req, res)
	{
		var swig = all.translations.translate(all.translations.handlers.admin.room, req.session.language);
		swig.roomID = req.params.room ? req.params.room : "";
		swig.main = app.get("main");

		res.render((!req.session || !req.session.admin) ? "adminauth" : "adminroom", swig);
	}

	module.regular = function(req, res)
	{
		var swig = all.translations.translate(all.translations.handlers.admin.regular, req.session.language);
		swig.main = app.get("main");

		res.render((!req.session || !req.session.admin) ? "adminauth" : "admin", swig);
	}

	module.new = function(req, res)
	{
		var swig = all.translations.translate(all.translations.handlers.admin.new, req.session.language);
		swig.main = app.get("main");

		res.render("setnewadmin", swig);
	}

	module.sessionNeeded = [];
	return (module);
}
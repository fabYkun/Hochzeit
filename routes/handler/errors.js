module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.e_404 = function(err, req, res, next)
	{
		if (err.status != 404)
			return (next(err));

		var swig = all.translations.translate(all.translations.handlers.errors[404], req.session.language);
		res.status(404);
		res.render("erreur", swig);
	}

	module.e_mongodb = function(err, req, res, next)
	{
		if (err.status != 503)
			return (next(err));

		var swig = all.translations.translate(all.translations.handlers.errors[503], req.session.language);
		res.status(503);
		res.render("erreur", swig);
	}

	module.e_final = function(err, req, res, next)
	{
		var swig = all.translations.translate(all.translations.handlers.errors[500], req.session.language);
		console.error(err);
		console.error("\n--- err.stack (e_final) ---\n");
		console.error(new Date);
		console.error(err.stack);

		res.status(500);
		res.render("erreur", swig);
	}
	return (module);
}
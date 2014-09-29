module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.e_404 = function(err, req, res, next)
	{
		var swig = {};

		if (err.status !== 404)
			return (next(err));

		swig.main = app.get("main");
		swig.title = "Page introuvable... ";
		swig.h1title = "Page introuvable !";
		swig.paragraph = "Ce que vous avez cherché n'est plus ici... ";

		res.status(err.status);
		res.render("erreur", swig);
	}

	module.e_mongodb = function(err, req, res, next)
	{
		var swig = {};

		if (err.status !== 503)
			return (next(err));

		swig.main = app.get("main");
		swig.title = "La base de données est injoignable... ";
		swig.h1title = "Base de données indisponible... ";
		swig.paragraph = "Actuellement la base de données semble indisponible. ";

		res.status(err.status);
		res.render("erreur", swig);
	}

	module.e_final = function(err, req, res, next)
	{
		var swig = {};

		console.error(err);
		console.error("\n--- err.stack (e_final) ---\n");
		console.error(new Date);
		console.error(err.stack);

		swig.main = app.get("main");
		swig.title = "Erreur interne du Serveur";
		swig.h1title = "Une grave erreur est survenue !";
		swig.paragraph = "Nous avons collecté les informations l'ayant produite et travaillerons dessus dès que possible. Nous sommes navré de cet incident et espérons que ça ne se reproduira plus. ";

		res.status(500);
		res.render("erreur", swig);
	}
	return (module);
}
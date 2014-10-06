module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.e_404 = function(err, req, res, next)
	{
		if (err.status !== 404)
			return (next(err));

		var swig = {
		"fr": {
				main:		app.get("main"),
				title:		"Page introuvable... ",
				h1title:	"Page introuvable !",
				paragraph:	"Ce que vous avez cherché n'est plus ici... ",
				lang:		"fr"
			},
			"en": {
				main:		app.get("main"),
				title:		"Page not found... ",
				h1title:	"Page not found !",
				paragraph:	"The page you are looking for is missing... ",
				lang:		"en"
			}
		};

		res.status(404);
		res.render("erreur", swig[((req.session && req.session.language && swig[req.session.language]) ? req.session.language : app.get("lang"))]);
	}

	module.e_mongodb = function(err, req, res, next)
	{
		if (err.status !== 503)
			return (next(err));

		var swig = {
			"fr": {
				main:		app.get("main"),
				title:		"La base de données est injoignable... ",
				h1title:	"Base de données indisponible... ",
				paragraph:	"Actuellement la base de données semble indisponible. ",
				lang:		"fr"
			},
			"en": {
				main:		app.get("main"),
				title:		"We can't reach the database",
				h1title:	"The Database stops responding",
				paragraph:	"The Database doesn't respond... ",
				lang:		"en"
			}
		};

		res.status(503);
		res.render("erreur", swig[((req.session && req.session.language && swig[req.session.language]) ? req.session.language : app.get("lang"))]);
	}



	module.e_final = function(err, req, res, next)
	{
		var swig = {
			"fr": {
				main:		app.get("main"),
				title:		"Erreur interne du Serveur",
				h1title:	"Une grave erreur est survenue !",
				paragraph:	"Nous avons collecté les informations l'ayant produite et travaillerons dessus dès que possible. Nous sommes navré de cet incident et espérons que ça ne se reproduira plus. ",
				lang:		"fr"
			},
			"en": {
				main:		app.get("main"),
				title:		"Internal Server Error",
				h1title:	"An unexpected condition was encountered !",
				paragraph:	"We're collecting the informations that made that error in order to fix it as soon as possible. We are sorry for the discomfort caused. ",
				lang:		"en"
			}
		};

		console.error(err);
		console.error("\n--- err.stack (e_final) ---\n");
		console.error(new Date);
		console.error(err.stack);

		res.status(500);
		res.render("erreur", swig[((req.session && req.session.language && swig[req.session.language]) ? req.session.language : app.get("lang"))]);
	}
	return (module);
}
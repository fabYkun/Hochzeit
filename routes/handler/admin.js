module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.regular = function(req, res)
	{
		var swig = {
			"fr": {
				main:		app.get("main"),
				title:		"Admin",
				password:	"Mot de passe",
				submit:		"Connexion",
				gamesList:	"Jeux crées",
				createGame:	"Créer un nouveau jeu",
				lang:		"fr"
			},
			"en": {
				main:		app.get("main"),
				title:		"Admin",
				password:	"Password",
				submit:		"Connection",
				gamesList:	"Created games",
				createGame:	"Create a new game",
				lang:		"en"
			}
		};

		res.render((!req.session || !req.session.admin) ? "adminauth" : "admin", swig[((req.session && req.session.language && swig[req.session.language]) ? req.session.language : app.get("lang"))]);
	}

	module.new = function(req, res)
	{
		var swig = {
			"fr": {
				main:		app.get("main"),
				title:		"Création d'un nouvel administrateur",
				paragraph:	"Un nouveau mot de passe est requis, il vous sera redemandé si jamais vous supprimez vos cookies. Sinon vous vous connecterez automatiquement. ",
				password:	"Mot de passe",
				conf:		"Confirmation",
				submit:		"Valider",
				lang:		"fr"
			},
			"en": {
				main:		app.get("main"),
				title:		"Creation of a new administrator",
				paragraph:	"A new password is required, it will be asked if you ever delete your cookies. Otherwise you'll be automatically connected. ",
				password:	"Password",
				conf:		"Confirmation",
				submit:		"Submit",
				lang:		"en"
			}
		};

		res.render("setnewadmin", swig[((req.session && req.session.language && swig[req.session.language]) ? req.session.language : app.get("lang"))]);
	}

	module.sessionNeeded = []; // listeners
	module.sessionNeeded.push(require(all.root + "/models/admin"));

	return (module);
}
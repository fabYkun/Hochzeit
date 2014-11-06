module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.regular = function(req, res)
	{
		var swig = {};
		if (!req.params.room) return (res.redirect("/"));

		var swig = {
			"fr": {
				main:		app.get("main"),
				title:		"Vue de session",
				infoBar:
				{
					title:	"Informations sur la session",
					url:	"Nom de code de la salle",
					name:	"Nom de la salle",
					status:	"Status de la salle"
				},
				players: 	"Participant(s)",
				"roomID":	req.params.room,
				wait:		"Veuillez patienter... ",
				waitP:		"Nous récupérons les informations sur la session. ",
				question:
				{
					current: "Question en cours",
					time: "Temps"
				},
				results:	"Résultats",
				winner:		"Gagnant",
				lang:		"fr"
			},
			"en": {
				main:		app.get("main"),
				title:		"Room view",
				infoBar:
				{
					title:	"Informations of the room",
					url:	"CodeName of the room",
					name:	"Room's name",
					status:	"Room's status"
				},
				players: 	"Player(s)",
				"roomID":	req.params.room,
				wait:		"Please wait... ",
				waitP:		"We are collecting the informations of the room. ",
				question:
				{
					current: "Current question",
					time: "Time"
				},
				results:	"Results",
				winner:		"Winner",
				lang:		"en"
			}
		};

		res.render("display", swig[((req.session && req.session.language && swig[req.session.language]) ? req.session.language : app.get("lang"))]);
	}
	return (module);
}
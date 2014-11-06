module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.regular = function(req, res)
	{
		if (!req.params.room || !req.session.user || !req.session.user.pseudo) return (res.redirect("/"));

		var swig = {
			"fr": {
				main:		app.get("main"),
				roomID:		req.params.room,
				randPseudo:	req.session.user.pseudo,
				title:		"Préparations",
				prepare: 	"Préparations avant le commencement du commencement (vous n'aurez pas le temps (en fait vous ne pourrez pas) de modifier ces informations plus tard). ",
				pseudo:		"Votre blaze",
				change: 	"Changer",
				question:
				{
					current:	"Question en cours",
					time:		"Temps"
				},
				closed:		"Salle fermée",
				closedP:	"La session est fermée mais vous pouvez consultez les scores",
				view:		"voir les scores",
				lang:		"fr"
			},
			"en": {
				main:		app.get("main"),
				roomID:		req.params.room,
				randPseudo:	req.session.user.pseudo,
				title:		"Prepare for an epic competition",
				prepare: 	"Prepare yourself before the begining of the begining (you won't have the time next (well yes it's not implemented))",
				pseudo:		"Aka",
				change: 	"Change",
				question:
				{
					current:	"Current question",
					time:		"Time"
				},
				closed:		"Room closed",
				closedP:	"The quest is over but you can still consult your score",
				view:		"see ranking",
				lang:		"en"
			}
		};

		res.render("player", swig[((req.session && req.session.language && swig[req.session.language]) ? req.session.language : app.get("lang"))]);
	}

	module.sessionNeeded = []; // listeners
	module.sessionNeeded.push(require(all.root + "/models/roomAccess"));
	module.sessionNeeded.push(require(all.root + "/models/player"));

	return (module);
}
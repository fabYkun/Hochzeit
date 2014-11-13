/*
** [fr - en - de] 
** Player interface (player handler)
*/

module.exports = function()
{
	var translations = {
		"fr":
		{
			title:		"Inscription réussie",
			prepare: 	"Préparations avant le commencement du commencement (vous n'aurez pas le temps (en fait vous ne pourrez pas) de modifier ces informations plus tard). ",
			pseudo:		"Pseudo",
			assignedP:	"Vous vous appellerez... ",
			affirmativ:	"mmh, ouais. Ça colle bien à votre personnalité !",
			change: 	"Changer",
			question:
			{
				current:	"Question en cours",
				time:		"Temps"
			},
			closed:		"Salle fermée",
			closedP:	"La session est fermée mais vous pouvez consultez les scores",
			view:		"voir les scores"
		},
		"en":
		{
			title:		"Registration successful",
			prepare: 	"Prepare yourself before the begining of the begining (you won't have the time next (well yes it's not implemented))",
			pseudo:		"Aka",
			assignedP:	"Quesapelorio... ",
			affirmativ:	"mmh, yeah. It fits you !",
			change: 	"Change",
			question:
			{
				current:	"Current question",
				time:		"Time"
			},
			closed:		"Room closed",
			closedP:	"The quest is over but you can still consult your score",
			view:		"see ranking"
		},
		"de":
		{
			title:		"Erfolgreiche Registrierung",
			prepare: 	"Prepare yourself before the begining of the begining (you won't have the time next (well yes it's not implemented))",
			pseudo:		"Aka",
			assignedP:	"Quesapelorio... ",
			affirmativ:	"oh, ja. Das passt zu dir !",
			change: 	"Ändern",
			question:
			{
				current:	"Aktuelle Fragen",
				time:		"Zeit"
			},
			closed:		"Raum geschlossen",
			closedP:	"Die aufgabe ist vorbei aber du kannst immer noch deinen Stand abrufen",
			view:		"Stand abrufen"
		}
	}
	return (translations);
}
/*
** [fr - en - de] 
** Display interface (display handler)
*/

module.exports = function()
{
	var translations = {
		"fr":
		{
			title:		"Vue de session",
			infoBar:
			{
				title:	"Informations sur la session",
				url:	"Nom de code de la salle",
				name:	"Nom de la salle",
				status:	"Status de la salle"
			},
			players: 	"Participant(s)",
			wait:		"Veuillez patienter... ",
			waitP:		"Nous récupérons les informations sur la session. ",
			question:
			{
				current:	"Question en cours",
				time:		"Temps"
			},
			pauseMusic:	"Arrêter la musique",
			playMusic:	"Jouer",
			results:	"Résultats",
			winner:		"Gagnant"
		},
		"en":
		{
			title:		"Room view",
			infoBar:
			{
				title:	"Informations of the room",
				url:	"CodeName of the room",
				name:	"Room's name",
				status:	"Room's status"
			},
			players: 	"Player(s)",
			wait:		"Please wait... ",
			waitP:		"We are collecting the informations of the room. ",
			question:
			{
				current:	"Current question",
				time:		"Time"
			},
			pauseMusic:	"Pause the song",
			playMusic:	"Play",
			results:	"Results",
			winner:		"Winner"
		},
		"de": {
			title:		"Raumübersicht",
			infoBar:
			{
				title:	"Rauminformation",
				url:	"CodeName of the room",
				name:	"Raumname",
				status:	"Raumstatus"
			},
			players: 	"Spieler",
			wait:		"Bitte warten... ",
			waitP:		"Wir sammeln die Rauminformation. ",
			question:
			{
				current:	"Aktuelle Frage",
				time:		"Zeit"
			},
			pauseMusic:	"Pause the song",
			playMusic:	"Play",
			results:	"Ergebniss",
			winner:		"Gewinner"
		}
	}
	return (translations);
}
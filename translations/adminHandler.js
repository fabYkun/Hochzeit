/*
** [fr - en] 
** Admin interface (admin handler)
*/

module.exports = function()
{
	var translations = {
		room:
		{
			"fr":
			{
				title:		"Administration de session",
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
				stateMod:	"Avancer l'état de la session",
				stateModP:	'Les sessions passent par trois phases: "Open" correspond à la période d\'inscription au jeu, ' +
							'"In Game" ferme les inscriptions et débute le jeu et "Closed" se lance automatiquement quand il' +
							"n'y aura plus de questions ou que vous terminez la session. ",
				stateModA:	"État suivant",
				question:
				{
					current:	"Question en cours",
					time:		"Temps",
					points:		"Points",
					answers:	"Réponses",
					correct:	"Correcte",
					media:		"Media",
					next:		"Question suivante"
				},
				results:	"Résultats",
				winner:		"Gagnant",
				addPts:		"Ajouter",
				denyBuzzer:	"Refuser"
			},
			"en":
			{
				title:		"Room administration",
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
				stateMod:	"Advance the state of the room",
				stateModP:	'Rooms have three phases: "Open" correspond to the register period, "In Game" ends it and launch the ' +
							'game and "Closed" will appear automaticly when all the questions will be answerded or if you end it yourself. ',
				stateModA:	"Next state",
				question:
				{
					current:	"Current question",
					time:		"Time",
					points:		"Points",
					answers:	"Answers",
					correct:	"Correct",
					media:		"Media",
					next:		"Next question"
				},
				results:	"Results",
				winner:		"Winner",
				addPts:		"Add",
				denyBuzzer:	"Deny"
			}
		},
		regular:
		{
			"fr":
			{
				title:		"Admin",
				password:	"Mot de passe",
				submit:		"Connexion",
				roomList:	"Sessions",
				newRoomForm:
				{
					name:		"Nom",
					languages:	"Langages",
					quest:		"Questionnaire associé",
					create:		"Créer",
					upload:		"Upload"
				},
				newQuest:	"Uploader un nouveau questionnaire"
			},
			"en":
			{
				title:		"Admin",
				password:	"Password",
				submit:		"Connection",
				roomList:	"Rooms",
				newRoomForm:
				{
					name:		"Name",
					languages:	"Languages",
					quest:		"Associated questionnaire",
					create:		"Create",
					upload:		"Upload"
				},
				newQuest:	"Upload a new questionnaire"
			}
		},
		new:
		{
			"fr":
			{
				title:		"Création d'un nouvel administrateur",
				paragraph:	"Un nouveau mot de passe est requis, il vous sera redemandé si jamais vous supprimez vos cookies. Sinon vous vous connecterez automatiquement. ",
				password:	"Mot de passe",
				conf:		"Confirmation",
				submit:		"Valider"
			},
			"en":
			{
				title:		"Creation of a new administrator",
				paragraph:	"A new password is required, it will be asked if you ever delete your cookies. Otherwise you'll be automatically connected. ",
				password:	"Password",
				conf:		"Confirmation",
				submit:		"Submit"
			}
		}
	}
	return (translations);
}
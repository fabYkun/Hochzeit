/*
** Service that provides strings to angular, depending on the langage set in the server
*/
angular.module("languages", [])
	.factory("languages", function()
	{
		var languages = {
			fr: {
				wait:				"Veuillez patienter",
				closeLogs:			"Fermer les alertes",
				responded:			"Répondu",
				waitingForAnswers:	"En attente de réponse",
				failServer:			"Une erreur est intervenu sur le serveur",
				newAdmin:
				{
					failPassword:	"Mot de passe inexistant ou confirmation incorrecte",
					successServer:	"L'enregistrement du nouvel admin est terminé ! La page va s'actualiser"
				},
				adminAuth:
				{
					failPassword:	"Mot de passe erroné",
					emptyPassword:	"Mot de passe inexistant"
				},
				missingData:		"Il manque des informations",
				noNextQuestion:		"Il n'y a plus de questions, appuyez sur Entrer pour fermer la salle",
				registrationSuccessful: "Inscription réussie !",
				inGame:				"En jeu"
			},
			en: {
				wait:				"Please wait",
				closeLogs:			"Close",
				responded:			"Responded",
				waitingForAnswers:	"Waiting for an answer",
				failServer:			"An error was caught during the process",
				newAdmin:
				{
					failPassword: 	"Password empty or incorrect confirmation",
					successServer:	"The recording of the new admin has been successful ! The page will refresh"
				},
				adminAuth:
				{
					failPassword:	"Authentification failed, try again",
					emptyPassword:	"The password you've send is empty"
				},
				missingData:		"Informations are missing",
				noNextQuestion:		"There is no more questions left, press Enter to close the room",
				registrationSuccessful: "Registration successful !",
				inGame:				"In game"
			}
		};
		return (languages);
	});
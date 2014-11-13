/*
** [fr - en - de] 
** Index interface (index handler)
*/

module.exports = function()
{
	var translations = {
		"fr":
		{
			title:		"Sélection d'un jeu en cours",
			rooms:		"Salles disponibles",
			noRooms:	"Aucune salle disponible",
			views:		"Salles visibles",
			join:		"Rejoindre"
		},
		"en":
		{
			title:		"Current game selection",
			rooms:		"Rooms available",
			noRooms:	"No room available",
			views:		"Visible rooms",
			join:		"Join"
		},
		"de":
		{
			title:		"Gegenwärtige Spielauswahl",
			rooms:		"Räume verfügbar",
			noRooms:	"Kein Raum verfügbar",
			views:		"Sichtbare Räume",
			join:		"Beitreten"
		}
	}
	return (translations);
}
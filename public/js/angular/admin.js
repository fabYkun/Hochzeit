var adminApp = angular.module("adminApp", ["webSocket", "languages", "showLogs", "switchLanguage"]);

adminApp.controller("adminCtrl", function ($scope, socket, languages){
	$scope.language = document.getElementById("lang").innerHTML || "en";

	$scope.gamesList = [];
	socket.emit("gamesList");
	socket.on("gamesList", function(gamesList)
	{
		$scope.$digest($scope.gamesList = gamesList);
	})

});
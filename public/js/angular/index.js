var indexApp = angular.module("indexApp", ["webSocket", "languages", "showLogs", "switchLanguage"]);

indexApp.controller("indexCtrl", function ($scope, socket, languages){
	$scope.language = document.getElementById("lang").textContent || "en";
	$scope.rooms = [];

	socket.emit("getRooms", "Open");
	socket.on("getRooms", function(list){ $scope.$digest($scope.rooms = list); });
});
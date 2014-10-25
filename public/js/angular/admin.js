var adminApp = angular.module("adminApp", ["webSocket", "languages", "showLogs", "switchLanguage"]);

adminApp.controller("adminCtrl", function ($scope, socket, languages){
	$scope.language = document.getElementById("lang").innerHTML || "en";

	$scope.questionnaires = [];
	$scope.rooms = [];

	socket.emit("getQuestionnaires");
	socket.emit("getRooms");

	socket.on("getQuestionnaires", function(list){ $scope.$digest($scope.questionnaires = list); })
	socket.on("getRooms", function(list){ $scope.$digest($scope.rooms = list); })
});
var playerApp = angular.module("playerApp", ["webSocket", "languages", "showLogs", "switchLanguage"]);

playerApp.controller("playerCtrl", function ($scope, socket, languages){

	$scope.language = document.getElementById("lang").innerHTML || "en";

});
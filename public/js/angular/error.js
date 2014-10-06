var errorApp = angular.module("errorApp", ["webSocket", "languages", "showLogs", "switchLanguage"]);

errorApp.controller("errorCtrl", function ($scope, socket, languages){
	$scope.language = document.getElementById("lang").innerHTML || "en";
});
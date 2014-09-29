var newAdmin = angular.module("newAdmin", ["webSocket", "languages", "showLogs", "switchLanguage"]);

newAdmin.controller("newAdminCtrl", function ($scope, socket, languages){

	$scope.language = document.getElementById("lang").innerHTML || "en";
	$scope.confirmation = "";
	$scope.password = "";

	$scope.connexion = function()
	{
		if ($scope.confirmation != $scope.password || $scope.password == "")
			socket.setLogs([{error: true, message: languages[$scope.language].newAdmin.failPassword}]);
		else
			socket.emit("setnewadmin", $scope.confirmation);	
	}

	socket.on("err", function(){ socket.displayLogs($scope, [{error: true, message: languages[$scope.language].failServer}]) });
	socket.on("success", function(){ socket.displayLogs($scope, {message: languages[$scope.language].newAdmin.successServer, countdown: 1.25}) });
});
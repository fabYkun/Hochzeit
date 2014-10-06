var adminAuth = angular.module("adminAuth", ["webSocket", "languages", "showLogs", "switchLanguage"]);

adminAuth.controller("adminAuthCtrl", function ($scope, socket, languages){
	$scope.language = document.getElementById("lang").innerHTML || "en";
	$scope.password = "";

	$scope.connexion = function()
	{
		if ($scope.password == "")
			socket.setLogs([{error: true, message: languages[$scope.language].adminAuth.emptyPassword}]);
		else
			socket.emit("adminauth", $scope.password);	
	}

	socket.on("err", function(){ socket.displayLogs($scope, [{error: true, message: languages[$scope.language].failServer}]) });
	socket.on("success", function(){ socket.displayLogs($scope, {message: languages[$scope.language].adminAuth.successServer, countdown: 1.25}) });
});
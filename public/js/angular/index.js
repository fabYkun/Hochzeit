var indexApp = angular.module("indexApp", ["webSocket", "languages", "showLogs", "switchLanguage"]);

indexApp.controller("indexCtrl", function ($scope, socket, languages){
	$scope.language = document.getElementById("lang").textContent || "en";
	$scope.rooms = [];
	$scope.views = [];

	socket.emit("getRooms", "Open");
	socket.emit("getRooms", "In Game");
	socket.on("getRooms", function(list){
		if (list[0] && list[0].state == "Open") $scope.rooms = list;
		$scope.views = $scope.views.concat(list);
		$scope.$digest();
	});
});
var adminApp = angular.module("adminApp", ["webSocket", "languages", "showLogs", "switchLanguage"]);

adminApp.controller("adminCtrl", function ($scope, socket, languages){
	$scope.language = document.getElementById("lang").innerHTML || "en";

	$scope.questionnaires = [];
	$scope.rooms = [];
	$scope.newRoom = {
		name: undefined,
		model: undefined
	};

	$scope.createRoom = function()
	{
		if (!$scope.newRoom.name || !$scope.newRoom.model || !$scope.newRoom.model.name)
			return (socket.setLogs([{error: true, message: languages[$scope.language].missingData}]));
		socket.emit("createRoom", {
			name: $scope.newRoom.name,
			model: $scope.newRoom.model.name
		});
		return (socket.setLogs([{message: languages[$scope.language].wait}]));
	}

	$scope.deleteRoom = function(name) { socket.emit("deleteRoom", name); };
	socket.on("deleteRoom", function(name)
	{
		var i = -1;
		while ($scope.rooms[++i])
			if ($scope.rooms[i].name == name)
				$scope.rooms.splice(i, 1);
		$scope.$digest();
	});

	socket.emit("getQuestionnaires");
	socket.emit("getRooms");

	socket.on("getQuestionnaires", function(list){
		var i = -1;
		var j;

		while (list[++i])
		{
			list[i].selected = list[i].name + " (" + list[i].questions + ") [" + list[i].languages[0];
			
			j = 0;
			while(list[i].languages[++j])
				list[i].selected += ", " + list[i].languages[j];
			list[i].selected += "]";
		}
		$scope.$digest($scope.questionnaires = list);
	});

	socket.on("createRoom", function(newRoom)
	{
		$scope.rooms.push(newRoom);
		$scope.$digest();
	});

	socket.on("getRooms", function(list){ $scope.$digest($scope.rooms = list); });
});
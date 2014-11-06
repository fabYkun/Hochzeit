var adminRoomApp = angular.module("displayApp", ["webSocket", "languages", "showLogs", "switchLanguage"]);

adminRoomApp.controller("displayCtrl", function ($scope, socket, languages){
	$scope.language = document.getElementById("lang").textContent || "en";
	$scope.languages = languages;

	$scope.room = {};
	$scope.languageIndex = 0;
	$scope.conclusion = {};
	$scope.buzzerName;
	var roomID = document.getElementById("roomID").textContent;
	var song;
	var autoplay = true;

	socket.on("stateChanged", function(newState)
	{
		$scope.room.state = newState;
		if (newState == "Closed") makeConclusions();
		$scope.$apply();
	});

	function loadAudio(uri)
	{
		var audio = new Audio();
		audio.addEventListener("canplaythrough", songLoaded, false);
		audio.src = uri;
		return (audio);
	}
	function songLoaded() { if (autoplay) song.play(); }
	$scope.pauseMusic = function() { if (song) song.pause(); };
	$scope.playMusic = function() { if (song) song.play(); };

	function makeConclusions()
	{
		var swap;
		var i = -1;
		var j;

		$scope.conclusion.winners = $scope.room.players;
		while ($scope.conclusion.winners[++i])
		{
			j = -1;
			while ($scope.conclusion.winners[++j])
			{
				if ($scope.conclusion.winners[j + 1] && $scope.conclusion.winners[j + 1].points > $scope.conclusion.winners[j].points)
				{
					swap = $scope.conclusion.winners[j];
					$scope.conclusion.winners[j] = $scope.conclusion.winners[j + 1];
					$scope.conclusion.winners[j + 1] = swap;
				}
			}
		}
	}

	socket.emit("getRoom", roomID);
	socket.on("getRoom", function(room)
	{
		var extension;

		$scope.room = room;
		$scope.languageIndex = room.languages.indexOf($scope.language) ? room.languages.indexOf($scope.language) : 0;
		if (room.state == "Closed") makeConclusions();
		else if (room.state == "In Game")
		{
			if (room.buzzer)
			{
				$scope.buzzerName = room.buzzer;
				autoplay = false;
			}
			if (room.quest[room.index].media)
			{
				$scope.pauseMusic();
				extension = room.quest[room.index].media.slice(room.quest[room.index].media.lastIndexOf(".") + 1);
				if (extension == "mp3" || extension == "ogg")
					song = loadAudio("/media/" + room.quest[room.index].media);
			}
		}
		$scope.$apply();
	});

	socket.on("nextQuestion", function(){
		$scope.pauseMusic();
		socket.emit("getRoom", roomID);
	});

	socket.on("newPlayer", function(index, player)
	{
		$scope.room.players[index] = player;
		$scope.$apply();
	});

	socket.on("buzzer", function(name)
	{
		$scope.buzzerName = name;
		if (!name) $scope.playMusic();
		else $scope.pauseMusic();
		$scope.$apply();
	});
});
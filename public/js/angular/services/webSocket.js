/*
** Service lançant la connexion en websocket

** socket.logs permet de récupérer les messages reçus et les afficher dans un controller
*/

angular.module("webSocket", [])
	.factory("socket", function($rootScope)
	{
		var socket = io("localhost:8080");

		socket.logs = [];
		socket.countdown = undefined;

		socket.setLogs = function(logs){ socket.logs = logs }
		socket.deleteLogs = function(logs){ socket.logs = [] }
		socket.displayLogs = function($scope, logs)
		{
			if ($scope == undefined)
				$scope = $rootScope;
			if (!logs.countdown)
				$scope.$digest(socket.logs = logs);
			else
			{
				window.setTimeout(function() { window.location.reload(true) }, logs.countdown * 1000);
				$scope.$digest(socket.logs = [logs]);
				function timer(countdown)
				{
					$scope.$digest(socket.countdown = countdown.toFixed(2));
					if (countdown > 0)
						window.setTimeout(function(){ timer(countdown - 0.01) }, 10);
				}
				timer(logs.countdown);
			}
		}

		return (socket);
	});
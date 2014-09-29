/*
** Service lançant la connexion en websocket

** socket.logs permet de récupérer les messages reçus et les afficher dans un controller
**
** socket.on("connection") permet, en fonction d'une variable à set dans le <head> d'un document html, 
** de relancer une nouvelle connexion (fix lié aux proxy n'ayant pas trop confiance aux ws non secure)
*/
angular.module("webSocket", [])
	.factory("socket", function($rootScope)
	{
		var production = false;
		var socket = io((production) ? "ws://cloudindus.mybluemix.net/" : "localhost:8080");

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

		socket.on("connection", function()
		{
			if (window.ws_reconnect && !(window.ws_reconnect = undefined))
				socket.close();
		});

		return (socket);
	});
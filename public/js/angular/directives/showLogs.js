angular.module("showLogs", ["webSocket", "languages"])
	.controller("socketLogsCtrl", function($scope, socket, languages)
	{
		$scope.closeMsg = languages.closeLogs;
		$scope.socket = socket;
		function displayLogs(msg) { $scope.socket.displayLogs($scope, msg) }

		socket.on("err", displayLogs);
		socket.on("success", displayLogs);
	})
	.directive("logsBlock", function() {
		return ({
					restrict: "E",
					transclude: false,
					scope: false,
					templateUrl: "/templates/logs.html"
				});
	});
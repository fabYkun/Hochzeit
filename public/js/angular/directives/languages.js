angular.module("switchLanguage", ["webSocket", "languages"])
	.controller("languageCtrl", function($scope, socket, languages)
	{
		var newLang;

		$scope.languages = [];
		for (var key in languages)
			$scope.languages.push(key);
		$scope.language = $scope.languages[0];

		$scope.setlanguage = function(language) { newLang = language; socket.emit("changeLang", newLang) }
		socket.on("changeLang", function(){ socket.displayLogs(undefined, {message: (languages[newLang] && languages[newLang].wait) ? languages[newLang].wait : "Please wait", countdown: 1.25}) });
	})
	.directive("switchLanguage", function() {
		return ({
					restrict: "E",
					transclude: false,
					scope: false,
					templateUrl: "/templates/languages.html"
				});
	});
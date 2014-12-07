module.exports = function(all, defaultLanguage)
{
	var module = {};
	var handlers = {};

	handlers.admin = require("./adminHandler");

	handlers.display = require("./displayHandler");
	handlers.errors = require("./errorsHandler");
	handlers.index = require("./indexHandler");
	handlers.player = require("./playerHandler");

	module.handlers = handlers;
	module.translate = function(translations, target)
	{
		var translation;

		if (!translations) return ({lang: target});
		translation = translations[target] || translations[defaultLanguage] || translations["en"] || {};
		translation.lang = target;
		translation.main = all.app.get("main");
		return (translation);
	};

	return (module);
}
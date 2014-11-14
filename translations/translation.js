module.exports = function(defaultLanguage)
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
		if (!translations) return ("");
		return (translations[target] || translations[defaultLanguage] || translations["en"] || {});
	};

	return (module);
}
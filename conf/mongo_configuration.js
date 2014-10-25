module.exports = function()
{
	var module = {};

	module.options = {server: {}, replset: {}};
	module.options.server.socketOptions = module.options.replset.socketOptions = { keepAlive: 1 };

	module.info = {username: "root", password: "", url: "mongodb://localhost"};
	return (module);
}
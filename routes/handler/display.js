module.exports = function(all)
{
	var app = all.app;
	var module = {};

	module.regular = function(req, res)
	{
		var swig = {};

		swig.main = app.get("main");
		swig.title = "Display";

		res.render("display", swig);
	}
	return (module);
}
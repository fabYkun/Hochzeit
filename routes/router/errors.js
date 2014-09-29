module.exports = function(all)
{
	var app = all.app;
	var errors = require("../handler/errors")(all);

	app.get("*", function(req, res, next)
	{
		var err = new Error();

		err.status = 404;
		next(err);
	});

	app.use(errors.e_404);
	app.use(errors.e_mongodb);
	app.use(errors.e_final);
}
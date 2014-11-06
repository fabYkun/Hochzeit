module.exports = function(express, root, production)
{
	var module = {};
	module.root = root;

	var CookieParser = require("cookie-parser");
	var Session = require("express-session");
	var memoryStore = Session.MemoryStore;

	var app = express();
	var conf_swig = {cache: false, varControls: ["{[", "]}"]};
	var SessionStore = new memoryStore();
	app.SessionStore = SessionStore;

	app.use(CookieParser());
	app.use(function(req, res, next) {
		res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-eval' 'unsafe-inline'; font-src 'self' http://themes.googleusercontent.com http://fonts.gstatic.com");
		res.setHeader("X-Frame-Options", "DENY");
		res.setHeader("X-Content-Type-Options", "nosniff");
		return (next());
	});
	app.use(express.static(root + "/public"));
	app.use(Session({store: SessionStore, cookie: {secure: false}, saveUninitialized: true, resave: true, secret: "@lfred"}));
	
	module.swig = require("swig");

	app.engine("html", module.swig.renderFile);
	app.set("view engine", "html");
	app.set("views", root + "/views");
	app.set("main", "Hochzeit");

	module.io = require("socket.io").listen(app.listen(8080));

	var SessionSocket = require("./session.socket.io-express4");
	module.SessionSockets = new SessionSocket(module.io, SessionStore, CookieParser());

	app.set("view cache", false);
	module.swig.setDefaults(conf_swig);
	module.app = app;
	
	return (module);
};
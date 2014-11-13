var language = "fr"; // default language

var express = require("express");
var mongoose = require("mongoose");
var mongo_conf = require("./conf/mongo_configuration")();
var translations = require("./translations/translation")(language);
var all = require("./conf/configurations")(express, __dirname);
all.app.set("lang", language);

mongoose.connection.on("connected", console.error.bind(console, "DB[root] : connection successful"));
mongoose.connection.on("disconnected", console.error.bind(console, "DB[root] disconnected :"));
mongoose.connection.on("error", console.error.bind(console, "DB[root] error :"));

all.mongo = mongo_conf;
all.translations = translations;
require("./routes/router/routes")(all);

var gracefulExit = function() {
	mongoose.connection.close(function() {
		console.log("Mongoose default connection with DB is disconnected through app termination");
		process.exit(0);
	});
}

process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

try {
	console.log("Connect to DB : " + (mongo_conf.info.uri || mongo_conf.info.url));
	mongoose.connect((mongo_conf.info.uri || mongo_conf.info.url) + "/hochzeit");
} catch (err) {
	console.error("Server initialization failed\n---\n" , err);
}
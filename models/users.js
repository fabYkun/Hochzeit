module.exports = function(all)
{
	var module = {};
	var mongoose = require("mongoose");

	var Schema = mongoose.Schema;
	var UsersSchema = new Schema({
		Pseudo:		String,
		Room:		Number,
		AuthCookie:	String,
		Timestamp:	{type: Date, default: Date.now}
	});
	var AdminSchema = new Schema({
		Password:	String,
		AuthCookie:	String
	});

	module.UsersSchema = mongoose.model("users", UsersSchema);
	module.AdminSchema = mongoose.model("admin", AdminSchema);
	return (module);
};
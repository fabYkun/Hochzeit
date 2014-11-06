module.exports = function()
{
	var module = {};
	var mongoose = require("mongoose");

	var Schema = mongoose.Schema;
	var UsersSchema = new Schema({
		Pseudo:		String,
		Room:		String,
		AuthCookie:	String
	});
	var AdminSchema = new Schema({
		Password:	String,
		AuthCookie:	String
	});

	module.UsersSchema = mongoose.model("users", UsersSchema);
	module.AdminSchema = mongoose.model("admin", AdminSchema);
	return (module);
};
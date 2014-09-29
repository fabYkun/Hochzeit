module.exports = function(io, sessionStore, cookieParser, key)
{
	key = key || 'connect.sid';

	this.of = function(namespace) {
		return {
			on: function(event, callback) {
				return bind.call(this, event, callback, io.of(namespace));
			}.bind(this)
		};
	};

	function getAllProperties(obj) {
		var properties = '';
		for (property in obj)
			properties += '\n' + property;
		return (properties);
	}

	this.on = function(event, callback) {
		return (bind.call(this, event, callback, io.sockets));
	};

	this.getSession = function(socket, callback) {
		cookieParser(socket.handshake, {}, function (parseErr){
			sessionStore.load(findCookie(socket.handshake), function (storeErr, session) {
				var err = resolve(parseErr, storeErr, session);
				callback(err, session);
			});
		});
	};

	function bind(event, callback, namespace) {
		namespace.on(event, function (socket) {
			this.getSession(socket, function (err, session) {
				callback(err, socket, session);
			});
		}.bind(this));
	}

	function findCookie(handshakeInput) {
		var handshake = JSON.parse(JSON.stringify(handshakeInput));
		if (handshake.secureCookies && handshake.secureCookies[key]) handshake.secureCookies = (handshake.secureCookies[key].match(/\:(.*)\./) || []).pop();
		if (handshake.signedCookies && handshake.signedCookies[key]) handshake.signedCookies[key] = (handshake.signedCookies[key].match(/\:(.*)\./) || []).pop();
		if (handshake.cookies && handshake.cookies[key]) handshake.cookies[key] = (handshake.cookies[key].match(/\:(.*)\./) || []).pop();

		return ((handshake.secureCookies && handshake.secureCookies[key])
				|| (handshake.signedCookies && handshake.signedCookies[key])
				|| (handshake.cookies && handshake.cookies[key]));
	}

	function resolve(parseErr, storeErr, session) {
		if (parseErr)
			return (parseErr);
		if (!storeErr && !session)
			return (new Error ('could not look up session by key: ' + key));
		return (storeErr);
	}
};
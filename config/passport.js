var localStrategy = require('passport-local').Strategy,
	encryptionHelper = require('encryptionhelper'),
	secret = require('./secret'),
	User = require('../server/models/User.js');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-login', new localStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		User.findByUsername(username, function (err, user) {
			// we should never tell them what the error was (watch out on what i'm passing back)
			if (user === null || (user && user.length < 1) || typeof user === 'undefined' || !user) {
				done('Incorrect Username', null);
			} else {
				password = encryptionHelper.cipher(secret.encryptionKey, password + user.salt, 'aes256');
				if (user.password !== password) {
					done('Incorrect Password', null);
				} else if (user.ban === true) {
					done('You have been banned.', null);
				} else {
					done(false, user);
				}
			}
		});
    }));
};
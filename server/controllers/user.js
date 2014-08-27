'use strict';
var passport = require('passport'),
	utils = require('../utils.js'),
	jwt = require('jsonwebtoken'),
	encryptionHelper = require('encryptionhelper'),
	secret = require('../../config/secret'),
	User = require('../models/User.js');

module.exports = {
	register: function (req, res) {
		utils.validateRegister(req.body.username, req.body.password, req.body.email, function (err) {
			if (err.length >= 1) {
				return res.json(200, {'success': false, 'err': err});
			} else {
				var salt = encryptionHelper.cipher(secret.encryptionKey, Date() + Math.floor(Math.random() * (1000 - 1 + 1)) + 1, 'aes256'),
					cipher = encryptionHelper.cipher(secret.encryptionKey, req.body.password + salt, 'aes256');
				User.addUser(req.body.username, cipher, salt, req.body.email, req.connection.remoteAddress, function (err, result) {
					if (err) {
						return res.json(200, {'success': false, 'err': err});
					}
					req.logIn(result, function (logInErr) {
						if (logInErr) {
							return res.json(200, {'success': false}); // not sure if this will ever happen
						} else {
							var profile = {
									id: result.id,
									username: result.username,
									role: result.role
								},
								token = jwt.sign(profile, secret.jwtSecret, { expiresInMinutes: 60 * 5 });
							return res.json(200, { 'success': true, 'role': result.role, 'username': result.username, 'id': result.id, 'token': token });
						}
					});
				});
			}
		});
	},

	login: function (req, res, next) {
		utils.validateLogIn(req.body.username, req.body.password, function (err) {
			if (err.length >= 1) {
				return res.json(200, {'success': false, 'err': err[0]});
			} else {
				passport.authenticate('local-login', function (err, result) {
					if (err) {
						return res.json(200, {'success': false, 'err': err});
					} else if (result) {
						req.logIn(result, function (logInErr) {
							if (logInErr) {
								return res.json(200, {'success': false}); // not sure if this will ever happen
							}
							User.userLogInUpdate(req.body.username, req.connection.remoteAddress, function () {
								var profile = {
										id: result.id,
										username: result.username,
										role: result.role
									},
									token = jwt.sign(profile, secret.jwtSecret, { expiresInMinutes: 60 * 5 });
								return res.json(200, { 'success': true, 'role': result.role, 'username': result.username, 'token': token, 'id': result.id });
							});
						});
					} else {
						return res.json(200, {'success': false});
					}
				})(req, res, next);
			}
		});
	},

	logout: function (req, res) {
		req.logout();
		return res.json(200, {'success': true});
	},

	getAllUsers: function (req, res) {
		User.findAllUsers(function (err, result) {
			if (err) {
				return res.json(200, {'success': false, 'err': err});
			} else {
				return res.json(200, {'success': true, 'res': result});
			}
		});
	},

	getUserByUserName: function (req, res) {
		utils.validateTheUsername(req.params.username, function (err) {
			if (err.length >= 1) {
				return res.json(200, {'success': false, 'err': err});
			} else {
				User.findUserByUserName(req.params.username, function (err, result) {
					if (err) {
						return res.json(200, {'success': false, 'err': err});
					} else {
						return res.json(200, {'success': true, 'res': result});
					}
				});
			}
		});
	},

	isUsernameTaken: function (req, res) {
		utils.validateTheUsername(req.body.username, function (err) {
			if (err.length >= 1) {
				return res.json(200, {'success': false, 'err': err});
			} else {
				User.isUsernameTaken(req.body.username, function (err, result) {
					if (err) {
						return res.json(200, {'success': false, 'err': err});
					} else if (result && result.success && result.success === true) {
						return res.json(200, {'success': true});
					} else {
						return res.json(200, {'success': false});
					}
				});
			}
		});
	},

	isEmailTaken: function (req, res) {
		utils.validateIsEmailTaken(req.body.email, function (err) {
			if (err.length >= 1) {
				return res.json(200, {'success': false, 'err': err});
			} else {
				User.isEmailTaken(req.body.email, null, function (err, result) {
					if (err) {
						return res.json(200, {'success': false, 'err': err});
					} else if (result && result.success && result.success === true) {
						return res.json(200, {'success': true});
					} else {
						return res.json(200, {'success': false});
					}
				});
			}
		});
	},

	editUser: function (req, res) {
		utils.validateEditUser(req.body.id, req.body.password, req.body.email, function (err) {
			if (err.length >= 1) {
				return res.json(200, {'success': false, 'err': err});
			} else {
				User.editUser(req.body.id, req.body.password, req.body.email, req.user.id, function (err, result) {
					if (err) {
						return res.json(200, {'success': false, 'err': err});
					} else if (result && result.success && result.success === true) {
						return res.json(200, {'success': true});
					} else {
						return res.json(200, {'success': false});
					}
				});
			}
		});
	},

	deleteUser: function (req, res) {
		utils.validateIDS(req.body.id, function (err) {
			if (err.length >= 1) {
				return res.json(200, {'success': false, 'err': err});
			} else {
				User.deleteUser(req.body.id, function (err, result) {
					if (err) {
						return res.json(200, {'success': false, 'err': err});
					} else if (result && result.success && result.success === true) {
						return res.json(200, {'success': true});
					} else {
						return res.json(200, {'success': false});
					}
				});
			}
		});
	}
};
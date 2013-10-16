'use strict';
var passport = require('passport'),
	utils = require('../utils.js'),
	encryptionHelper = require('encryptionhelper'),
	encryptionKey = 'im-a-train-choo-choo',
	User = require('../models/User.js');

module.exports = {
	register: function(req, res, next) {
		utils.validateRegister(req.body.username, req.body.password, req.body.email, function(err) {
			if(err.length >= 1){
				return res.send(200, {'success': false, 'err': err});
			} else {
				var cipher = encryptionHelper.cipher(encryptionKey, req.body.password, 'aes256');
				User.addUser(req.body.username, cipher, req.body.email, req.body.role, req.connection.remoteAddress, function(err, result) {
					if(err){
						return res.send(200, {'success': false, 'err': err});
					}
					req.logIn(result, function(err) {
						if(err) {
							next(err);
						} else {
							res.json(200, { 'success': true, 'role': result.role, 'username': result.username, 'id': result.id });
						}
					});
				});
			}
		});
	},

	login: function(req, res, next) {
		passport.authenticate('local', function(err, result, message) {
			if(err){return next(err);}
			if(message){
				return res.send(200, {'success': false, 'err': message});
			}
			if(!result) {
				return res.send(400); //what does this mean!?
			}
			req.logIn(result, function(err) {
				if(err) {
					return next(err);
				}
				if(req.body.rememberme) {
					req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
				}
				res.json(200, { 'success': true, 'role': result.role, 'username': result.username });
			});
		})(req, res, next);
	},

	editUser: function(req, res) {
		utils.validateEditUser(req.body.id, req.body.password, req.body.email, function(err) {
			if(err.length >= 1){
				return res.send(200, {'success': false, 'err': err});
			} else {
				User.editUser(req.body.id, req.body.password, req.body.email, req.user.id, function(err, result) {
					if(err){
						return res.send(200, {'success': false, 'err': err});
					}
					if(result._id){
						return res.send(200, {'success': true, 'res': result});
					} else {
						return res.send(200, {'success': false, 'err': 'none'});
					}
				});
			}
		});
	},

	deleteUser: function(req, res) {
		utils.validateIDS(req.body.id, function(err) {
			if(err.length >= 1){
				return res.send(200, {'success': false, 'err': err});
			} else {
				User.deleteUser(req.body.id, function(err, result) {
					if(err){
						return res.send(200, {'success': false, 'err': err});
					}
					if(result._id){
						return res.send(200, {'success': true, 'res': result});
					} else {
						return res.send(200, {'success': false, 'err': 'none'});
					}
				});
			}
		});
	},

	logout: function(req, res) {
		req.logout();
		return res.send(200, {'success': true});
	},

	// should remove this or rewrite it
	getAllUsers: function(req, res) {
		User.findAllUsers(function(err, result) {
			if(err){
				res.send(500);
				return;
			} else {
				//res.json(200, { "users": result});
				res.json(result);
			}
		});
	}
};
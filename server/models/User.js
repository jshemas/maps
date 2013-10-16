'use strict';
var winston = require('winston'),
	LocalStrategy = require('passport-local').Strategy,
	utils = require('../utils.js'),
	encryptionHelper = require('encryptionhelper'),
	encryptionKey = 'im-a-train-choo-choo',
	mongoose = require('mongoose'),
	userRoles = require('../../client/app/scripts/routingConfig').userRoles;

// should move this into app.js
mongoose.connect('mongodb://localhost/something', function onMongooseError(err) {
	if (err) { throw err; }
});

// User Schema
var UserSchema = new mongoose.Schema({
	username: { type: String },
	password:  { type: String },
	email: { type: String },
	userlevel: { type: String },
	userIP: { type: String },
	createddate: { type: Date, default: Date.now }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
	addUser: function(username, password, email, role, userIP, callback) {
		// first make sure the user doesn't all ready have an account
		this.findByUsername(username, function(err,result) {
			if(err){
				callback(err,null);
			}
			if (!result) {
				// all new user will be role level two meaning they are users
				var user = new User({
					username: username,
					password: password,
					email: email,
					userlevel: '2',
					userIP: userIP
				});
				user.save( function(err, result){
					if(err){
						winston.info('Error in addUser:'+err);
						callback('DB-err-addUser',null);
					} else {
						callback(null, result);
					}
				});
			} else {
				// user all ready in system
				callback('UserAlreadyExists',null);
			}
		});
	},

	findAllUsers: function(callback) {
		var query = User.find().sort('-createddate');
		query.select('username password email userIP _id userlevel');
		query.exec(function (err, result) {
			if(err){
				winston.info('Error in findAllUsers:'+err);
				callback('DB-err-findAllUsers',null);
			} else {
				callback(null, result);
			}
		});
	},

	findById: function(id, callback) {
		User.findOne({_id:id}, function(err,result) {
			if(err){
				winston.info('Error in findByID:'+err);
				callback('DB-err-findByID',null);
			} else {
				if(result) {
					if(result.userlevel === '4') {
						result.userlevel = userRoles.admin;
					} else {
						result.userlevel = userRoles.user;
					}
					callback(null, result);
				} else {
					callback(null, null);
				}
			}
		});
	},

	findByUsername: function(username, callback) {
		User.findOne({username:username}, function(err,result) {
			if(err){
				winston.info('Error in findByUsername:'+err);
				callback('DB-err-findByUsername',null);
			} else {
				if(result) {
					if(result.userlevel === '4') {
						result.userlevel = userRoles.admin;
					} else {
						result.userlevel = userRoles.user;
					}
					callback(null, result);
				} else {
					callback(null, null);
				}
			}
		});
	},

	editUser: function(userId, password, email, userBy, callback) {
		var userUpdate = { $set: {
			password: password,
			email: email
		}};
		User.update({_id:userId},userUpdate,{upsert: true}, function(err, result){
			if(err){
				winston.info('Error in editUser:'+err);
				callback('DB-err-editUser',null);
			} else {
				callback(null, result);
			}
		});
	},

	deleteUser: function(userId, callback) {
		User.find({_id:userId}).remove(function(err, result){
			if(err){
				winston.info('Error in deleteUser:'+err);
				callback('DB-err-deleteUser',null);
			} else {
				callback(null,result);
			}
		});
	},

	localStrategy: new LocalStrategy(
		function(username, password, done) {
			utils.validateLogIn(username, password, function(err) {
				if(err.length >= 1){
					// no tests go in here, should fix that
					done(null, false, err);
				} else {
					module.exports.findByUsername(username, function(err, user) {
						password = encryptionHelper.cipher(encryptionKey, password, 'aes256');
						if(!user) {
							done(null, false, 'Incorrect Username');
						} else if(user.password !== password) {
							done(null, false, 'Incorrect Password');
						} else {
							// need to log their IP
							return done(null, user);
						}
					});
				}
			});
		}
	),

	serializeUser: function(user, done) {
		done(null, user.id);
	},

	deserializeUser: function(id, done) {
		module.exports.findById(id, function(err, user) {
			if(user) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	}
};


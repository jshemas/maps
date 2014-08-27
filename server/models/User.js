var winston = require('winston'),
	utils = require('../utils.js'),
	mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	user_name: { type: String, required: true, index: {unique: true, dropDups: true}},
	user_password: { type: String, required: true },
	user_salt: { type: String, required: true },
	user_email: { type: String, required: true, index: {unique: true, dropDups: true}},
	user_created_date: { type: Date, default: Date.now },
	user_last_loggin_date: { type: Date },
	user_last_IP: { type: String, required: true },
	user_register_IP: { type: String, required: true },
	user_role: { type: String, required: true },
	user_delete: { type: Boolean, required: true, default: false },
	user_ban: { type: Boolean, required: true, default: false },
	user_ban_reason: { type: String },
	user_last_edit_by: { type: mongoose.Schema.ObjectId, ref: 'User'},
	user_last_edit_data: { type: Date },
	user_post_count: { type: Number, default: 0 },
	user_last_post_time: { type: Date },
	user_topic_count: { type: Number, default: 0 },
	user_last_topic_time: { type: Date },
	user_category_count: { type: Number, default: 0 },
	user_last_category_time: { type: Date },
	user_question_count: { type: Number, default: 0 },
	user_last_question_time: { type: Date },
	user_last_question_edit_time: { type: Date },
	user_answer_count: { type: Number, default: 0 },
	user_last_answer_time: { type: Date },
	user_last_answer_edit_time: { type: Date },
	user_vote_count: { type: Number, default: 0 },
	user_last_vote_time: { type: Date },
	user_flag_count: { type: Number, default: 0 },
	user_last_flag_time: { type: Date },
});
UserSchema.set('autoIndex', true); // In prod this should be set to false

var User = mongoose.model('User', UserSchema);

module.exports = {
	addUser: function (username, password, salt, email, userIP, callback) {
		var that = this;
		this.isUsernameTaken(username, function (isUsernameTakenError, isUsernameTakenResult) {
			if (isUsernameTakenError) {
				callback(isUsernameTakenError, null);
			} else if (isUsernameTakenResult && isUsernameTakenResult.success === false) {
				that.isEmailTaken(email, null, function (isEmailTakenError, isEmailTakenResult) {
					if (isEmailTakenError) {
						callback(isEmailTakenError, null);
					} else if (isEmailTakenResult && isEmailTakenResult.success === false) {
						username = utils.mysqlRealEscapeString(username);
						email = utils.mysqlRealEscapeString(email);
						password = utils.mysqlRealEscapeString(password);
						// all new user will be role level two meaning they are users
						var user = new User({
							user_name: username,
							user_password: password,
							user_salt: salt,
							user_email: email,
							user_register_IP: userIP,
							user_last_IP: userIP,
							user_last_loggin_date: Date(),
							user_role: 'user'
						});
						user.save(function (err, res) {
							if (err) {
								winston.info('Error in addUser:' + err);
								callback('DB-err-addUser', null);
							} else {
								if (res && res._id) {
									var user = {
										id: res._id,
										username: username,
										password: password,
										email: email,
										role: 'user'
									};
									callback(null, user);
								} else {
									callback('err-in-addUser', null);
								}
							}
						});
					} else {
						callback('EmailTaken', null);
					}
				});	
			} else {
				callback('UserAlreadyExists', null);
			}
		});
	},

	// added a limit to this, we need to paginate if we really want to display all users 
	findAllUsers: function (callback) {
		var query = User.find().sort('-user_created_date').limit(20);
		query.select('_id user_name user_last_loggin_date user_role');
		query.exec(function (err, res) {
			if (err) {
				winston.info('Error in findAllUsers:' + err);
				callback('DB-err-findAllUsers', null);
			} else {
				callback(null, res);
			}
		});
	},

	findById: function (id, callback) {
		var query = User.findOne({_id: id});
		query.select('_id user_name');
		query.exec(function (err, res) {
			if (err) {
				winston.info('Error in findByID:' + err);
				callback('DB-err-findByID', null);
			} else {
				if (res && res.length !== 0 && res._id) {
					var user = {
						id: res._id,
						username: res.user_name
					};
					callback(null, user);
				} else {
					callback(null, null);
				}
			}
		});
	},

	// THE DATA FROM THIS SHOULD NEVER BE SEND TO THE CLIENT - RIGHT NOW IT IS!!!
	// this is use for internal user look up (user login)
	findByUsername: function (username, callback) {
		var queryUserName = User.findOne({user_name: username});
		queryUserName.select('_id user_name user_password user_role user_email user_ban user_salt');
		queryUserName.exec(function (userErr, userRes) {
			if (userErr) {
				winston.info('Error in findByUsername-username:' + userErr);
				callback('DB-err-findByUsername', null);
			} else {
				if (userRes && userRes.length !== 0 && userRes._id) {
					var user = {
						id: userRes._id,
						username: userRes.user_name,
						password: userRes.user_password,
						salt: userRes.user_salt,
						email: userRes.user_email,
						role: userRes.user_role,
						ban: userRes.user_ban
					};
					callback(null, user);
				} else {
					var queryEmail = User.findOne({user_email: username});
					queryEmail.select('_id user_name user_password user_role user_email user_ban user_salt');
					queryEmail.exec(function (emailErr, emailRes) {
						if (emailErr) {
							winston.info('Error in findByUsername-email:' + emailErr);
							callback('DB-err-findByUsername', null);
						} else {
							if (emailRes && emailRes.length !== 0 && emailRes._id) {
								var user = {
									id: emailRes._id,
									username: emailRes.user_name,
									password: emailRes.user_password,
									salt: emailRes.user_salt,
									email: emailRes.user_email,
									role: emailRes.user_role,
									ban: emailRes.user_ban
								};
								callback(null, user);
							} else {
								callback(null, null);
							}
						}
					});
				}
			}
		});
	},

	// this is use for external user look up (user profile)
	findUserByUserName: function (username, callback) {
		var query = User.findOne({user_name: username});
		query.select('_id user_name user_created_date user_last_loggin_date user_role user_delete user_ban user_post_count user_question_count user_answer_count');
		query.exec(function (err, res) {
			if (err) {
				winston.info('Error in findUserByUserName:' + err);
				callback('DB-err-findUserByUserName', null);
			} else {
				if (res && res.length !== 0 && res._id) {
					var user = {
						id: res._id,
						username: res.user_name,
						userCreatedDate: res.user_created_date,
						lastLoggedIn: res.user_last_loggin_date,
						role: res.user_role,
						deleted: res.user_delete,
						ban: res.user_ban,
						postCount: res.user_post_count,
						questionCount: res.user_question_count,
						answerCount: res.user_answer_count
					};
					callback(null, user);
				} else {
					callback(null, null);
				}
			}
		});
	},

	isUsernameTaken: function (username, callback) {
		var query = User.findOne({user_name: username});
		query.select('_id user_name');
		query.exec(function (err, res) {
			if (err) {
				winston.info('Error in isUsernameTaken:' + err);
				callback('DB-err-isUsernameTaken', null);
			} else {
				if (res && res.length !== 0 && res._id) {
					callback(null, {'success': true});
				} else {
					callback(null, {'success': false});
				}
			}
		});
	},

	isEmailTaken: function (email, userId, callback) {
		var query = User.findOne({user_email: email});
		query.select('_id user_email');
		query.exec(function (err, res) {
			if (err) {
				winston.info('Error in isEmailTaken:' + err);
				callback('DB-err-isEmailTaken', null);
			} else {
				if (userId) {
					if (res && res.length !== 0 && res._id && userId !== res._id.toString()) {
						callback(null, {'success': true});
					} else {
						callback(null, {'success': false});
					}
				} else {
					if (res && res.length !== 0 && res._id) {
						callback(null, {'success': true});
					} else {
						callback(null, {'success': false});
					}
				}
			}
		});
	},

	// need to DRY this up
	// there seems to be some werid-ness going on here, is the select setting a data sometimes?
	canUserPerformAction: function (userId, actionName, actionTimeout, callback) {
		var query = User.findOne({_id: userId});
		if (actionName === 'addVote') {
			query.select('_id user_last_vote_time user_vote_count');
		} else if (actionName === 'addAnswer') {
			query.select('_id user_last_answer_time user_answer_count');
		} else if (actionName === 'editAnswer') {
			query.select('_id user_last_answer_edit_time');
		} else if (actionName === 'addQuestion') {
			query.select('_id user_last_question_time user_question_count');
		} else if (actionName === 'editQuestion') {
			query.select('_id user_last_question_edit_time');
		} else if (actionName === 'addFlag') {
			query.select('_id user_last_flag_time user_flag_count');
		} else if (actionName === 'editUser') {
			query.select('_id user_last_edit_data');
		}
		query.exec(function (err, res) {
			if (err) {
				winston.info('Error in canUserPerformAction:' + err);
				callback('DB-err-canUserPerformAction', null);
			} else {
				if (res && res.length !== 0 && res._id) {
					var dateNow = new Date(),
						diffMs;
					if (actionName === 'addVote' && res.user_last_vote_time) {
						diffMs = (dateNow.getTime() - res.user_last_vote_time.getTime());
						if (diffMs < actionTimeout) {
							callback(null, {'success': false});
						} else {
							callback(null, {'success': true});
						}
					} else if (actionName === 'addAnswer' && res.user_last_answer_time) {
						diffMs = (dateNow.getTime() - res.user_last_answer_time.getTime());
						if (diffMs < actionTimeout) {
							callback(null, {'success': false});
						} else {
							callback(null, {'success': true});
						}
					} else if (actionName === 'editAnswer' && res.user_last_answer_edit_time) {
						diffMs = (dateNow.getTime() - res.user_last_answer_edit_time.getTime());
						if (diffMs < actionTimeout) {
							callback(null, {'success': false});
						} else {
							callback(null, {'success': true});
						}
					} else if (actionName === 'addQuestion' && res.user_last_question_time) {
						diffMs = (dateNow.getTime() - res.user_last_question_time.getTime());
						if (diffMs < actionTimeout) {
							callback(null, {'success': false});
						} else {
							callback(null, {'success': true});
						}
					} else if (actionName === 'editQuestion' && res.user_last_question_edit_time) {
						diffMs = (dateNow.getTime() - res.user_last_question_edit_time.getTime());
						if (diffMs < actionTimeout) {
							callback(null, {'success': false});
						} else {
							callback(null, {'success': true});
						}
					} else if (actionName === 'addFlag' && res.user_last_vote_time) {
						diffMs = (dateNow.getTime() - res.user_last_flag_time.getTime());
						if (diffMs < actionTimeout) {
							callback(null, {'success': false});
						} else {
							callback(null, {'success': true});
						}
					} else if (actionName === 'editUser' && res.user_last_edit_data) {
						diffMs = (dateNow.getTime() - res.user_last_edit_data.getTime());
						if (diffMs < actionTimeout) {
							callback(null, {'success': false});
						} else {
							callback(null, {'success': true});
						}
					} else if (actionName === 'addVote' && res.user_vote_count === 0 && !res.user_last_vote_time) {
						callback(null, {'success': true});
					} else if (actionName === 'addAnswer' && res.user_answer_count === 0 && !res.user_last_answer_time) {
						callback(null, {'success': true});
					} else if (actionName === 'editAnswer' && !res.user_last_answer_edit_time) {
						callback(null, {'success': true});
					} else if (actionName === 'addQuestion' && res.user_question_count === 0 && !res.user_last_question_time) {
						callback(null, {'success': true});
					} else if (actionName === 'editQuestion' && !res.user_last_question_edit_time) {
						callback(null, {'success': true});
					} else if (actionName === 'addFlag' && res.user_flag_count === 0 && !res.user_last_flag_time) {
						callback(null, {'success': true});
					} else if (actionName === 'editUser' && !res.user_last_edit_data) {
						callback(null, {'success': true});
					} else {
						callback(null, {'success': false});
					}
				} else {
					callback(null, {'success': false});
				}
			}
		});
	},

	updateUserAcountCountAndTime: function (userId, actionName, callback) {
		var userUpdate;
		if (actionName === 'addVote') {
			userUpdate = { $set: { user_last_vote_time: Date() }, $inc: { 'user_vote_count': 1 } };
		} else if (actionName === 'addAnswer') {
			userUpdate = { $set: { user_last_answer_time: Date() }, $inc: { 'user_answer_count': 1 } };
		} else if (actionName === 'editAnswer') {
			userUpdate = { $set: { user_last_answer_edit_time: Date() } };
		} else if (actionName === 'addQuestion') {
			userUpdate = { $set: { user_last_question_time: Date() }, $inc: { 'user_question_count': 1 } };
		} else if (actionName === 'editQuestion') {
			userUpdate = { $set: { user_last_question_edit_time: Date() } };
		} else if (actionName === 'addFlag') {
			userUpdate = { $set: { user_last_flag_time: Date() }, $inc: { 'user_flag_count': 1 } };
		} else if (actionName === 'addPost') {
			userUpdate = { $set: { user_last_post_time: Date() }, $inc: { 'user_post_count': 1 } };
		}
		User.update({_id: userId}, userUpdate, {upsert: false, multi: false}, function (err, res) {
			if (err) {
				winston.info('Error in updateUserAcountCountAndTime:' + err);
				callback('DB-err-updateUserAcountCountAndTime', null);
			} else {
				if (res === 1) {
					callback(null, {'success': true});
				} else {
					callback(res, null);
				}
			}
		});
	},

	// we should not be passing a userId, should just use userBy
	editUser: function (userId, password, email, userBy, callback) {
		var that = this;
		this.canUserPerformAction(userBy, 'editUser', 60000, function (canUserPerformActionError, canUserPerformActionRes) {
			if (canUserPerformActionError) {
				callback(canUserPerformActionError, null);
			} else if ((canUserPerformActionRes && canUserPerformActionRes.success && canUserPerformActionRes.success === true)) {
				that.isEmailTaken(email, userId, function (isEmailTakenError, isEmailTakenResult) {
					if (isEmailTakenError) {
						callback(isEmailTakenError, null);
					} else if (isEmailTakenResult && isEmailTakenResult.success === false) {
						password = utils.mysqlRealEscapeString(password);
						email = utils.mysqlRealEscapeString(email);
						var userUpdate = { $set: {
							user_password: password,
							user_email: email,
							user_last_edit_by: userBy,
							user_last_edit_data: Date()
						}};
						if (userBy !== userId) {
							return callback('Unauthorized Or User Not Found', null);
						}
						User.update({_id: userBy}, userUpdate, {upsert: false, multi: false}, function (err, res) {
							if (err) {
								winston.info('Error in editUser:' + err);
								callback('DB-err-editUser', null);
							} else {
								if (res === 1) {
									callback(null, {'success': true});
								} else {
									callback('Unauthorized Or User Not Found', null);
								}
							}
						});
					} else {
						callback('EmailTaken', null);
					}
				});
			} else {
				callback('Need To Wait', null);
			}
		});
	},

	deleteUser: function (userId, callback) {
		var userDelete = { $set: {
			user_delete: true
		}};
		User.update({_id: userId}, userDelete, {upsert: false, multi: false}, function (err, res) {
			if (err) {
				winston.info('Error in deleteUser:' + err);
				callback('DB-err-deleteUser', null);
			} else {
				if (res === 1) {
					callback(null, {'success': true});
				} else {
					callback('Unauthorized Or User Not Found', null);
				}
			}
		});
	},

	userLogInUpdate: function (username, ip, callback) {
		var userUpdate = { $set: {
			user_last_loggin_date: Date(),
			user_last_IP: ip
		}};
		User.update({username: username}, userUpdate, {upsert: false, multi: false}, function (err, res) {
			if (err) {
				winston.info('Error in userLogInUpdate:' + err);
				callback('DB-err-userLogInUpdate', null);
			} else {
				if (res === 1) {
					callback(null, {'success': true});
				} else {
					callback('Unauthorized Or User Not Found', null);
				}
			}
		});
	}
};
'use strict';
var path = require('path'),
	UserCtrl = require('./controllers/user'),
	PlaceCtrl = require('./controllers/place');

module.exports = function (app) {
	// Views
	app.get('/partials/*', function (req, res) {
		var requestedView = path.join('./', req.url);
		res.render(requestedView, {'env': process.env.NODE_ENV});
	});

	// Local Auth
	app.post('/api/user', function (req, res) {
		userAuthorized(req, 'public', function (result) {
			if (result) {
				UserCtrl.register(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.post('/api/login', function (req, res) {
		userAuthorized(req, 'public', function (result) {
			if (result) {
				UserCtrl.login(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.post('/api/logout', function (req, res) {
		userAuthorized(req, 'public', function (result) {
			if (result) {
				UserCtrl.logout(req, res);
			} else {
				return res.send(401);
			}
		});
	});

	// User Resource
	app.get('/api/user', function (req, res) {
		userAuthorized(req, 'public', function (result) {
			if (result) {
				UserCtrl.getAllUsers(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.get('/api/user/:username', function (req, res) {
		userAuthorized(req, 'public', function (result) {
			if (result) {
				UserCtrl.getUserByUserName(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.get('/api/isUsernameTaken', function (req, res) {
		userAuthorized(req, 'public', function (result) {
			if (result) {
				UserCtrl.isUsernameTaken(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.get('/api/isEmailTaken', function (req, res) {
		userAuthorized(req, 'public', function (result) {
			if (result) {
				UserCtrl.isEmailTaken(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.put('/api/s/user', function (req, res) {
		userAuthorized(req, 'user', function (result) {
			if (result) {
				UserCtrl.editUser(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.get('/api/s/user', function (req, res) {
		userAuthorized(req, 'admin', function (result) {
			if (result) {
				UserCtrl.getAllUsers(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.delete('/api/s/user', function (req, res) {
		userAuthorized(req, 'admin', function (result) {
			if (result) {
				UserCtrl.deleteUser(req, res);
			} else {
				return res.send(401);
			}
		});
	});

	// Places Resource
	app.post('/api/s/addPlace', function (req, res) {
		userAuthorized(req, 'user', function (result) {
			if (result) {
				PlaceCtrl.createPlace(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.get('/api/getAllPlace', function (req, res) {
		userAuthorized(req, 'public', function (result) {
			if (result) {
				PlaceCtrl.getAllPlaces(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.get('/api/getPlaceByLocation', function (req, res) {
		userAuthorized(req, 'public', function (result) {
			if (result) {
				PlaceCtrl.getPlaceByLocation(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.get('/api/getPlaceById', function (req, res) {
		userAuthorized(req, 'public', function (result) {
			if (result) {
				PlaceCtrl.getPlaceById(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.put('/api/s/editPlace', function (req, res) {
		userAuthorized(req, 'user', function (result) {
			if (result) {
				PlaceCtrl.editPlace(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.delete('/api/s/deletePlace', function (req, res) {
		userAuthorized(req, 'admin', function (result) {
			if (result) {
				PlaceCtrl.deletePlace(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.post('/api/s/addComment', function (req, res) {
		userAuthorized(req, 'user', function (result) {
			if (result) {
				PlaceCtrl.addComment(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.put('/api/s/editComment', function (req, res) {
		userAuthorized(req, 'user', function (result) {
			if (result) {
				PlaceCtrl.editComment(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.delete('/api/s/deleteComment', function (req, res) {
		userAuthorized(req, 'admin', function (result) {
			if (result) {
				PlaceCtrl.deleteComment(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.post('/api/s/addRate', function (req, res) {
		userAuthorized(req, 'user', function (result) {
			if (result) {
				PlaceCtrl.addRate(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.put('/api/s/editRate', function (req, res) {
		userAuthorized(req, 'user', function (result) {
			if (result) {
				PlaceCtrl.editRate(req, res);
			} else {
				return res.send(401);
			}
		});
	});
	app.delete('/api/s/deleteRate', function (req, res) {
		userAuthorized(req, 'admin', function (result) {
			if (result) {
				PlaceCtrl.deleteRate(req, res);
			} else {
				return res.send(401);
			}
		});
	});

	// All other get requests should be handled by AngularJS's client-side routing system
	app.get('/*', function(req, res){
		res.render('index', {'env': process.env.NODE_ENV});
	});

	function userAuthorized(req, accessLevel, callback) {
		var role;
		if (!req.user) {
			role = 'public';
		} else {
			role = req.user.role;
		}
		if (accessLevel === 'public') {
			return callback(true);
		} else if (accessLevel === 'user' && (role === 'user' || role === 'admin')) {
			return callback(true);
		} else if (accessLevel === 'admin' &&  role === 'admin') {
			return callback(true);
		} else {
			return callback(false);
		}
	}
};
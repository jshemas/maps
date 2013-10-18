'use strict';
var _ = require('underscore'),
	path = require('path'),
	UserCtrl = require('./controllers/user'),
	PlaceCtrl = require('./controllers/place'),
	userRoles = require('../client/app/scripts/routingConfig').userRoles,
	accessLevels = require('../client/app/scripts/routingConfig').accessLevels;

var routes = [

	// Views
	{
		path: '/partials/*',
		httpMethod: 'GET',
		middleware: [function (req, res) {
			var requestedView = path.join('./', req.url);
			res.render(requestedView);
		}]
	},

	// Local Auth
	{
		path: '/register',
		httpMethod: 'POST',
		middleware: [UserCtrl.register]
	},
	{
		path: '/login',
		httpMethod: 'POST',
		middleware: [UserCtrl.login]
	},
	{
		path: '/logout',
		httpMethod: 'POST',
		middleware: [UserCtrl.logout]
	},

	// User resource
	{
		path: '/users',
		httpMethod: 'GET',
		middleware: [UserCtrl.getAllUsers],
		accessLevel: accessLevels.admin
	},
	{
		path: '/editUser',
		httpMethod: 'POST',
		middleware: [UserCtrl.editUser],
		accessLevel: accessLevels.user
	},
	{
		path: '/deleteUser',
		httpMethod: 'POST',
		middleware: [UserCtrl.deleteUser],
		accessLevel: accessLevels.admin
	},

	// Places resource
	{
		path: '/addPlace',
		httpMethod: 'POST',
		middleware: [PlaceCtrl.createPlace],
		accessLevel: accessLevels.user
	},
	{
		path: '/getPlace',
		httpMethod: 'GET',
		middleware: [PlaceCtrl.getAllPlaces]
	},
	{
		path: '/editPlace',
		httpMethod: 'POST',
		middleware: [PlaceCtrl.editPlace],
		accessLevel: accessLevels.user
	},
	{
		path: '/deletePlace',
		httpMethod: 'POST',
		middleware: [PlaceCtrl.deletePlace],
		accessLevel: accessLevels.admin
	},

	// All other get requests should be handled by AngularJS's client-side routing system
	{
		path: '/*',
		httpMethod: 'GET',
		middleware: [function(req, res) {
			var role = userRoles.public, username = '';
			if(req.user) {
				role = req.user.role[0];
				username = req.user.username;
			}
			res.cookie('user', JSON.stringify({
				'username': username,
				'role': role
			}));
			res.render('index');
		}]
	}
];

module.exports = function(app) {
	_.each(routes, function(route) {
		route.middleware.unshift(ensureAuthorized);
		var args = _.flatten([route.path, route.middleware]);

		switch(route.httpMethod.toUpperCase()) {
		case 'GET':
			app.get.apply(app, args);
			break;
		case 'POST':
			app.post.apply(app, args);
			break;
		case 'PUT':
			app.put.apply(app, args);
			break;
		case 'DELETE':
			app.delete.apply(app, args);
			break;
		default:
			throw new Error('Invalid HTTP method specified for route ' + route.path);
			//break; //will never get here because of throw
		}
	});
};

function ensureAuthorized(req, res, next) {
	/*
	// accessLevel.bitMask = 4 is a admin
	*/
	var role;
	if(!req.user){
		role = userRoles.public;
	} else {
		//this is dumb
		if(req.user.role[0]){
			role = req.user.role[0];
		} else {
			//auto testing
			role = req.user.role;
		}
	}

	var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;
	if(!(accessLevel.bitMask & role.bitMask)) {
		return res.send(403);
	}
	return next();
}
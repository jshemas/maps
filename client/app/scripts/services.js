'use strict';

angular.module('playground').factory('Auth', function($http, $cookieStore){
	var accessLevels = routingConfig.accessLevels,
		userRoles = routingConfig.userRoles,
		currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };
	$cookieStore.remove('user');
	function changeUser(user) {
		_.extend(currentUser, user);
	};
	return {
		authorize: function(accessLevel, role) {
			if(role === undefined){
				role = currentUser.role;
			};
			return accessLevel.bitMask & role.bitMask;
		}, isLoggedIn: function(user) {
			if(user === undefined){
				user = currentUser;
			};
			return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
		},register: function(user, success, error) {
			$http.post('/register', user).success(function(res) {
				changeUser(res);
				success();
			}).error(error);
		},login: function(user, success, error) {
			$http.post('/login', user).success(function(user){
				changeUser(user);
				success(user);
			}).error(error);
		},logout: function(success, error) {
			$http.post('/logout').success(function(){
				changeUser({
					username: '',
					role: userRoles.public
				});
				success();
			}).error(error);
		},
		accessLevels: accessLevels,
		userRoles: userRoles,
		user: currentUser
	};
});

angular.module('playground').factory('Users', function($http) {
	return {
		getAll: function(success, error) {
			$http.get('/users').success(success).error(error);
		}
	};
});

angular.module('playground').factory('Place', function($http) {
	return {
		createPlace: function(place, success, error) {
			$http.post('/addPlace', place).success(function(res) {
				success();
			}).error(error);
		},
		getAllPlaces: function(success, error) {
			$http.get('/getAllPlace').success(success).error(error);
		},
		getPlaceById: function(placeId, success, error) {
			$http.get('/getPlaceById?id='+placeId).success(success).error(error);
		},
		deletePlaces: function(place, success, error) {
			$http.post('/deletePlaces', place).success(function(res) {
				success();
			}).error(error);
		}
	};
});

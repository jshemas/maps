'use strict';

/* Controllers */

angular.module('playground').controller('NavCtrl', ['$rootScope','$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
	$scope.user = Auth.user;
	$scope.userRoles = Auth.userRoles;
	$scope.accessLevels = Auth.accessLevels;
	$scope.logout = function() {
		Auth.logout(function() {
			$location.path('/login');
		}, function() {
			$rootScope.error = "Failed to logout";
		});
	};
}]);

angular.module('playground').controller('LoginCtrl',['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {
	$scope.rememberme = true;
	$scope.login = function() {
		Auth.login({
			username: $scope.username,
			password: $scope.password,
			rememberme: $scope.rememberme
		}, function(res) {
			$location.path('/');
		},function(err) {
			$rootScope.error = "Failed to login";
		});
	};
	$scope.loginOauth = function(provider) {
		$window.location.href = '/auth/' + provider;
	};
}]);

angular.module('playground').controller('HomeCtrl',['$rootScope', '$scope', function($rootScope, $scope) {
	$scope.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
}]);

angular.module('playground').controller('RegisterCtrl',['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
	$scope.role = Auth.userRoles.user;
	$scope.userRoles = Auth.userRoles;
	$scope.register = function() {
		Auth.register({
			username: $scope.username,
			password: $scope.password,
			email: $scope.email,
			role: $scope.role
		},
		function() {
			$location.path('/');
		},
		function(err) {
			$rootScope.error = err;
		});
	};
}]);

angular.module('playground').controller('PrivateCtrl',['$rootScope', function($rootScope) {

}]);

angular.module('playground').controller('AdminCtrl',['$rootScope', '$scope', 'Users', 'Auth', function($rootScope, $scope, Users, Auth) {
	$scope.loading = true;
	$scope.userRoles = Auth.userRoles;
	Users.getAll(function(res) {
		$scope.users = res;
		$scope.loading = false;
	}, function(err) {
		$rootScope.error = "Failed to fetch users.";
		$scope.loading = false;
	});
}]);

angular.module('playground').controller('PlaceCtrl',['$rootScope', '$scope', '$location', 'Place', 'Auth', function($rootScope, $scope, $location, Place, Auth) {
	$scope.loading = true;
	$scope.userRoles = Auth.userRoles;
	$scope.addPlace = function() {
		Place.createPlace({
			name: $scope.name,
			long: $scope.long,
			lat: $scope.lat
		}, function() {
			//for some reason I can't go back to this page
			$location.path('/');
		}, function(err) {
			$rootScope.error = err;
		});
	};
	Place.getAllPlaces(function(res) {
		$scope.places = res.res;
		$scope.loading = false;
	}, function(err) {
		$rootScope.error = "Failed to fetch places.";
		$scope.loading = false;
	});
}]);

angular.module('playground').controller('PlaceMapCtrl',['$rootScope', '$scope', '$location', 'Place', 'Auth', function($rootScope, $scope, $location, Place, Auth) {
	$scope.loading = true;
	$scope.userRoles = Auth.userRoles;
	angular.extend($scope, {
		columbus: {
			lat: 39.959850,
			lng: -83.00716,
			zoom: 11
		},
		markers: {}
	});
	Place.getAllPlaces(function(res) {
		$scope.places = res.res;
		$scope.loading = false;

		var markersContents = {};
		for (var i = 0; i <= res.res.length-1; i++) {
			var placement = 'm'+(i+1),
				contents = {
					lat: res.res[i].location.coordinates[0],
					lng: res.res[i].location.coordinates[1],
					message: res.res[i].name
				};
			markersContents[placement]= contents;
		};

		$scope.addMarkers = function() {
			angular.extend($scope, {
				markers: markersContents
			});
		};

		$scope.addMarkers();
	}, function(err) {
		$rootScope.error = "Failed to fetch places.";
		$scope.loading = false;
	});
}]);

angular.module('playground').controller('MapTestCtrl',['$rootScope', '$scope', function($rootScope, $scope) {
	angular.extend($scope, {
		london: {
			lat: 51.505,
			lng: -0.09,
			zoom: 4
		},
		markers: {}
	});
	$scope.addMarkers = function() {
		angular.extend($scope, {
			markers: {
				m1: {
					lat: 51.505,
					lng: -0.09,
					message: "I'm a static marker",
				},
				m2: {
					lat: 51,
					lng: 0,
					focus: true,
					message: "Hey, drag me if you want",
					draggable: true
				}
			}
		});
	};
	$scope.removeMarkers = function() {
		$scope.markers = {};
	}
	$scope.addMarkers();
}]);



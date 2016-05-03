var app = angular.module('profileHome', []);

app.controller('profHomeController', function($scope, $http, $window) {
	var username = JSON.parse($window.sessionStorage["username"]);
	var password = JSON.parse($window.sessionStorage["password"]);
	$scope.emailid = username;
	$scope.gender = "";
	
	$http({
		method : 'POST',
		url : '/login',
		data : {
			"username" : username,
			"password" : password
		}
	}).success(function(res) {
		$scope.firstname = res.firstname;
		$scope.lastname = res.lastname;
		$scope.emailid = res.emailid;
		$scope.gender = res.gender;		
		console.log($scope.firstname + " " + $scope.lastname);
	}).error(function(error) {
		console.log(error);
	});

//	$scope.$apply();
	$scope.profile = function() {		
		$http({
			method : 'GET',
			url : '/profile',
		}).success(function(response) {
			$window.location.assign('/profile');
		}).error(function(error) {
			console.log(error);
		});
	};
	
	$scope.home = function() {		
		$http({
			method : 'GET',
			url : '/home',
		}).success(function(response) {
			$window.location.assign('/home');
		}).error(function(error) {
			console.log(error);
		});
	};

	$scope.logout = function() {
		$http({
			method : 'GET',
			url : '/',
		}).success(function(response) {
			$window.location.assign('/');
		}).error(function(error) {
			console.log(error);
		});
	}
});
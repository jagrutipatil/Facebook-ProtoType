var app = angular.module('facebook', []);

app.controller("fbController", fbController);

fbController.$inject = [ '$scope', '$http', '$window' ];
function fbController($scope, $http, $window) {
	var gender;
	
	$scope.login = function() {
		$http({
			method : 'POST',
			url : '/login',
			data : {
				"username" : $scope.username,
				"password" : $scope.password
			}
		}).success(function(response) {
			if (response.result != "error") {
				$http({
					method : 'GET',
					url : '/home',
					data : {
						"username" : $scope.username,
						"password" : $scope.password
					}
				}).success(function(response) {
	                $window.sessionStorage["username"]=JSON.stringify($scope.username);
	                $window.sessionStorage["password"]=JSON.stringify($scope.password);
					$window.location.assign('/home');				
				}).error(function(error) {
					console.log(error)
				});
			} else {
				alert("Invalid username/password");
				$scope.username = "";
				$scope.password = "";
			}			
		}).error(function(error) {
			console.log(error);
		});
	};
	
	$scope.setGender = function(gendr) {
		gender = gendr;
		console.log("Value of Gender:" + gender);
	};
	
	$scope.signup = function() {				
		$http({
			method : 'POST',
			url : '/signup',
			data : {
				"username" : $scope.susername,
				"password" : $scope.spassword,
				"firstname": $scope.firstname,
				"lastname" : $scope.lastname,
				"gender"   : gender
  			}
		}).success(function(response) {
			if (response.result != "error") {
				$http({
					method : 'GET',
					url : '/home',
					data : {
						"username" : $scope.susername,
						"password" : $scope.spassword
						}
				}).success(function(response) {
					$window.sessionStorage["username"]=JSON.stringify($scope.susername);
	                $window.sessionStorage["password"]=JSON.stringify($scope.spassword);
					$window.location.assign('/home');
				}).error(function(error) {
					console.log(error);
				});
			} else {
				alert("User with same email id already exists");
				$scope.susername = "";
				$scope.spassword = "";
				$scope.firstname = "";
				$scope.lastname = "";
			}
			
		}).error(function(error) {
			console.log(error);
		});
	};
}
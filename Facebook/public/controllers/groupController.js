var app = angular.module('group', []);

app.controller('groupController', function($scope, $http, $window) {
	var grpName = JSON.parse($window.sessionStorage["grpName"]);
	var username = JSON.parse($window.sessionStorage["username"]);
	var groupList = [];	
	var memberList = [];	
	var userList = [];
	var members = [];
	$scope.grpName = grpName;
	$scope.groupList = groupList;
	$scope.userList = userList;
	$scope.memberList = memberList;
	$scope.members = members;
	
	function user(fName, lName, uname, makevisible) {		
		this.fName = fName;
		this.lName = lName;
		this.uname = uname;
		this.makevisible = makevisible;
	}
	
	$scope.getGroup = function () {
		$http({
			method : 'POST',
			url : '/getGroup',
			data : {
				"grpname" : grpName
			}
		}).success(function(res) {
			$scope.grp_desc = res.grp_desc;
			$scope.gowner = res.grp_owner;
			$scope.members = res.members.split(",");
		}).error(function(error) {
			console.log(error);
		});
	}
	
	$scope.getGroupMembers = function () {		
		$scope.memberList = [];
		for (var i = 0; i < $scope.userList.length; i++) {
			for (var j = 0; j < $scope.members.length; j++) {
				if ($scope.members[j] == $scope.userList[i].uname) {
					$scope.memberList.push(new user($scope.userList[i].fName, $scope.userList[i].lName, $scope.userList[i].uname, true));
				}
			} 
		}
	}

	$scope.getAllUsers = function() {
		$scope.userList = [];		
		$http({
			method : 'POST',
			url : '/getAllUsers',
		}).success(function(response) {		
			var row;			
			for (var i = 0 ; i < response.length ; i++) {
				row = response[i];
				makevisible = true;
				for (var j = 0; j < $scope.members.length; j++) {
					if ($scope.members[j] == row.uname) {
						makevisible = false;
						break;
					} 
				}
				$scope.userList.push(new user(row.fName, row.lName, row.uname, makevisible));
			}
			console.log("Got all users");
		}).error(function(error) {
			console.log(error);
		});
	}
	

	$scope.addToGroup = function(member) {				 
		$http({
			method : 'POST',
			url : '/addToGroup',
			data : {
				"username" : member,
				"groupName": grpName,				
			}
		}).success(function(response) {
			$scope.getGroup();
			$scope.getAllUsers();	
			$scope.getGroupMembers();
			console.log("Added to the Group: " + grpName);			
		}).error(function(error) {
			console.log(error);
		});
	}

	
	$scope.deleteFromGroup = function(member) {				 
		$http({
			method : 'POST',
			url : '/deleteFromGroup',
			data : {
				"member" : member,
				"groupName": grpName,				
			}
		}).success(function(response) {
			$scope.getGroup();
			$scope.getAllUsers();
			$scope.getGroupMembers();
		}).error(function(error) {
			console.log(error);
		});
	}
	
	$scope.getGroup();
	$scope.getAllUsers();
});

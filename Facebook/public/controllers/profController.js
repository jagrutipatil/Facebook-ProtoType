var app = angular.module('profile', []);

app.controller('profController', function($scope, $http, $window) {

	var username = JSON.parse($window.sessionStorage["username"]);
	var password = JSON.parse($window.sessionStorage["password"]);
	$scope.emailid = username;
	var userList = [];
	var friendList = [];
	var groupList = [];
	var ownedgroupList = [];
	var friends = [];
	var addFriends = [];
	var friendReqs = [];
	var friendReqsSent = [];
	var recevFriendReqs = [];

	$scope.addFriends = addFriends;
	$scope.recevFriendReqs = recevFriendReqs;
	$scope.userList = userList;
	$scope.friendList = friendList;
	$scope.groupList = groupList;
	$scope.ownedgroupList = ownedgroupList;

	function item(grpname, descr, makevisible) {
		this.grpname = grpname;
		this.descr = descr;
		this.makevisible = makevisible;
	}

	function user(fName, lName, uname) {
		this.fName = fName;
		this.lName = lName;
		this.uname = uname;
	}

	function afriend(fName, lName, uname, makevisible) {
		this.fName = fName;
		this.lName = lName;
		this.uname = uname;
		this.makevisible = makevisible;
	}	

	$scope.getUser = function() {
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
			$scope.phoneno = res.phoneno;
			$scope.work = res.work;
			$scope.education = res.education;
			if (res.gender == 'F') {
				$scope.gender = "Female";
			} else {
				$scope.gender = "Male";
			}
			friends = [];
			friendsReqs = [];
			friendReqsSent = [];

			if (res.friends != null && res.friends != "") {
				friends = res.friends.split(",");
			}
			if (res.friendReqs != null && res.friendReqs != "") {
				friendReqs = res.friendReqs.split(",");
			}
			if (res.friendReqsSent != null && res.friendReqsSent != "") {
				friendReqsSent = res.friendReqsSent.split(",");
			}
			$scope.getAllFriends();
		}).error(function(error) {
			console.log(error);
		});
	}

	$scope.getAllUsers = function() {
		$http({
			method : 'POST',
			url : '/getAllUsers',
		}).success(function(response) {
			var row;
			for (var i = 0; i < response.length; i++) {
				row = response[i];
				$scope.userList.push(new user(row.fName, row.lName, row.uname));
			}
			console.log("Got all users");
		}).error(function(error) {
			console.log(error);
		});
	}
	
	$scope.getRecvFriendRequests = function() {
		var found = 0;
		$scope.recevFriendReqs = [];
		$scope.getUser();
		console.log("In get all functions");
		for (var i = 0; i < userList.length; i++) {			
			for (var k = 0; k < friendReqs.length; k++) {
				if (friendReqs[k] != null && userList[i].uname != null && userList[i].uname != "" && friendReqs[k] != "" && (friendReqs[k] == userList[i].uname)) {
					$scope.recevFriendReqs.push(new afriend(userList[i].fName, userList[i].lName, userList[i].uname));
				}				
			}
		}
	}

	$scope.getAllFriends = function() {
		$scope.friendList = [];
		
		for (var i = 0; i < userList.length; i++) {						
				for (var j = 0; j < friends.length; j++) {
					if (friends[j] != null && userList[i].uname != null && userList[i].uname != "" && friends[j] != "" && (friends[j] == userList[i].uname)) {
						$scope.friendList.push(new user(userList[i].fName, userList[i].lName, userList[i].uname));
					}
				}					
		}
	}
	
	$scope.getAlladdFriend = function() {
		var found = 0;
		$scope.addFriends = [];		
		$scope.getUser();
		$scope.getRecvFriendRequests();
		console.log("In get all functions");
		for (var i = 0; i < userList.length; i++) {
			found = 0;
			if (userList[i].uname == username) {
				found = 1;
			} else {
				if (friends.length == 0 && friendReqs.length == 0 && friendReqsSent.length == 0) {
					$scope.addFriends.push(new afriend(userList[i].fName, userList[i].lName, userList[i].uname, true));
				} else {
					for (var j = 0; j < friends.length && found == 0; j++) {
						if (friends[j] != null && userList[i].uname != null && userList[i].uname != "" && friends[j] != "" && (friends[j] == userList[i].uname)) {
							found = 1;
							break;
						}
					}

					for (var m = 0; m < friendReqsSent.length && found == 0; m++) {
						if (friendReqsSent[m] != null && userList[i].uname != null && userList[i].uname != "" && friendReqsSent[m] != "" && (friendReqsSent[m] == userList[i].uname)) {
							found = 1;
							break;
						}
					}

					if (found == 0) {
						$scope.addFriends.push(new afriend(userList[i].fName, userList[i].lName, userList[i].uname, true));
					}
				}

			}
		}
	}
	
	$scope.acceptFriendReq = function(friendReq) {
		$http({
			method : 'POST',
			url : '/acceptFriendRequest',
			data : {
				"username" : username,
				"friendReqRecv" : friendReq,
			}
		}).success(function(response) {
//			for (var j = 0; j < $scope.recevFriendReqs.length; j++) {
//				if ($scope.recevFriendReqs[j] == friendReq) {
//					$scope.recevFriendReqs[j].makevisible = false;
//					break;
//				}
//			}
			alert("Accepted Friend Request");
			$scope.getAlladdFriend();
			console.log("Sent friend request to: " + friendReq);

		}).error(function(error) {
			console.log(error);
		});
	}

	$scope.sendFriendRequest = function(friendReq) {
		$http({
			method : 'POST',
			url : '/sendFriendRequest',
			data : {
				"username" : username,
				"friendReqSent" : friendReq,
			}
		}).success(function(response) {
			for (var j = 0; j < $scope.addFriends.length; j++) {
				if ($scope.addFriends[j] == friendReq) {
					$scope.addFriends[j].makevisible = false;
					break;
				}
			}
			alert("Sent Friend Request to " + friendReq);
			$scope.getAlladdFriend();
			console.log("Sent friend request to: " + friendReq);

		}).error(function(error) {
			console.log(error);
		});
	}

	$scope.signout = function() {
		$http({
			method : 'POST',
			url : '/logout',
		}).success(function(response) {
			$http({
				method : 'GET',
				url : '/afterlogout'
			}).success(function(response) {
				$window.location.assign('/afterlogout');
			}).error(function(error) {
				console.log(error);
			});
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

	$scope.profile = function() {
		$http({
			method : 'GET',
			url : '/profile',
		}).success(function(res) {
			$scope.firstname = res.firstname;
			$scope.lastname = res.lastname;
			$scope.emailid = res.emailid;
			$scope.gender = res.gender;

			if (res.friends != null && res.friends != "") {
				$scope.friends = res.friends.split(",");
			}
			if (res.friendReqs != null && res.friendReqs != "") {
				$scope.friendReqs = res.friendReqs.split(",");
			}
			if (res.friendReqsSent != null && res.friendReqsSent != "") {
				$scope.friendReqsSent = res.friendReqsSent.split(",");
			}
			$window.location.assign('/profile');
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

	$scope.goToGroup = function(grpName) {
		$window.sessionStorage["grpName"] = JSON.stringify(grpName);
		$http({
			method : 'GET',
			url : '/group'
		}).success(function(response) {
			$window.location.assign('/group');
		}).error(function(error) {
			console.log(error)
		});
	}

	$scope.addToGroup = function(grpName) {
		$http({
			method : 'POST',
			url : '/addToGroup',
			data : {
				"username" : username,
				"groupName" : grpName,
			}
		}).success(function(response) {
			console.log("Added to the Group: " + grpName);
			alert("Added to the Group: " + grpName);
		}).error(function(error) {
			console.log(error);
		});
	}

	$scope.getAllGroups = function() {
		$scope.groupList = [];
		$scope.ownedgroupList = [];
		$http({
			method : 'POST',
			url : '/getAllGroups',

		}).success(function(response) {
			var makevisible = false;
			var row;
			for (var i = 0; i < response.length; i++) {
				row = response[i];
				var members = response[i].members;
				if (username == row.gowner || (members != null) && (members.indexOf(username) > -1)) {
					makevisible = false;
				} else {
					makevisible = true;
				}
				if (row.gowner == username) {
					$scope.ownedgroupList.push(new item(row.grpname, row.descr, makevisible));
				}
				$scope.groupList.push(new item(row.grpname, row.descr, makevisible));
			}
		}).error(function(error) {
			console.log(error);
		});
	}

	$scope.create_Group = function() {
		$window.sessionStorage["grpName"] = JSON.stringify($scope.grpName);
		$window.sessionStorage["grp_desc"] = JSON.stringify($scope.grp_desc);
		console.log("group name: " + $scope.grpName + " group description: " + $scope.grp_desc);
		$http({
			method : 'POST',
			url : '/createGroup',
			data : {
				"username" : username,
				"groupName" : $scope.grpName,
				"grp_desc" : $scope.grp_desc,
			}
		}).success(function(response) {
			$http({
				method : 'GET',
				url : '/group'
			}).success(function(response) {
				$window.location.assign('/group');
			}).error(function(error) {
				console.log(error)
			});
		}).error(function(error) {
			console.log(error);
		});
	}

	$scope.deleteGroup = function(grpName) {
		$http({
			method : 'POST',
			url : '/deleteGroup',
			data : {				
				"groupName" : grpName,				
			}
		}).success(function(response) {
			$scope.getAllGroups();
		}).error(function(error) {
			console.log(error);
		});
	}

	$scope.getUser();
	$scope.getAllUsers();
});

var ejs = require("ejs");
//var mySqlDb = require("./mysqldb");
var mySqlDb = require("./mysqlCP");

function getAllusers(req, res) {
	var sqlQuery = "SELECT * FROM testdb.users";
	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			if (rows.length > 0) {
				console.log(rows);	
				res.send(JSON.stringify(rows));				
			} else {
				res.send({"result":('Got All Users')});				
			}			
		}
	}, sqlQuery);	
}


function sendFriendRequest(req, res) {
	var error = false;
	var sqlQuery = "SELECT * FROM testdb.users WHERE uname='"+ req.param("username") +"'";
	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			if (rows.length > 0) {
				var friendReqsSent = rows[0].friendReqsSent;
				if (friendReqsSent == null || friendReqsSent == "") {
					friendReqsSent = req.param("friendReqSent");
				} else {
					friendReqsSent = friendReqsSent + "," + req.param("friendReqSent");
				}
				
				var updateQuery = "UPDATE testdb.users SET friendReqsSent ='" + friendReqsSent +"'"+ "WHERE uname='"+ req.param("username") +"'";
				mySqlDb.executeQuery(function(err, urows) {
					if (err) {
						err = true;
					}
				}, updateQuery);					
				
			} else {
				res.send({"result":('Couldnt not send friend request')});				
			}			
		}
	}, sqlQuery);	
	
	sqlQuery = "SELECT * FROM testdb.users WHERE uname='"+ req.param("friendReqSent") +"'";
	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			if (rows.length > 0) {
				var friendReqs = rows[0].friendReqs;
				if (friendReqs == null || friendReqs == "") {
					friendReqs = req.param("username");
				} else {
					friendReqs = friendReqs + "," + req.param("username");
				}
				
				var updateQuery = "UPDATE testdb.users SET friendReqs ='" + friendReqs +"'"+ "WHERE uname='"+ req.param("friendReqSent") +"'";
				mySqlDb.executeQuery(function(err, urows) {
					if (err) {
						error = true;
					}
				}, updateQuery);									
			}			
		}
		
		if (error) {
			res.send({"result":('friend request added')});
		} else {
			res.send({"result":('Couldnt not send friend request')});
		}
				
	}, sqlQuery);	

	
}

function acceptFriendRequest(req, res) {
	var error = false;
	var sqlQuery = "SELECT * FROM testdb.users WHERE uname='"+ req.param("username") +"'";
	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			if (rows.length > 0) {
				var friends = rows[0].friends;
				var freplaced = "";
				if (friends == null || friends == "") {
					friends = req.param("friendReqRecv");
				} else {
					friends = friends + "," + req.param("friendReqRecv");
				}				
				if (rows[0].friendReqs != null && rows[0].friendReqs != "") {
					var mReplace = rows[0].friendReqs;					
					freplaced = mReplace.replace(req.param("friendReqRecv") + ",", "");
					freplaced = mReplace.replace( "," + req.param("friendReqRecv"), "");
					freplaced = mReplace.replace(req.param("friendReqRecv"));
					if (freplaced == "undefined") {
						freplaced = "";
					}
				}
				
				var updateQuery = "UPDATE testdb.users SET friends ='" + friends +"' , friendReqs ='"+ freplaced +"' WHERE uname='"+ req.param("username") +"'";
				mySqlDb.executeQuery(function(err, urows) {
					if (err) {
						err = true;
					}
				}, updateQuery);					
				
			} else {
				res.send({"result":('Couldnt not send friend request')});				
			}			
		}
	}, sqlQuery);	
	
	sqlQuery = "SELECT * FROM testdb.users WHERE uname='"+ req.param("friendReqRecv") +"'";
	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			if (rows.length > 0) {
				var friends = rows[0].friends;
				var freplaced = "";
				if (friends == null || friends == "") {
					friends = req.param("username");
				} else {
					friends = friends + "," + req.param("username");
				}				
				if (rows[0].friendReqsSent != null && rows[0].friendReqsSent != "") {
					var mReplace = rows[0].friendReqsSent;
					freplaced = mReplace.replace(req.param("username") + ",", "");
					freplaced = mReplace.replace( "," + req.param("username"), "");
					freplaced = mReplace.replace(req.param("username"));
					if (freplaced == "undefined") {
						freplaced = "";
					}
				}
				
				var updateQuery = "UPDATE testdb.users SET friends ='" + friends +"' , friendReqsSent ='"+ freplaced +"' WHERE uname='"+ req.param("friendReqRecv") +"'";
				mySqlDb.executeQuery(function(err, urows) {
					if (err) {
						error = true;
					}
				}, updateQuery);									
			}			
		}
		
		if (error) {
			res.send({"result":('friend added')});
		} else {
			res.send({"result":('Couldnt not accept friend request')});
		}
				
	}, sqlQuery);	

	
}


exports.getAllusers = getAllusers;
exports.sendFriendRequest = sendFriendRequest;
exports.acceptFriendRequest = acceptFriendRequest;

var ejs = require("ejs");
var mySqlDb = require("./mysqldb");
//var mySqlDb = require("./mysqlCP");

//TODO Add owner of the group, so at the time of deleting only allow to delete those groups

function createGroup(req, res) {
	//create group in database on success save the table to database	
	var members = [req.param("username")];
	
	console.log("Group name: "+ req.param("groupName"));
	console.log("Group description: "+ req.param("grp_desc"));
	
	var sqlQuery = "INSERT INTO testdb.groups ( grpname, descr, gowner, members) VALUES ( '" + req.param("groupName") 
	+ "' , '" + req.param("grp_desc")  + "' , '" + req.param("username") +  "' , '" + members + "' )";

	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			res.send({"result":"Group Created"} );
		}
	}, sqlQuery);
}

function deleteGroup(req, res) {
	console.log("Group name: "+ req.param("groupName"));
	
	var sqlQuery = "DELETE FROM testdb.groups WHERE grpname='" + req.param("groupName") + "' ";

	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			res.send({"result":"Group deleted"} );
		}
	}, sqlQuery);
}


function group(req, res) {
	ejs.renderFile("./views/group.ejs", function(err, result) {
		if (!err) {							
			res.end(result);
		}
	});
}

function getGroup(req, res) {
	//create group in database on success save the table to database	
	var members = [req.param("grpname")];
	
	var sqlQuery = "SELECT * FROM testdb.groups WHERE grpname='"+ req.param("grpname") +"'";
	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			if (rows.length > 0) {
				console.log(rows[0].grpname + " " + rows[0].descr);
				res.send({"grpname": rows[0].grpname, "grp_desc": rows[0].descr, 
					"grp_owner": rows[0].gowner, "members" : rows[0].members} );				
			} else {
				res.send({"result":('Login Failed')});				
			}			
		}
	}, sqlQuery);	
}

function getAllGroups(req, res) {				
	var sqlQuery = "SELECT * FROM testdb.groups";
	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			if (rows.length > 0) {
				console.log(rows);	
				res.send(JSON.stringify(rows));				
			} else {
				res.send({"result":('Got All Groups')});				
			}			
		}
	}, sqlQuery);	
}

function addToGroup(req, res) {
	var sqlQuery = "SELECT * FROM testdb.groups WHERE grpname='"+ req.param("groupName") +"'";
	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			if (rows.length > 0) {
				var members = rows[0].members;
				members = members + "," + req.param("username");
				var updateQuery = "UPDATE testdb.groups SET  members='" + members +"'"+ "WHERE grpname='"+ req.param("groupName") +"'";
				mySqlDb.executeQuery(function(err, urows) {
					if (!err) {
						res.send({"result":('Added to the group sucessfully')});
					}
				}, updateQuery);					
			} else {
				res.send({"result":('Couldnt add to the group')});				
			}			
		}
	}, sqlQuery);	
}

function deleteFromGroup(req, res) {
	var sqlQuery = "SELECT * FROM testdb.groups WHERE grpname='"+ req.param("groupName") +"'";
	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			var mReplaced;
			if (rows.length > 0) {
				if(rows[0].members != null && rows[0].members != "") {
					var mReplace = rows[0].members;
					replaced = mReplace.replace(req.param("member") + ",", "");
					replaced = mReplace.replace( "," + req.param("member"), "");
				}								
				
				var updateQuery = "UPDATE testdb.groups SET members='" + replaced +"'"+ " WHERE grpname='"+ req.param("groupName") +"'";
				mySqlDb.executeQuery(function(err, urows) {
					if (!err) {
						res.send({"result":('Added to the group sucessfully')});
					}
				}, updateQuery);					
			} else {
				res.send({"result":('Couldnt add to the group')});				
			}			
		}
	}, sqlQuery);	
}


exports.createGroup = createGroup;
exports.group = group;
exports.getGroup = getGroup;
exports.getAllGroups = getAllGroups;
exports.addToGroup = addToGroup;
exports.deleteFromGroup = deleteFromGroup;
exports.deleteGroup = deleteGroup;
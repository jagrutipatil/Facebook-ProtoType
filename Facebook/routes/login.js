var ejs = require("ejs");
var mySqlDb = require("./mysqldb");
//var mySqlDb = require("./mysqlCP");

function home(req, res) {
	ejs.renderFile("./views/login.ejs", function(err, result) {
		if (!err) {
			res.end(result);
		}
	});
}


function signup(req, res) {

	var sqlQuery = "INSERT INTO testdb.users ( uname, password, fName, lName, gender) VALUES ( '" + req.param("username") 
	+ "' , '" + req.param("password") +  
	  "' , '" + req.param("firstname")  +
	  "' , '" + req.param("lastname") +
	  "' , '" + req.param("gender") +	  
			"' )";
	
//	birthDate = new Date(bArray[2], bArray[0]-1, bArray[1]);
//	var birthdate = new Date(req.param("bDateY"), req.param("bDateM"), req.param("bDateD"));
	
	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			console.log("Inserted into database");
			res.send({"result":('signup sucreccfully')});
		} else {
			res.send({"result":('error')});
		}
	}, sqlQuery);
}

function signin(req, res) {
	var username = req.param("username");
	var password = req.param("password");
	
	var sqlQuery = "SELECT * FROM testdb.users WHERE uname='"+ username+"' AND password='"+ password+"'";
	mySqlDb.executeQuery(function(err, rows) {
		if (!err) {
			if (rows.length > 0) {
				console.log(rows[0].fName + " " + rows[0].lName);
				res.send({"result":"Login Successfull", "firstname": rows[0].fName, 
					"lastname": rows[0].lName, 
					"gender": rows[0].gender,
					"phoneno": rows[0].phone,
					"work": rows[0].work,
					"education": rows[0].education,
					"friends" : rows[0].friends,
					"friendReqs" : rows[0].friendReqs,
					"friendReqsSent" : rows[0].friendReqsSent
					});				
			} else {
				res.send({"result":('error')});				
			}			
		}
	}, sqlQuery);

}


function profile(req, res) {
	ejs.renderFile("./views/profile.ejs", function(err, result) {
		if (!err) {			
			res.end(result);
		}
	});
}

function profileHome(req, res) {
	ejs.renderFile("./views/profileHome.ejs", function(err, result) {
		if (!err) {			
			res.end(result);
		}
	});
}


function logout(req, res) {
	//clear the session
	console.log("You are in logout");
	res.redirect('/afterlogout');
	res.send({"result":('Logout Successfull')});
}

function afterlogout(req, res) {
	console.log("You are in afterlogout");
	ejs.renderFile("./views/afterlogout.ejs", function(err, result) {
		if (!err) {
			console.log("No error- in afterlogout now");
			res.end(result);
		}
	});
}

exports.home = home;
exports.signup = signup;
exports.signin = signin;
exports.logout = logout;
exports.afterlogout = afterlogout;
exports.profile = profile;
exports.profileHome = profileHome;
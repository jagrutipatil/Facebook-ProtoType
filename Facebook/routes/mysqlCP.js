var ejs = require('ejs');
var mysql = require('mysql');

function getConnection() {
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'jagruti',
		database : 'testdb',
		port : 3306
	});
	return connection;
}

function DBPool(num_of_conn) {
	this.pool = [];
	for (var i = 0; i < num_of_conn; ++i)
		this.pool.push(getConnection());
	this.last = 0;
}

DBPool.prototype.get = function() {
	var cli = this.pool[this.last];
	this.last++;
	if (this.last == this.pool.length)
		this.last = 0;
	return cli;
}

var p = new DBPool(16);

function executeQuery(callback, sqlQuery) {	
	console.log("Query:" + sqlQuery);
		p.get().query(sqlQuery, function(err, rows, fields) {

			if (err) {
				console.log(err.message);
			} else {
				console.log("DB Data:" + rows);
				callback(err, rows);
			}
		});		
	}

exports.executeQuery = executeQuery;
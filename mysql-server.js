var app = require('express')(),
	Promise = require('bluebird'),
	config = require('./config.json'),
	db = require('mysql-promise')();

db.configure(config.mysql);

function getUser(token) {
	return db.query('SELECT * FROM users WHERE accessToken = ? LIMIT 1', [ token ]);
}

function insertAndGet() {
	var p = [];
	['foo', 'bar', 'la', 'bamba'].forEach(function (val) {
		p.push(db.query('INSERT INTO data SET value = ?', [val]));
	});

	return Promise.all(p).then(function () {
		return db.query('SELECT * FROM data WHERE value = ? OR value = ? LIMIT 10', ['foo', 'bar']).spread(function (rows) {
			return rows;
		});
	});
}

app.get('/', function (req, res) {
	getUser('foobar').then(insertAndGet).then(function (data) {
		res.send(data);
	});
});

var server = app.listen(3000, function () {
	console.log('listening at http://%s:%s', server.address().address, server.address().port);
});
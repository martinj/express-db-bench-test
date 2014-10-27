var app = require('express')(),
	Promise = require('bluebird'),
	monk = require('monk');

Promise.promisifyAll(monk.Collection.prototype);
var db = monk('localhost/bench');

function getUser(token) {
	return db.get('users').findOneAsync({ token: token });
}

function insertAndGet() {
	var p = [];
	['foo', 'bar', 'la', 'bamba'].forEach(function (val) {
		p.push(db.get('data').insertAsync({ value: val }));
	});

	return Promise.all(p).then(function () {
		return db.get('data').findAsync({
			$or: [{ value: 'foo'}, { value: 'bar' }]
		}, { limit: 10 });
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
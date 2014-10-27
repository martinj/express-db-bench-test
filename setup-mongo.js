var Promise = require('bluebird'),
	monk = require('monk'),
	hat = require('hat');

Promise.promisifyAll(monk.Collection.prototype);
var db = monk('localhost/bench');

db.get('users').dropAsync().catch(function () {}).then(function () {
	return db.get('data').dropAsync().catch(function () {});
}).then(function () {
	return db.get('users').indexAsync('accessToken');
}).then(function () {
	return db.get('data').indexAsync('value');
}).then(function () {
	var users = [];
	for (var i = 0 ; i < 1000 ; i++ ) {
		users.push({
			accessToken: i === 100 ? 'foobar' : hat(),
			name: hat()
		});
	}
	return db.get('users').insertAsync(users);
}).then(function () {
	console.log('done');
	process.exit(0);
}).catch(function (err) {
	console.log(err);
});

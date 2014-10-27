var r = require('rethinkdbdash')({ db: 'bench' }),
	hat = require('hat');

r.dbDrop('bench').run().then(function () {
	return r.dbCreate('bench').run();
}).then(function () {
	return r.tableCreate('users').run();
}).then(function () {
	return r.table('users').indexCreate('accessToken').run();
}).then(function () {
	var users = [];
	for (var i = 0 ; i < 1000 ; i++ ) {
		users.push({
			accessToken: i === 100 ? 'foobar' : hat(),
			name: hat()
		});
	}
	return r.table('users').insert(users).run();
}).then(function () {
	return r.tableCreate('data').run();
}).then(function () {
	return r.table('data').indexCreate('value').run();
}).then(function () {
	r.getPool().drain();
	console.log('done');
	process.exit(0);
}).catch(function (err) {
	console.log(err);
});

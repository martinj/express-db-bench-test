var Promise = require('bluebird'),
	config = require('./config.json'),
	db = require('mysql-promise')(),
	hat = require('hat');

db.configure(config.mysql);

var userTable =
	'CREATE TABLE `users` (' +
	'  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,' +
	'  `accessToken` varchar(32) DEFAULT NULL,' +
	'  `name` varchar(32) DEFAULT NULL,' +
	'  PRIMARY KEY (`id`),' +
	'  KEY `accesstoken_idx` (`accessToken`)' +
	') ENGINE=InnoDB DEFAULT CHARSET=utf8;';

var dataTable =
	'CREATE TABLE `data` (' +
	  '`id` int(11) unsigned NOT NULL AUTO_INCREMENT,' +
	  '`value` varchar(128) DEFAULT NULL,' +
	  'PRIMARY KEY (`id`),' +
	  'KEY `value_idx` (`value`)' +
	') ENGINE=InnoDB DEFAULT CHARSET=utf8;';


db.query('DROP TABLE IF EXISTS users').then(function () {
	return db.query('DROP TABLE IF EXISTS data');
}).then(function () {
	return db.query(userTable);
}).then(function () {
	return db.query(dataTable);
}).then(function () {
	var users = [];
	for (var i = 0 ; i < 1000 ; i++ ) {
		users.push(
			'(accessToken = \'' + (i === 100 ? 'foobar' : hat()) + '\',' +
			'name = \'' + hat() + '\')'
		);
	}
	return db.query('INSERT INTO users (`accessToken`, `name`) VALUES ' + users.join(','));
}).then(function () {
	console.log('done');
	process.exit(0);
}).catch(function (err) {
	console.log(err);
});

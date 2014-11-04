var cradle = require('cradle');
var hat = require('hat');
var Promise = require('bluebird');

Promise.promisifyAll(cradle.Database.prototype);

var usersDb = new (cradle.Connection)().database('bench_users');
var dataDb = new (cradle.Connection)().database('bench_data');

usersDb
    .destroyAsync()
    .then(dataDb.destroy(function() { return {}; }))
    .then(usersDb.create(function() { return {}; }))
    .then(function () {
        return usersDb.saveAsync('_design/user', {
            views: {
                byToken: {
                    map: function (doc) {
                        if (doc.accessToken) {
                            emit(doc.accessToken, doc);
                        }
                    }
                }
            }
        });
    })
    .then(dataDb.create(function() { return {}; }))
    .then(function () {
        return dataDb.saveAsync('_design/data', {
            views: {
                byValue: {
                    map: function (doc) {
                        if (doc.value) {
                            emit(doc.value, doc);
                        }
                    }
                }
            }
        });
    })
    .then(function () {
        var users = [];
        for (var i = 0; i < 1000; i++) {
            users.push({
                accessToken: i === 100 ? 'foobar' : hat(),
                name: hat()
            });
        }
        return usersDb.saveAsync(users);
    })
    .then(function () {
        console.log('done');
        process.exit(0);
    }).catch(function (err) {
        console.log(err);
    })
;

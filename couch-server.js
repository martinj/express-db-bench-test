var app = require('express')(),
    Promise = require('bluebird'),
    cradle = require('cradle');

Promise.promisifyAll(cradle.Database.prototype);

var usersDb = new (cradle.Connection)().database('bench_users');
var dataDb = new (cradle.Connection)().database('bench_data');

function getUser(token) {
    return usersDb.viewAsync('user/byToken', {key: token});
}

function insertAndGet() {
    var p = [];
    ['foo', 'bar', 'la', 'bamba'].forEach(function (val) {
        p.push(dataDb.saveAsync({value: val}));
    });

    return Promise.all(p)
        .then(function () {
            return dataDb.viewAsync('data/byValue', {keys: ['foo', 'bar'], limit: 10});
        });
}

/**
 * CouchDB also supports saving documents in batches. This gives 50-100% better
 * performance compared to async single documents saves.
 */
function insertAndGetBatch() {
    var docs = [];
    ['foo', 'bar', 'la', 'bamba'].forEach(function (val) {
        docs.push({value: val});
    });

    return dataDb.saveAsync(docs)
        .then(function () {
            return dataDb.viewAsync('data/byValue', {keys: ['foo', 'bar'], limit: 10});
        });
}

app.get('/', function (req, res) {
    getUser('foobar')
        .then(insertAndGet())
        .then(function (data) {
            res.send(data);
        });
});

var server = app.listen(3000, function () {
    console.log('listening at http://%s:%s', server.address().address, server.address().port);
});

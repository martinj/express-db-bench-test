A simple express app for benchmarking mongodb and rethinkdb database.
This is not supposed to be a very scientific test.

This benchmark should be seen as a simple vanilla style setup to see if the systems even look like they are in the same ballpark.


# Running the test

Setup db

	node setup-mongo.js

Start server

	node mongo-server.js

Run test e.g

	ab -n 1000 -c 10 http://127.0.0.1:3000/

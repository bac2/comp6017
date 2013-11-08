var express = require('express');
var app = express();

app.listen(1337, "0.0.0.0");

app.get('/', function( req, res ) {
	res.setHeader('Content-Type', 'text/plain');
	res.end("Hello from " + req.url);
});

app.get('/questions', function( req, res ) {
	res.setHeader('Content-Type', 'text/plain');
	res.end("QUESTIONS");
});
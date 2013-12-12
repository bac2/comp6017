var APIeasy = require("api-easy");
var assert = require("assert");

var suite = APIeasy.describe("question");

suite.discuss("questions");

suite.use("localhost", "1337")
	.setHeader("Content-Type", "application/json");

	suite.get("/")
	.expect(200)
	.expect("should respond with link to /questions", function (err, res, body) {
		var result = JSON.parse(body);
		assert.isNotNull(result._links);
		assert.isNotNull(result._links.question)
	})

	.get("/question")
	.expect(200)
	.expect("should return an array", function (err, res, body) {
		var result = JSON.parse(body);
		assert.isNotNull(result);
		assert.ok(result instanceof Array);
	})
	.next()

	.del("/question")
	.expect(204)
	.next()

	.get("/question")
	.expect(200)
	.expect("should be an empty array", function (err, res, body) {
		var result = JSON.parse(body);
		assert.ok(result instanceof Array);
		assert.equal(result.length, 0);
	})

//Get some empty things
	.get("/question/1")
	.expect(404)
	.get("/question/1/answer")
	.expect(404)
	.get("/question/1/comment")
	.expect(404)
	.get("/question/1/answer/1")
	.expect(404)
	.get("/question/1/comment/1")
	.expect(404)
	.get("/question/1/answer/1/comment")
	.expect(404)
	.get("/question/1/answer/1/comment/1")
	.expect(404)
	.next()

//Add a question
	.post("/question", {"question":{"title":"How many cats in Japan?", "body":"Please help"}})
	.expect(201)
	.expect("should contain a Location header", function (err, res, body) {
		assert.ok(res.headers.location, "/question/1");
	})
	.next()

	//Get some less empty things
	.get("/question/1")
        .expect(200)
	.expect("should be a single item array", function (err, res, body) {
		var result = JSON.parse(body);
		assert(result.id, 1);
	})
	.get("/question/1/answer")
        .expect(200)
	.expect("should be an empty array", function (err, res, body) {
		var result = JSON.parse(body);
		assert.ok(result instanceof Array);
		assert.equal(result.length, 0);
	})
	.get("/question/1/comment")
        .expect(200)
	.expect("should be an empty array", function (err, res, body) {
		var result = JSON.parse(body);
		assert.ok(result instanceof Array);
		assert.equal(result.length, 0);
	})
	.get("/question/1/answer/1")
        .expect(404)
	.get("/question/1/comment/1")
        .expect(404)
	.get("/question/1/answer/1/comment")
        .expect(404)
	.next()

	//Add a comment
	.post("/question/1/comment", {"comment":{"comment":"Good question..."}})
	.expect(201)
	.expect("should contain a Location header", function (err, res, body) {
		assert.ok(res.headers.location, "/question/1/comment/1");
	})
	.next()
	//Get the new comment
	.get("/question/1/comment/1")
        .expect(200)
	.expect("comment should be visible", function (err, res, body) {
		var result = JSON.parse(body);
		assert.equal(result.id, 1);
	})
	.get("/question/1/comment")
	.expect(200)
	.expect("should have one comment in array", function (err, res, body) {
		var result = JSON.parse(body);
		assert.ok(result instanceof Array);
		assert.equal(result.length, 1);
	})
	.next()
	//Add an answer
	.post("/question/1/answer", {"answer":{"answer":"Several hundred"}})
	.expect(201)
	.expect("should contain a Location header", function (err, res, body) {
		assert.ok(res.headers.location, "/question/1/answer/1");
	})
	.next()
	//Get the new answer
	.get("/question/1/answer/1")
	.expect(200)
	.expect("answer should be visible", function (err, res, body) {
		var result = JSON.parse(body);
		assert.equal(result.id, 1);
	})
	.get("/question/1/answer")
	.expect(200)
	.expect("should have one comment in array", function (err, res, body) {
		var result = JSON.parse(body);
		assert.ok(result instanceof Array);
		assert.equal(result.length, 1);
	})
	.next()

	//Add a comment to the answer
	.post("/question/1/answer/1/comment", {"comment":{"comment":"Good answer..."}})
	.expect(201)
	.expect("should contain a Location header", function (err, res, body) {
		assert.ok(res.headers.location, "/question/1/answer/1/comment/1");
	})
	.next()
	.get("/question/1/answer/1/comment/1")
	.expect(200)
	.expect("comment should be visible", function (err, res, body) {
		var result = JSON.parse(body);
		assert.equal(result.id, 1);
	})
	.get("/question/1/answer/1/comment")
	.expect(200)
	.expect("should have one comment in array", function (err, res, body) {
		var result = JSON.parse(body);
		assert.ok(result instanceof Array);
		assert.equal(result.length, 1);
	})
	.next()
	
	//Check some 304's
	.setHeader("If-Modified-Since", 'Sun, 01 Jan 2012 00:00:00 GMT')
	.get("/question/1")
	.expect(200)
	.expect("should return as normal", function (err, res, body) {
		var result = JSON.parse(body);
		assert.equal(result.id, 1)
	})
	.get("/question")
	.expect(200)
	.expect("should return as normal", function (err, res, body) {
		var result = JSON.parse(body);
		assert.ok(result instanceof Array);
	})
	.setHeader("If-Modified-Since", 'Thu, 01 Jan 2015 00:00:00 GMT')
	.get("/question/1")
	.expect(304)
	.get("/question")
	.expect(304)
	.next()

	//Check some HEADS
	.removeHeader("If-Modified-Since")
	.head("/question")
	.expect(200)
	.expect("should have no body", function (err, res, body) {
		assert.strictEqual(body, '');
	})
	.head("/question/1")
	.expect(200)
	.expect("should have no body", function (err, res, body) {
		assert.strictEqual(body, '');
	})
	.head("/question/1/answer")
	.expect(200)
	.expect("should have no body", function (err, res, body) {
		assert.strictEqual(body, '');
	})
	.head("/question/1/comment")
	.expect(200)
	.expect("should have no body", function (err, res, body) {
		assert.strictEqual(body, '');
	})
	.head("/question/1/comment/1")
	.expect(200)
	.expect("should have no body", function (err, res, body) {
		assert.strictEqual(body, '');
	})
	.head("/question/1/answer/1")
	.expect(200)
	.expect("should have no body", function (err, res, body) {
		assert.strictEqual(body, '');
	})
	.head("/question/1/answer/1/comment")
	.expect(200)
	.expect("should have no body", function (err, res, body) {
		assert.strictEqual(body, '');
	})
	.head("/question/1/answer/1/comment/1")
	.expect(200)
	.expect("should have no body", function (err, res, body) {
		assert.strictEqual(body, '');
	})
	.next();

//Add then delete a question twice
suite.post("/question", {'question':{ 'body':"Where am I?", 'title':'I am lost'}})
	.expect(201)
	.del("/question/2")
	.expect(204)
	.del("/question/2")
	.expect(404)

suite.export(module);

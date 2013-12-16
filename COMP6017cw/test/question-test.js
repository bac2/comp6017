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
        assert.isNotNull(result._links.question);
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
    .post("/question", {"question": {"title": "How many cats in Japan?", "body": "Please help"}})
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
    .post("/question/1/comment", {"comment": {"comment": "Good question..."}})
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
    .post("/question/1/answer", {"answer": {"answer": "Several hundred"}})
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
    .post("/question/1/answer/1/comment", {"comment": {"comment": "Good answer..."}})
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
        assert.equal(result.id, 1);
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
suite.post("/question", {'question': { 'body': "Where am I?", 'title': 'I am lost'}})
    .expect(201)
    .next()
    .del("/question/2")
    .expect(204)
    .next()
    .del("/question/2")
    .expect(404)
    .next()

    //Check that a new question re-uses id 2
    .setHeader("content-type", "text/html")
    .post("/question", {'question': { 'title': 'I am lost', 'body': "Where am I?"}})
    .expect(415)
    .setHeader("content-type", "application/json")
    .post("/question", {'malformed': { 'title': 'I am lost', 'body': "Where am I?"}})
    .expect(400)
    .setHeader("content-type", "application/json")
    .post("/question", {'question': { 'title': 'I am lost'}})
    .expect(400)
    .setHeader("content-type", "application/json")
    .post("/question", {'question': { 'body': "Where am I?"}})
    .expect(400)
    .next()

    //Test some puts
    .post("/question", {'question': { 'body': "Where am I?", 'title': 'I am lost'}})
    .expect(201)
    .next()
    .put("/question/2", {'question': {'body' : 'Who am I?'}})
    .expect(200)
    .next()
    .get("/question/2")
    .expect(200)
    .expect("body should be 'who am I?'", function (err, res, body) {
        var result = JSON.parse(body);
        assert.equal(result.body, 'Who am I?');
    })
    .put("/question/200", {'question': {'body': 'Who am I?'}})
    .expect(404)
    .next()
    //Put some answers
    .post("/question/2/answer", {'answer_wrong': {'answer': "Use a map?"}})
    .expect(400)
    .post("/question/2/answer", {'answer': {'answer': "Use a map?"}})
    .expect(201)
    .next()
    .put("/question/2/answer/2", {'answer': {'answer': "Use a compass?"}})
    .expect(200)
    .next()
    .get("/question/2/answer/2")
    .expect(200)
    .expect("should have a body involving a compass", function (err, res, body) {
        var result = JSON.parse(body);
        assert.equal(result.answer, "Use a compass?");
    })
    .next()

    //Put some Q comments
    .del("/question/2/comment")
    .expect(204)
    .next()
    .post("/question/2/comment", {'comment_wrong': {'comment': "I like your lostness"}})
    .expect(400)
    .post("/question/2/comment", {'comment': {'comment': "I like your lostness"}})
    .expect(201)
    .next()
    .put("/question/2/comment/2", {'comment': {'comment': "I love your lostness"}})
    .expect(200)
    .next()
    .get("/question/2/comment/2")
    .expect(200)
    .expect("should have a body involving love", function (err, res, body) {
        var result = JSON.parse(body);
        assert.equal(result.comment, "I love your lostness");
    })
    .next()
    .del("/question/2/comment/2")
    .expect(204)
    .next()
    .del("/question/2/comment/2")
    .expect(404)
    .next()

    //Put some A comments
    .del("/question/2/answer/2/comment")
    .expect(204)
    .next()
    .post("/question/2/answer/2/comment", {'comment_wrong': {'comment': "I don't own a map"}})
    .expect(400)
    .next()
    .post("/question/2/answer/2/comment", {'comment': {'comment': "I don't own a map"}})
    .expect(201)
    .next()
    .put("/question/2/answer/2/comment/2", {'comment': {'comment': "I don't own a compass"}})
    .expect(200)
    .next()
    .get("/question/2/answer/2/comment/2")
    .expect(200)
    .expect("should have a body involving love", function (err, res, body) {
        var result = JSON.parse(body);
        assert.equal(result.comment, "I don't own a compass");
    })
    .next()
    .del("/question/2/answer/2/comment/2")
    .expect(204)
    .next()
    .del("/question/2/answer/2/comment/2")
    .expect(404)
    .next()

    //Delete the answer...
    .del("/question/2/answer/2")
    .expect(204)
    .next()
    .del("/question/2/answer/2")
    .expect(404)
    .next()

    //Put some posts, post some puts
    .put("/question", {'question': {'title': "How old am I?", 'body': "I don't know how to know"}})
    .expect(405)
    .post("/question/1", {'question': {'title': "How old am I?", 'body': "I don't know how to know"}})
    .expect(405)
    .put("/question/1/answer", {'answer': {'answer': "Start counting"}})
    .expect(405)
    .post("/question/1/answer/1", {'answer': {'answer': 'Start counting'}})
    .expect(405);

suite.export(module);
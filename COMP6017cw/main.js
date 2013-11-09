var express = require('express'),
	orm = require('orm');
	
var app = express();

app.use(orm.express("sqlite://../database/sqlite.db", {
	define: function (db, models, next) {
		db.load("./models.js", function(err) {
			models.question = db.models.question;
			models.answer = db.models.answer;
			next();
		});
	}
}));

app.use(express.urlencoded());
app.use(express.json());

app.listen(1337, "0.0.0.0");

app.get('/', function( req, res ) {
	res.setHeader('Content-Type', 'text/plain');
	res.end("Hello from " + req.url);
});

app.get('/question', function( req, res ) {
	res.setHeader('Content-Type', 'text/plain');
	req.models.question.find([ "vote", "Z" ], function (err, questions) {
		// SQL: SELECT q.id, q.question, q.vote FROM Question q ORDER BY q.vote DESC
		for (q in questions){
			res.write("id: " + questions[q].id + "\n");
			res.write("question: " + questions[q].question + "\n");
			res.write("votes: " + questions[q].vote + "\n\n");
		}
		res.end();
	});
});

app.get('/question/:qid', function( req, res ) {
	res.setHeader('Content-Type', 'text/plain');
	req.models.question.find({ id : req.params.qid }, function (err, questions) {
		// SQL: SELECT q.id, q.question, q.vote FROM Question q WHERE q.id = id
		for (q in questions){
			res.write("id: " + questions[q].id + "\n");
			res.write("question: " + questions[q].question + "\n");
			res.write("votes: " + questions[q].vote + "\n\n");
		}
		res.end();
	});
});

app.get('/question/:qid/answer', function( req, res ) {
	res.setHeader('Content-Type', 'text/plain');
	req.models.answer.find({ question_id : req.params.qid }, [ "vote", "Z" ], function (err, answers) {
		//SQL: SELECT a.id, a.question_id, a.answer, a.vote FROM Answer a WHERE a.question_id = qid
		for (a in answers){
			res.write("question id: " + answers[a].question_id + "\n");
			res.write("id: " + answers[a].id + "\n");
			res.write("answer: " + answers[a].answer + "\n");
			res.write("votes: " + answers[a].vote + "\n\n");
		}
		res.end();
	});
});

app.get('/question/:qid/answer/:aid', function( req, res ) {
	res.setHeader('Content-Type', 'text/plain');
	req.models.answer.find({ id : req.params.aid, question_id : req.params.qid }, function (err, answers) {
		//SQL: SELECT a.id, a.question_id, a.answer, a.vote FROM Answer a WHERE a.question_id = qid AND a.id = aid
		for (a in answers){
			res.write("question id: " + answers[a].question_id + "\n");
			res.write("id: " + answers[a].id + "\n");
			res.write("answer: " + answers[a].answer + "\n");
			res.write("votes: " + answers[a].vote + "\n\n");
		}
		res.end();
	});
});
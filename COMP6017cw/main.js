/*jslint node: true */
"use strict";
var express = require('express'),
    orm = require('orm');

var app = express();

app.use(orm.express("sqlite://../database/sqlite.db", {
    define: function (db, models, next) {
        db.load("./models.js", function (err) {
            if (typeof err !== 'undefined') {
                console.error(err);
            }
            models.question = db.models.question;
            models.answer = db.models.answer;
            next();
        });
    }
}));

app.use(express.urlencoded());
app.use(express.json());

app.listen(1337, "0.0.0.0");

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var obj = {'_links': {'question':'/question'}};
    res.end(JSON.stringify(obj) + "\n");
});


// /question methods
app.get('/question', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.models.question.find([ "vote", "Z" ], function (err, questions) {
        // SQL: SELECT q.id, q.question, q.vote FROM Question q ORDER BY q.vote DESC
        var q,
            array = [];
        if (typeof err !== 'undefined') {
            console.error(err);
        }
        for (q = 0; q < questions.length; q = q + 1) {
            questions[q]['_links'] = {question: "/question/" + questions[q].id + "/", answer: "/question/" + questions[q].id + "/answer/", comment: "/question/" + questions[q].id + "/comment/"};
            array.push(questions[q]);
        }
        res.write(JSON.stringify(array) + "\n");
        res.end();
    });
});

app.post("/question", function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	req.models.question.create([
	    {
	        question: req.param("question"),
	        vote: 0
	    }
    ], function (err, items) {
		var i;
        if (typeof err !== 'undefined') {
            console.error(err);
        }
        for( i = 0; i < items.length; i = i + 1) {
        	var item = items[i];
        	res.status(201);
        	res.setHeader("Location", "/question/"+ item['id']);
        	res.end();
        }
	});
});

app.del("/question", function (req, res) {
	req.models.question.find().remove(function (err) {
		if (err) {
			res.status(500);
		}
		res.status(200);
		res.end();
	});
});

app.get('/question/:qid', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.models.question.get(req.params.qid, function (err, question) {
        // SQL: SELECT q.id, q.question, q.vote FROM Question q WHERE q.id = id
        if (err || typeof question === 'undefined') {
        	res.status(404);
        	res.end();
        	return;
        }
        question['_links'] = {answer: "/question/" + question.id + "/answer/", comment: "/question/" + question.id + "/comment/"};
    	res.write(JSON.stringify(question) + "\n");
    	res.end();
    });
});


app.del("/question/:qid", function (req, res) {
	req.models.question.get(req.params.qid, function (err, question) {
		if (err || typeof question === 'undefined') {
			res.status(404);
			res.end();
			return;
		}
		question.remove(function (err) {
			if (err) {
				res.status(500);
			}
			res.status(200);
		});
		res.end();
	});
	req.models.answer.find({ question_id : req.params.qid }).remove(function (err){
		if (err){
			res.status(500);
		}
	});
});

app.put("/question/:qid", function (req, res) {
	req.models.question.get(req.params.qid, function(err, questions) {
		if (req.param("question")) {
			questions.question = req.param("question");
		}
		if (req.param("vote")) {
			questions.vote = req.param("vote");
		}
		
		questions.save(function (err) {
			if (err){
	        	console.log(err);
	            res.status(404);
	            res.end();				
			}
	        res.status(200);
	        res.end();
		});
	});
});

app.get('/question/:qid/answer', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.models.answer.find({ question_id : req.params.qid }, [ "vote", "Z" ], function (err, answers) {
        //SQL: SELECT a.id, a.question_id, a.answer, a.vote FROM Answer a WHERE a.question_id = qid
        var a,
            array = [];
        if (err || typeof answers === 'undefined') {
            console.error(err);
        }
        for (a = 0; a < answers.length; a = a + 1) {
            answers[a]['_links'] = {question: "/question/" + answers[a].question_id + "/", comment: "/question/" + answers[a].question_id + "/answer/" + a + "/comment"};
            array.push(answers[a]);
        }
        res.write(JSON.stringify(array) + "\n");
        res.end();
    });
});

app.get('/question/:qid/answer/:aid', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.models.answer.find({ id : req.params.aid, question_id : req.params.qid }, function (err, answers) {
        //SQL: SELECT a.id, a.question_id, a.answer, a.vote FROM Answer a WHERE a.question_id = qid AND a.id = aid
        var a;
        if (err || typeof answers === 'undefined') {
            console.error(err);
        }
        for (a = 0; a < answers.length; a = a + 1) {
            answers[a]['_links'] = {question: "/question/" + answers[a].question_id + "/", comment: "/question/" + answers[a].question_id + "/answer/" + answers[a].id + "/comment"};
            res.write(JSON.stringify(answers[a]) + "\n");
        }
        res.end();
    });
});

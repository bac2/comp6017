/*jslint node: true */
"use strict";
var express = require('express'),
    orm = require('orm');

var app = express();

app.use(orm.express("sqlite://../database/sqlite.db", {
    define: function (db, models, next) {
        db.load("./models.js", function (err) {
            if (err !== null) {
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
    res.setHeader('Content-Type', 'text/plain');
    res.end("Hello from " + req.url);
});

app.get('/question', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    req.models.question.find([ "vote", "Z" ], function (err, questions) {
        // SQL: SELECT q.id, q.question, q.vote FROM Question q ORDER BY q.vote DESC
        var q,
            array = [];
        if (err !== null) {
            console.error(err);
        }
        for (q = 0; q < questions.length; q = q + 1) {
            questions[q].links = {answer: "/question/" + q + "/answer/", comment: "/question/" + q + "/comment/"};
            array.push(questions[q]);
        }
        res.write(JSON.stringify(array) + "\n");
        res.end();
    });
});

app.get('/question/:qid', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    req.models.question.find({ id : req.params.qid }, function (err, questions) {
        // SQL: SELECT q.id, q.question, q.vote FROM Question q WHERE q.id = id
        var q;
        if (err !== null) {
            console.error(err);
        }
        for (q = 0; q < questions.length; q = q + 1) {
            questions[q].links = {answer: "/question/" + q + "/answer/", comment: "/question/" + q + "/comment/"};
            res.write(JSON.stringify(questions[q]) + "\n");
        }
        res.end();
    });
});

app.get('/question/:qid/answer', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    req.models.answer.find({ question_id : req.params.qid }, [ "vote", "Z" ], function (err, answers) {
        //SQL: SELECT a.id, a.question_id, a.answer, a.vote FROM Answer a WHERE a.question_id = qid
        var a,
            array = [];
        if (err !== null) {
            console.error(err);
        }
        for (a = 0; a < answers.length; a = a + 1) {
            answers[a].links = {question: "/question/" + answers[a].question_id + "/", comment: "/question/" + answers[a].question_id + "/answer/" + a + "/comment"};
            array.push(answers[a]);
        }
        res.write(JSON.stringify(array) + "\n");
        res.end();
    });
});

app.get('/question/:qid/answer/:aid', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    req.models.answer.find({ id : req.params.aid, question_id : req.params.qid }, function (err, answers) {
        //SQL: SELECT a.id, a.question_id, a.answer, a.vote FROM Answer a WHERE a.question_id = qid AND a.id = aid
        var a;
        if (err !== null) {
            console.error(err);
        }
        for (a = 0; a < answers.length; a = a + 1) {
            answers[a].links = {question: "/question/" + answers[a].question_id + "/", comment: "/question/" + answers[a].question_id + "/answer/" + a + "/comment"};
            res.write(JSON.stringify(answers[a]) + "\n");
        }
        res.end();
    });
});
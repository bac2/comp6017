/*jslint node: true */
"use strict";
var express = require('express'),
    orm = require('orm'),
	root = require("./root.js"),
	question = require("./question.js");

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

app.all("/", root.root);
app.all("/question", question.root);
app.all("/question/:qid", question.question);

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

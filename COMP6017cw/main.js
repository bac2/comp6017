/*jslint node: true */
"use strict";

var express = require('express'),
    orm = require('orm'),
    root = require("./root.js"),
    question = require("./question.js"),
    answer = require("./answer.js"),
    question_comment = require("./question_comment.js"),
    answer_comment = require("./answer_comment.js");

var app = express();

app.use(orm.express("sqlite://../database/sqlite.db", {
    define: function (db, models, next) {
    	db.driver.execQuery("PRAGMA foreign_keys = ON;", function (err, data) {
    		if (err) {
    			console.log(err);
    		}
    	});
        db.load("./models.js", function (err) {
            if (err) {
                console.error(err);
            }
            models.question = db.models.question;
            models.answer = db.models.answer;
            models.question_comment = db.models.question_comment;
            models.answer_comment = db.models.answer_comment;
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
app.all("/question/:qid/answer", answer.root);
app.all("/question/:qid/answer/:aid", answer.answer);
app.all("/question/:qid/comment", question_comment.root);
app.all("/question/:qid/comment/:cid", question_comment.comment);
app.all("/question/:qid/answer/:aid/comment", answer_comment.root);
app.all("/question/:qid/answer/:aid/comment/:cid", answer_comment.comment);

app.use(function (req, res) {
	res.write("OH EM GEE, IT'S ALL GONE WRONG.");
	res.status(404);
	res.end();
});
/*jslint node: true */
"use strict";

var	utils = require("./utils.js");

var root = function (req, res) {
    utils.restful(req, res, {
    	
        get: function (req, res) {
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
        },
        
        post: function (req, res) {
        	
        },
        
        'delete': function (req, res) {
        	
        }
    
    });
};

var answer = function (req, res) {
    utils.restful(req, res, {
    	
    	get: function (req, res) {
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
    	},
    	
        put: function (req, res) {
        	
        },
        
        'delete': function (req, res) {
        	
        }
    	
    });
};

exports.root = root;
exports.answer = answer;
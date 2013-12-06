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
                if (answers.length == 0) {
                	res.status(404);
                	res.end();
                }
                if (err) {
                	res.status(500);
                    console.error(err);
                }
                if (req.header("if-modified-since")) {s
    	        	since_date = new Date(req.header("if-modified-since"));
    	        	for(a = 0; a < answers.length; a = a + 1) {
    	        		if (answers[a].last_modified < since_date) {
    	        			res.status(304);
    	        			res.end();
    	        		}
    	        	}
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
     		res.setHeader('Content-Type', 'application/json'); 
    		var answer = req.body['answer'];
    		req.models.answer.create([
    		    {
    		        answer: answer.answer,
    		        vote: 0,
    		        question_id: req.params.qid,
    		        last_modified: new Date()
    		    }
    	    ], function (err, items) {
    			var i;
    	        if (err) {
    	        	console.log(err);
    	            res.status(400);
    	            res.end();
    	        }
    	        for( i = 0; i < items.length; i = i + 1) {
    	        	var item = items[i];
    	        	res.status(201);
    	        	res.setHeader("Location", "/question/" + item['question_id'] + "/answer/"+ item['id']);
    	        	res.end();
    	        }
    		});    
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
		        if (req.header("if-modified-since")) {s
    	        	since_date = new Date(req.header("if-modified-since"));
	        		if (answer.last_modified < since_date) {
	        			res.status(304);
	        			res.end();
	        		}
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
/*jslint node: true */
"use strict";

var	utils = require("./utils.js");

var root = function (req, res) {
    utils.restful(req, res, {
    	
    	get: function (req, res) {
    	    res.setHeader('Content-Type', 'application/json');
    	    req.models.question.find([ "vote", "Z" ], function (err, questions) {
    	        // SQL: SELECT q.id, q.question, q.vote FROM Question q ORDER BY q.vote DESC
    	        var q,
    	            array = [],
    	            since_date;
    	        if (err) {
    	            console.error(err);
    	            res.status(500);
    	            res.end();
    	        }
    	        if (req.header("if-modified-since")) {
    	        	since_date = new Date(req.header("if-modified-since"));
    	        	for(q = 0; q < questions.length; q = q + 1) {
    	        		if (questions[q].last_modified < since_date) {
    	        			res.status(304);
    	        			res.end();
    	        		}
    	        	}
    	        }
    	        for (q = 0; q < questions.length; q = q + 1) {
    	            questions[q]['_links'] = {question: "/question/" + questions[q].id + "/", answer: "/question/" + questions[q].id + "/answer/", comment: "/question/" + questions[q].id + "/comment/"};
    	            array.push(questions[q]);
    	        }
    	        res.write(JSON.stringify(array) + "\n");
    	        res.end();
    	    });
    	}, 
    	
    	post: function (req, res) {    		
    		res.setHeader('Content-Type', 'application/json'); 
    		var question = req.body['question'];
    		req.models.question.create([
    		    {
    		        title: question.title,
    		        body: question.body,
    		        vote: 0,
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
    	        	res.setHeader("Location", "/question/"+ item['id']);
    	        	res.end();
    	        }
    		});    		
    	}, 
    	
    	"delete": function (req, res) {
    		req.models.question.find().remove(function (err) {
    			if (err) {
    				res.status(500);
    	            res.end();
    			}
    			res.status(204);
    			res.end();
    		});
    	},
    	
    	head: function (req, res) {
    		this.handlers['get'](req, res);
    	}
    	
    });
};

var question = function (req, res) {
    utils.restful(req, res, {
    	
    	get: function (req, res) {
    	    res.setHeader('Content-Type', 'application/json');
    	    req.models.question.get(req.params.qid, function (err, question) {
    	        // SQL: SELECT q.id, q.question, q.vote FROM Question q WHERE q.id = id
    	        if (err) {
    	        	res.status(404);
    	        	res.end();
    	        	return;
    	        }
    	        
    	        if (req.header("if-modified-since")) {
    	        	since_date = new Date(req.header("if-modified-since"));
	        		if (question.last_modified < since_date) {
	        			res.status(304);
	        			res.end();
	        		}
    	        }
    	        
    	        question['_links'] = {answer: "/question/" + question.id + "/answer/", comment: "/question/" + question.id + "/comment/"};
    	    	res.write(JSON.stringify(question) + "\n");
    	    	res.end();
    	    });
    	},
    	
    	put: function (req, res) {
    		req.models.question.get(req.params.qid, function(err, questions) {
    			var question = req.body['question'];
    			if (question.text) {
    				questions.question = question.text;
    			}
    			if (question.vote) {
    				questions.vote = question.vote;
    			}
    			
    			questions.save(function (err) {
    				if (err){
    		        	console.log(err);
    		            res.status(400);
    		            res.end();				
    				}
    		        res.status(200);
    		        res.end();
    			});
    		});
    	},
    	
    	'delete': function (req, res) {
    		req.models.question.get(req.params.qid, function (err, question) {
    			if (err) {
    				res.status(404);
    				res.end();
    				return;
    			}
    			question.remove(function (err) {
    				if (err) {
    					res.status(500);
    	            	res.end();
    				}
    				res.status(204);
    			});
    			
        		req.models.answer.find({ question_id : req.params.qid }).remove(function (err){
        			if (err){
        				res.status(400);
    	            	res.end();
        			}
        		});
    			
    			res.end();
    		});

    	}
    	
    });
};


exports.root = root;
exports.question = question;
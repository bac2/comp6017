/*jslint node: true */
"use strict";

var	utils = require("./utils.js");

var root = function (req, res) {
    utils.restful(req, res, {
    
    	get: function (req, res) {
    	    res.setHeader('Content-Type', 'application/json');
    	    req.models.question_comment.find({ question_id : req.params.qid }, function (err, comments) {
    	        var c,
    	            array = [];
				if (comments.length == 0) {
                	res.status(404);
                	res.end();
                }
    	        if (err) {
    	        	res.status(500);
    	        	res.end();
    	            console.error(err);
    	        }
    	        
    	        for (c = 0; c < comments.length; c = c + 1) {
    	            comments[c]['_links'] = {question: "/question/" + req.params.qid + "/"};
    	            array.push(comments[c]);
    	        }
    	        res.status(200);
    	        res.write(JSON.stringify(array) + "\n");
    	        res.end();
    	    });
        },
        
    	post: function (req, res) {
    		res.setHeader('Content-Type', 'application/json');
    		var comment = req.body['comment'];
    		req.models.question_comment.create([
    		    {
    		        question_id: req.params.qid,
    		        comment: comment.comment,
    		        last_modified: new Date(),
    		        
    		    }
    	    ], function (err, items) {
    			var i;
    	        if (err) {
    	        	res.status(400);
    	        	res.end();
    	            console.error(err);
    	        }
    	        for( i = 0; i < items.length; i = i + 1) {
    	        	var item = items[i];
    	        	res.status(201);
    	        	res.setHeader("Location", "/question/" + req.params.qid + "/comment/" + item['id']);
    	        	res.end();
    	        }
    		});   
        },
        
        'delete': function (req, res) {
        }

    });
};

var comment = function (req, res) {
    utils.restful(req, res, {
    
    	get: function (req, res) {
    	    res.setHeader('Content-Type', 'application/json');
    	    req.models.question_comment.get(req.params.cid, function (err, comments) {
    	        if (err) {
    	        	res.status(500);
    	        	res.end();
    	            console.error(err);
    	        }    	        
	            comment['_links'] = {question: "/question/" + req.params.qid + "/"};
    	        res.status(200);
    	        res.write(JSON.stringify(comments) + "\n");
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
exports.comment = comment;
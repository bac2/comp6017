/*jslint devel: true, node: true, nomen: true, unparam: true, sloppy: true */

var	utils = require("./utils.js");

var root = function (req, res) {
    utils.restful(req, res, {
    
    	get: function (req, res) {
    		
        },
        
    	post: function (req, res) {
    		res.setHeader('Content-Type', 'application/json');
    		var comment = req.body['comment'];
    		req.models.answer_comment.create([
			    {
			        answer_id: req.params.aid,
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
		        	res.setHeader("Location", "/question/" + req.params.qid + "/answer/" + req.params.aid + "/comment/" + item['id']);
		        	res.end();
		        }
			});   
        },
        
    	post: function (req, res) {
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
		    req.models.answer_comment.find({answer_id: req.params.aid}).remove(function (err) {
		    	if (err) {
        			res.status(400);
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

var comment = function (req, res) {
    utils.restful(req, res, {
    
    	get: function (req, res) {
    		
        },
        
    	put: function (req, res) {
    		
        },
        
		'delete': function (req, res) {
		    req.models.answer_comment.find({id: req.params.aid, answer_id: req.params.aid}).remove(function (err) {
		    	if (err) {
        			res.status(400);
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

exports.root = root;
exports.comment = comment;
/*jslint devel: true, node: true, nomen: true, unparam: true, sloppy: true */

var	utils = require("./utils.js");

var root = function (req, res) {
    utils.restful(req, res, {
    
    	get: function (req, res) {
    		
        },
        
    	post: function (req, res) {
    		
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
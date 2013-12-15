/*jslint devel: true, node: true, nomen: true, unparam: true, sloppy: true */

var	utils = require("./utils.js");

var root = function (req, res) {
    utils.restful(req, res, {
    
    	get: function (req, res) {
    		
        },
        
    	post: function (req, res) {
    		
        },
        
        'delete': function (req, res) {
        	
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
		    		
		},
		
    	head: function (req, res) {
    		this.handlers['get'](req, res);
    	}
        
    });
};

exports.root = root;
exports.comment = comment;
/*jslint node: true */
"use strict";

var	utils = require("./utils.js");

var root = function (req, res) {
    utils.restful(req, res, {
    
    	get: function (req, res) {
    		
        },
        
    	post: function (req, res) {
    		
        },
        
        del: function (req, res) {
        	
        }

    });
};

var comment = function (req, res) {
    utils.restful(req, res, {
    
    	get: function (req, res) {
    		
        },
        
    	put: function (req, res) {
    		
        },
        
		del: function (req, res) {
		    		
		}
        
    });
};

exports.root = root;
exports.comment = comment;
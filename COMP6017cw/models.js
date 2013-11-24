/*jslint node: true */
"use strict";

module.exports = function (db, cb) {
	db.define('question', {
		id : Number,
		title : String,
		body : String,
		vote : Number
	});	
	db.define('answer', {
		id : Number,
		question_id : Number,
		body : String,
		vote : Number
	});
	db.define('question_comment', {
		id : Number,
		question_id : Number,
		body : String
	});
	db.define('answer_comment', {
		id : Number,
		answer_id : Number,
		body: String
	});	
	return cb();	
};
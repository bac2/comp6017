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
		answer : String,
		vote : Number
	});
	db.define('comment', {
		id : Number,
		foreign_id : Number,
		comment : String,
		vote : Number
	});	
	return cb();	
};
/*jslint devel: true, node: true, nomen: true, unparam: true, sloppy: true */

module.exports = function (db, cb) {
	db.define('question', {
		id : Number,
		title : String,
		body : String,
		vote : Number,
		last_modified : Date
	});	
	db.define('answer', {
		id : Number,
		question_id : Number,
		answer : String,
		vote : Number,
		last_modified : Date
	});
	db.define('question_comment', {
		id : Number,
		question_id : Number,
		comment : String,
		last_modified : Date
	});
	db.define('answer_comment', {
		id : Number,
		answer_id : Number,
		comment : String,
		last_modified : Date
	});	
	return cb();	
};
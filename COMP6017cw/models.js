module.exports = function (db, cb) {
	db.define('question', {
		id : Number,
		question : String,
		vote : Number
	});	
	db.define('answer', {
		id : Number,
		question_id : Number,
		answer : String,
		vote : Number
	});	
	return cb();	
};
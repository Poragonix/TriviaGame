var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var DATABASE_IP = 'localhost';
var DATABASE_PORT = 27017;
var DATABASE_COLLECTION = 'exampleDb'

 mongoose.connect('mongodb://' + DATABASE_IP + ':' +  DATABASE_PORT + ' /' + DATABASE_COLLECTION);

var triviaSchema = new mongoose.Schema({
	category: String,
	questions: [] //{ text: String , answers: [{ text: String , isCorrect: boolean }] 
});

mongoose.model( 'Trivia', triviaSchema );
var Trivia = mongoose.model( 'Trivia' );


/* GET */
router.get('/requestData', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); 
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	var params = req.params;

	if( params.type == 'ALL' ) {
		Trivia.find().execFind( function( arr , data ) {
			res.send(data);
		});
	}
});

/* POST */
router.post( '/' , function( req , res , next ) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	var type = req.body.type;
	var requestType = req.body.requestType;

	if( requestType == 'POST' ) {

		if( type == 'category' ) {
			
			// Optimization, check to see if it exists, and if so, res.send( false )
			var trivia = new Trivia();
			trivia.category = req.body.category;

			trivia.save( function() {
				res.send( true );
			});
		}
		else if( type == 'question' ) {
			var cat = req.body.category;
			var ques = req.body.question;

			var toStore = {};
			toStore["text"] = ques;
			toStore["answers"] = [];

			Trivia.update({ category: cat }, { $push: { questions: toStore }} , function( result ) {
				res.send( true );
			});
		}
		else if( type == 'answer' ) {
			var cat = req.body.category;
			var ques = req.body.question;
			var ans = req.body.answer;
			var isTrue = req.body.isTrue;

			var toStore = {};
			toStore["text"] = ans;
			toStore["isCorrect"] = isTrue;

			Trivia.update({ category: cat , 'questions.text': ques }, { $push: { 'questions.$.answers': toStore }} , function() {
				res.send( true );
			});	
		}
	}
	else if( requestType == 'GET' ) {

		var cat = req.body.category;
		var ques = req.body.question;
		var ans = req.body.answer;	

		var filter = {};

		if( type == 'ALL' ) {
			// Do nothing
		}
		else if( type == 'category' ) {
			filter["category"] = cat;
		}		
		else if( type == 'answer' ) {
			filter["category"] = cat;
			filter["questions.text"] = ques;
		}

		Trivia.find( filter, /*{ sort: { category: 1 }},*/ function( err , docs) {
		    if( !err )
		        res.send( docs )
		    else
		    	throw err;
		});	

	}
	else if( requestType == 'DELETE' ) {
		// TO DO
	}
	else {
		res.send( 'Invalid type' );
	}	


});

/* PUT */

/* DELETE */


module.exports = router;

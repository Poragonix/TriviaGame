//server_interface
(function() {

	var SERVER_IP = 'http://localhost:3000/';

	window.GLOTO = ( typeof window.GLOTO === 'undefined' ) ? {} : window.GLOTO;

	window.GLOTO.server_interface = function() {
		console.log( 'server_interface constructor called.' );
	}

	var dbProto = window.GLOTO.server_interface.prototype;

	// Gets everything in the collection
	dbProto.pullEverything = function() {
		return makeServerRequest( 'GET' , { type: 'ALL' });
	};

	// Gets an entire category, including all questions and answers
	dbProto.pullCategory = function( category ) {
		return makeServerRequest( 'GET' , {
			type: 'category',
			category: category 
		});
	};

	// Adds an empty category
	dbProto.addCategory = function( category ) {
		return makeServerRequest( 'POST' , { 
			type: 'category',			
			category: category
		});
	};

	// Removes an entire category, with all data as well
	dbProto.removeCategory = function( category ) {
		return makeServerRequest( 'DELETE' , { 
			type: 'category',			
			category: category
		});
	};

	// Adds a question to a category, without any answers
	dbProto.addQuestion = function( category , text ) {
		return makeServerRequest( 'POST' , { 
			type: 'question',
			category: category,
			question: text
		});
	};

	// Removes a question from a category, including all answers
	dbProto.removeQuestion = function( category , question ) {
		return makeServerRequest( 'DELETE' , { 
			type: 'question',			
			category: category,
			question: question
		});
	};

	// Gets all the answers for a question
	dbProto.pullAnswersByQuestion = function( category , question ) {
		return makeServerRequest( 'GET' , {
			type: 'answer',
			category: category,
			question: question
		});
	};

	// Adds an answer for a question in a category
	dbProto.addAnswer = function( category , question , text , isAnswer ) {
		return makeServerRequest( 'POST' , { 
			type: 'answer',
			category: category,
			question: question,
			answer: text,
			isTrue: isAnswer
		});
	};

	function makeServerRequest( requestType , dataObj ) {
		return new Promise( function( resolve, reject ) {
			dataObj["requestType"] = requestType;
			$.ajax({
				type: 'POST',
				url: SERVER_IP,
				data: dataObj,
				success: resolve
			})
			.fail( reject )
		});
	}

	GLOTO.db = new window.GLOTO.server_interface();

})();
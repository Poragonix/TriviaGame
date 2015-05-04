//mod_screen.js
(function() {

	var runPage = function() {

		var modPage = $('#modPage');
		var introTextContainer = $('#modPage .introTextContainer');
		var contentContainer = $('#modPage .contentContainer');
		modPage.hide();

		var db = GLOTO.db;

		// testInsert( db );

		var introText = $('<div></div>')
		introText
		.addClass( 'introText' )
		.html( '~Trivia Info Options~' )
		.appendTo( introTextContainer );


		$(document).on( 'customShowMod' , function() {
			db.pullEverything()
			.then( function( data ) {

				contentContainer.empty();

				data.forEach( function( element , index ) {

					var category = appendDataToPage( 'modCategory' , contentContainer , element.category );

					element.questions.forEach( function( element , index ) {

						var question = appendDataToPage( 'modQuestion' , category , element.text );

						element.answers.forEach( function( element , index ) {

							var answer = appendDataToPage( 'modAnswer' , question , element.text );
							answer.addClass( element.isCorrect == "true" ? 'correctAnswer' : 'wrongAnswer' );
						});

						// Preserve spacing
						if( element.answers.length == 0 )
							question.append( '<div></div>' );

						addButton( db , 'Answer' , question );
					});

					// Preserve spacing
					if( element.questions.length == 0 )
						category.append( '<div></div>' );

					addButton( db , 'Question' , category );
				});

				addButton( db , 'Category' , contentContainer );
			});
		});
	}

	function appendDataToPage( className , parentContainer , StringToShow ) {
		var data = $('<div></div>');

		data
		.addClass( className)
		.html( StringToShow )
		.appendTo( parentContainer );

		return data;
	}

	function submitData( db , type , data , container ) {

		if( type == 'Category' )
			db.addCategory( data.textValue ).then( function() { addDataCallback( db , type , data , container ) });
		else if( type == 'Question' )
			db.addQuestion( data.categoryText , data.textValue ).then( function() { addDataCallback( db , type , data , container ) });
		else if( type == 'Answer' )
			db.addAnswer( data.categoryText , data.questionText , data.textValue , data.isTrue ).then( function() { addDataCallback( db , type , data , container ) });
	}

	function addDataCallback( db , type , data , container ) {
		var isCorrectAnswer = ( container.find('.incorrectIcon').length > 0 ) ? false : true;
		container.find('#add' + type + 'Button, .answerIcon').remove();

		var newData = appendDataToPage( 'mod' + type , container , data.textValue );

		if( type == 'Category' ) {
			newData.append( '<div></div>' );
			addButton( db , 'Question' , newData );
		}
		else if( type == 'Question' ) {
			newData.append( '<div></div>' )
			addButton( db , 'Answer' , newData );
		}
		else {
			newData.addClass( (isCorrectAnswer) ? 'correctAnswer' : 'wrongAnswer' )
		}

		addButton( db , type , container);
	}

	function addButton( db , type , container ) {
		var addInput = $('<input></input>');
		addInput
		.addClass( 'addButton' )
		.attr({
			'id': 'add' + type + 'Button',
			'placeholder': 'Add ' + type + '?',
			'width': '200px',
			'autocomplete': 'off'
		})
		.blur( function(){ 
			var data = {};
			data.textValue = $(this).val();

			if( type == 'Question' ) {
				data.categoryText = container.clone().children().remove().end().text();
			}
			else if( type == 'Answer' ) {
				data.questionText = container.clone().children().remove().end().text();
				data.categoryText = container.parent('.modCategory').clone().children().remove().end().text();
				data.isTrue = ( container.find('.incorrectIcon').length == 0 ) ? true : false;
			}

			if( data.textValue != null && data.textValue != '' )
				submitData( db , type , data , container )
		})

		if( type == 'Answer' ) {
			var toggle = $('<img></img>');
			toggle
			.attr({
				'height': '20px',
				'width': '20px',
				'src': '../images/redX.png'
			})
			.addClass( 'answerIcon' )
			.addClass( 'incorrectIcon' )
			.on( 'click' , function() {

				if( $(this).hasClass( 'incorrectIcon' ) ) {
					$(this).attr( 'src' , '../images/greenCheck.png' )
				}
				else {
					$(this).attr( 'src' , '../images/redX.png')		
				}

				$(this).toggleClass( 'incorrectIcon' )
			})
			.appendTo( container );
		}

		addInput.appendTo( container );
	}

	function testInsert( db ) {

		var catArray  = ['Fantasy' , 'Horror' ];
		var quesArray = [ 
			['Best fantasy author?' , 'Best fantasy series?' , 'Best fantasy movie?' , 'Game of Thrones is based off what book series?' , 'Who plays Bilbo Baggins in The Hobbit?'],
			['Best horror author?' , 'Best horror game series?' , 'Scariest book?' , 'Who wrote The Exorcist?' , 'Is horror the best genre?']
		]
		var ansArray  = [
			[ [ 'L. A. Banks' , 'Terry Pratchet' ] , [ 'A Song of Ice and Fire' , 'Wheel of Time'] , [ 'Lord of the Rings' , 'Harry Potter' ] , [ 'A Song of Ice and Fire' , 'Lord of the Rings' ] , [ 'Ian Holm' , 'Martin Freeman'  ] ],
			[ [ 'Steven King' , 'Pretty much anyone else'] , [ 'Resident Evil' , 'Kirby\'s Adventure'] , [ 'It' , 'The Green Mile' ] , [ 'William Peter Blatty' , 'Peter Straub' ] , [ 'Nope! Too scary' , 'Maybe?'  ] ]
		]

		return new Promise( function( resolve , reject ) {
			db.addCategory( catArray[0]  )
			.then( function( result ) {
				db.addQuestion( catArray[0] , quesArray[0][0] )
				.then( function() {
					db.addAnswer( catArray[0] , quesArray[0][0] , ansArray[0][0][0] , false );
					db.addAnswer( catArray[0] , quesArray[0][0] , ansArray[0][0][1] , true );
				});
				
				db.addQuestion( catArray[0] , quesArray[0][1] )
				.then( function() {
					db.addAnswer( catArray[0] , quesArray[0][1] , ansArray[0][1][0] , false );
					db.addAnswer( catArray[0] , quesArray[0][1] , ansArray[0][1][1] , true );
				});

				db.addQuestion( catArray[0] , quesArray[0][2] )
				.then( function() {
					db.addAnswer( catArray[0] , quesArray[0][2] , ansArray[0][2][0] , true );
					db.addAnswer( catArray[0] , quesArray[0][2] , ansArray[0][2][1] , false );
				});

				db.addQuestion( catArray[0] , quesArray[0][3] )
				.then( function() {
					db.addAnswer( catArray[0] , quesArray[0][3] , ansArray[0][3][0] , true );
					db.addAnswer( catArray[0] , quesArray[0][3] , ansArray[0][3][1] , false );
				});

				db.addQuestion( catArray[0] , quesArray[0][4] )
				.then( function() {
					db.addAnswer( catArray[0] , quesArray[0][4] , ansArray[0][4][0] , false );
					db.addAnswer( catArray[0] , quesArray[0][4] , ansArray[0][4][1] , true );
				});
			});

			db.addCategory( catArray[1]  )
			.then( function( result ) {
				db.addQuestion( catArray[1] , quesArray[1][0] )
				.then( function() {
					db.addAnswer( catArray[1] , quesArray[1][0] , ansArray[1][0][0] , true );
					db.addAnswer( catArray[1] , quesArray[1][0] , ansArray[1][0][1] , false );
				});
				
				db.addQuestion( catArray[1] , quesArray[1][1] )
				.then( function() {
					db.addAnswer( catArray[1] , quesArray[1][1] , ansArray[1][1][0] , true );
					db.addAnswer( catArray[1] , quesArray[1][1] , ansArray[1][1][1] , false );
				});

				db.addQuestion( catArray[1] , quesArray[1][2] )
				.then( function() {
					db.addAnswer( catArray[1] , quesArray[1][2] , ansArray[1][2][0] , true );
					db.addAnswer( catArray[1] , quesArray[1][2] , ansArray[1][2][1] , false );
				});

				db.addQuestion( catArray[1] , quesArray[1][3] )
				.then( function() {
					db.addAnswer( catArray[1] , quesArray[1][3] , ansArray[1][3][0] , true );
					db.addAnswer( catArray[1] , quesArray[1][3] , ansArray[1][3][1] , false );
				});

				db.addQuestion( catArray[1] , quesArray[1][4] )
				.then( function() {
					db.addAnswer( catArray[1] , quesArray[1][4] , ansArray[1][4][0] , true );
					db.addAnswer( catArray[1] , quesArray[1][4] , ansArray[1][4][1] , false );
				});
			})
			.then( resolve );
		});
	}

	$(document).ready( runPage );

})();
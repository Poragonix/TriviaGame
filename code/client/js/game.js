//game.js
(function() {

	var ROUND = 1, SCORE = 0, ALLOW_REPULL_FROM_DB = true;

	var runPage = function() {

		var gamePage = $('#gamePage');
		var introTextContainer = $('#gamePage .introTextContainer');
		var contentContainer = $('#gamePage .contentContainer');		
		gamePage.hide();

		var introText = $('<div></div>')
		introText
		.addClass( 'introText' )
		.html( '~Category Select~' )
		.appendTo( introTextContainer );

		var question = $('#question');
		var answerList = $('#answerList');
		question.hide();
		answerList.hide();

		var db = GLOTO.db;

		$(document).on( 'customShowGame' , function() {
			if( ALLOW_REPULL_FROM_DB )
				initGame( db );
		});
	}

	function initGame( db ) {

		var categoryList = $('#categoryList');

		categoryList
		.show()
		.empty();
		db.pullEverything()
		.then( function( data ) {

			// Handle all catories
			var allCategories = appendDataToPage( 'categoryName' , categoryList , 'ALL' )
			var allCategoryQuestions = [];

			// Handle each individual category
			data.forEach( function( element , index ) {
				var currentCategory = appendDataToPage( 'categoryName' , categoryList , element.category );
				allCategoryQuestions = allCategoryQuestions.concat( element.questions)

				currentCategory.on( 'click' , function() {
					if( !validateCategory( element.questions ) )
						return;

					constructQuestion( db , element.questions );
				});
			});

			allCategories.on( 'click' , function() {
				if( !validateCategory( allCategoryQuestions ) )
					return;

				constructQuestion( db , allCategoryQuestions );
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

	function validateCategory( questionArray ) {
		var retval = true;
		if( questionArray.length < 5 ) {
			alert( 'Category must have at least 5 questions.' );
			retval = false;
		}
		else {
			for( var i = 0; i < questionArray.length; i++ ) {
				if( questionArray[i].answers.length < 1 ) {
					debugger;
					alert( 'Each question must have at least one answer.' );
					retval = false;
					break;
				}
			}
		}
		return retval;
	}

	function constructQuestion( db , questions ) {

		ALLOW_REPULL_FROM_DB = false;

		if( ROUND > 5 ) {
			handleEndGame( db );
			return;
		}

		var question = $('#question');
		var answerList = $('#answerList');

		var randomIndex = Math.floor( Math.random() * questions.length );
		var ques = questions[randomIndex];

		questions.splice( randomIndex , 1 );

		question.html( ques.text );

		answerList.empty();
		ques.answers.forEach( function( element , index ) {
			var ans = appendDataToPage( 'answerText' , answerList , element.text )
			ans.on( 'click' , function() {
				ROUND++;
				$('.answerText').addClass( 'noTouch');
				
				if( element.isCorrect == "true" ) {
					$(this).addClass( 'correctAnswer' );
					SCORE++;
				}
				else
					$(this).addClass( 'wrongAnswer' );

				setTimeout( function() {
					constructQuestion( db , questions );
				} , 1000 );
			});

		});

		$('#gamePage .introText').html( 'Round <span id="roundNumber">' + ROUND + '</span>!<span class="scoreBoard"><span class="score">' + SCORE + '</span>/5</span>')
		openPage( '#categoryList' , '#question, #answerList' )
	}

	function handleEndGame( db ) {
		$('#gamePage .introText').html( 'Final Score: ' + SCORE + '/5' );
		$('#answerList').empty();

		$('#question')
		.html( 'Click here to play again.')
		.one( 'click' , function() {
			ROUND = 1, SCORE = 0;
			$('#gamePage .introText').html( '~Category Select~' )
			$('#question, #answerList').hide();
			ALLOW_REPULL_FROM_DB = true;
			initGame( db );
		});
	}

	function openPage( fadeOut , fadeIn ) {		
		$(fadeOut).hide();
		$(fadeIn).show();
	}

	function opacityObj( value ) {
		return {
			type: 'opacity',
			value: value,
			duration: 500,
			easing: 'easeIn'
		};
	}	

	$(document).ready( runPage );

})();
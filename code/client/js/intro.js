//intro.js
(function() {

	var CURRENT_PAGE = '#introPage';

	var runPage = function() {

		var introPage = $('#introPage');
		var navbar = $('#navbar');
		var introTextContainer = $('#introPage .introTextContainer');
		var contentContainer = $('#introPage .contentContainer');

		introPage
		.hide()
		.append( introText );

		var introText = $('<div></div>')
		introText
		.addClass( 'introText' )
		.html( '~TRIVIA GAME~' )
		.appendTo( introTextContainer );

		contentContainer
		.html( 'Code sample for GLOTO<br />Author: Brian Silvia<br />5/3/2015')

		initButton( '#introPageButton' , '#introPage' , 'customShowIntro' ).addClass( 'inactiveButton' );
		initButton( '#playGameButton' , '#gamePage' , 'customShowGame' );
		initButton( '#modMenuButton' ,  '#modPage' , 'customShowMod' );

		$('#introPage, #navbar, #content')
		.show()
		.hx({
			type: 'opacity',
			value: 1,
			delay: 200,
			duration: 400,
			easing: 'easeIn'
		});

	}

	function initButton( selector , pageToOpen , customEvent ) {

		var button = $( selector );

		button.on( 'click' , function() {
			openPage( this , CURRENT_PAGE , pageToOpen );
			$(document).trigger( customEvent );
		});

		return button;
	}

	function openPage( buttonClicked , pageFadeOut , pageFadeIn ) {
		stopAllTouch();
		
		$(pageFadeIn).show().hx( opacityObj( 1 ));
		$(pageFadeOut).hx( opacityObj( 0 ));
		$(buttonClicked).hx( opacityObj( .5 ));
		$('.inactiveButton').hx( opacityObj( 1 ))
		
		.done( function() {
			$(pageFadeOut).hide();
			$('.inactiveButton').removeClass( 'inactiveButton' );
			$(buttonClicked).addClass( 'inactiveButton' );
			CURRENT_PAGE = pageFadeIn;
			allowAllTouch();
		});
	}

	function opacityObj( value ) {
		return {
			type: 'opacity',
			value: value,
			duration: 500,
			easing: 'easeIn'
		};
	}

	function stopAllTouch() { $('#masterContainer').addClass( 'noTouch' ); }
	function allowAllTouch() { $('#masterContainer').addClass( 'touch' ); }

	$(document).ready( runPage );

})();
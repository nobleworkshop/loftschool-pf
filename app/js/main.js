"use strict";

//Spagetti JS! Enjoy!

//Popup
$('#jsAddProject').click(function (e) {
	e.preventDefault();
	$('#jsPopup').removeClass('hidden');
});
$('.jsClosePopup').click(function() {
	$('#jsPopup').addClass('hidden');
});
//Popup END

//Custom file input
$('#project-img').change(function() {
	$('#project-img-overlay').text( this.value || 'Загрузите изображение' );
});
//Custom file input END

//Placeholders
if (!Modernizr.input.placeholder) {
	 $('[placeholder]').each( function() {
	    var target = $(this);
	    target.val( target.attr('placeholder') );
	  });
	$('[placeholder]').focus( function() {
		var target = $(this);
		if(target.val() == target.attr('placeholder'))
		  target.val('');
		}).blur(function() {
		var target = $(this);
		if(target.val() == '')
		  target.val( target.attr('placeholder') );
	});
}
//Placeholders END
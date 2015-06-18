//(function () {
	
	//Placeholders Module
	var pholder = (function () {
		var _inputs;
		//Insert placeholders value to input
		var _insertText = function () {
			_inputs.each(function () {
				$(this).val($(this).attr('placeholder'));
			});
		};
		//Remove text on focus and add on blur
		var _setListeners = function () {
			_inputs.focus(function () {
				if ($(this).val() === $(this).attr('placeholder')) {
					$(this).val('');
				}
			}).blur(function () {
				if ($(this).val() === '') {
					$(this).val($(this).attr('placeholder'));
				}
			});
		};
		return {
			init: function () {
				_inputs = $('[placeholder]');
				_insertText();
				_setListeners();
			}
		};
	})();

	//------------- Tooltip plugin for jQuery ------------------
	$.fn.tooltip = function (userOptions) {
		if(arguments.length === 0) var userOptions = {};
		//Id for linking tooltips and inputs
		if(arguments.callee.tooltipCounter === undefined){
			arguments.callee.tooltipCounter = 0;
		} else {
			arguments.callee.tooltipCounter++;
		}
		var linkId = arguments.callee.tooltipCounter;
		var object = this;
		var options = {
			position: userOptions.position || object.data('tt-position') || 'right',
			text: userOptions.text || object.data('tt-text') || 'Tooltip'
		};
		var tooltip = $('<div class="tooltip-wrapper">\
												<div class="tooltip"></div>\
										</div>');
		tooltip.children().text(options.text);
		tooltip.children().addClass(options.position);
		tooltip.attr("data-tt-link-id", linkId);
		object.attr("data-tt-link-id", linkId);

		//Positioning tooltip on page
		function _setPosition(elem, tooltip, position) {
			var elemWidth = elem.outerWidth();
			var elemHeight = elem.outerHeight();
			var elemTopEdge = elem.offset().top;
			var elemBottomEdge = elem.offset().top + elemHeight;
			var elemLeftEdge = elem.offset().left;
			var elemRightEdge = elem.offset().left + elemWidth;
			
			var tooltipWidth = tooltip.outerWidth(true);
			var tooltipHeight = tooltip.outerHeight(true);
			
			if(position === 'right') {
				tooltip.offset({
					left: elemRightEdge,
					top: elemTopEdge + elemHeight/2 - tooltipHeight/2
				});
			} else 
			if (position === 'left') {
				tooltip.offset({
					left: elemLeftEdge - tooltipWidth,
					top: elemTopEdge + elemHeight/2 - tooltipHeight/2
				});
			} else {
				throw new Error("Error tooltip position");
			}
		}
		//Add tooltip to page
		$('body').append(tooltip);
		_setPosition(object, tooltip, options.position);
		$(window).resize(function() {
			_setPosition(object, tooltip, options.position);
		});
	};
	$.fn.tooltip.prototype.tooltipCounter = 1;
	$.fn.tooltipRemove = function() {
		//var linkId = this.
		var linkId = this.data('tt-link-id');
		this.removeData('tt-link-id');
		$('[data-tt-link-id="' + linkId +'"]').filter('.tooltip-wrapper').remove();
	};
	//------------- Tooltip plugin for jQuery END --------------

	//------------- Validate form Module ------------------------------
	var validate = function () {
		var _form;
		var _inputs = [];

		function _showError(input) {
			$(input).addClass('vd-invalid').tooltip();
		}
		function _hideError(input) {
			$(input).removeClass('vd-invalid').tooltipRemove();
		}
		function _validateForm(event) {
			var valid = true;
			_resetValidate();
			_inputs.each(function () {
				var input = $(this);
				switch(input.data('validate-type')){
					case 'text':
						if(input.val() === '' || input.val() === input.attr('placeholder')) {
							_showError(input);
							valid = false;
						}
						break;
					case 'file-wrapper':
						var realInput = input.parent().find('[type="file"]');
						if(realInput.val() === '') {
							_showError(input);
							valid = false;
						}
						break;
				}
			});
			if(valid === false) {
				event.preventDefault();
			}
		}
		function _resetValidate() {
			_inputs.each(function() {
				_hideError(this);
			});
		}
		function _setListeners() {
			_form.on('submit', function(e) {
				_validateForm(e);
			});
			_form.on('reset', _resetValidate);
			_form.on('keypress paste', '[data-validate-type]', function() {
				_hideError(this);
			});
		}
		return {
			init: function (form) {
				_form = $(form);
				_inputs = _form.find('[data-validate-type]');
				_setListeners();
			},
			reset: function () {
				_resetValidate();
			}
		};
	};
	// --------------- Validate Form Module END -------------------

	//Enable validate for forms
	if($('.contact-me-form')) {
		var contactForm = validate();
		contactForm.init('.contact-me-form');
	};
	if($('.add-project-form')) {
		var projectForm = validate();
		projectForm.init('.add-project-form');
	};
	if($('.auth-form')) {
		var inputForm = validate();
		inputForm.init('.auth-form');
	};
	// --------------- Popup -----------------
	$('#jsAddProject').click(function (e) {
		e.preventDefault();
		$('#jsPopup').removeClass('hidden');
	});
	$('.jsClosePopup').click(function () {
		$('#jsPopup').addClass('hidden');
		projectForm.reset(); //Close tooltips
	});
	// -------------- Popup END ---------------

	//Custom file input
	$('#project-img').change(function () {
		$('#project-img-overlay').text( this.value || 'Загрузите изображение' );
	});
	//Custom file input END

	//Placeholders init
	if (!Modernizr.input.placeholder) {
		pholder.init();
	}
//})();


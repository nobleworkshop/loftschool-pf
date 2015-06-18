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
		//Если не передаём в функцию объект - создаём 
		//пустой, чтобы не вывалиться в ошибку
		if(arguments.length === 0) var userOptions = {};

		//Если идентификатор для связки тултипов с инпутами
		//не определён - задаём.
		if(arguments.callee.tooltipCounter === undefined){
			arguments.callee.tooltipCounter = 0;
		} else {
			arguments.callee.tooltipCounter++;
		}

		var linkId = arguments.callee.tooltipCounter,
			object = this,
			tooltip = $('<div class="tooltip-wrapper">\
						<div class="tooltip"></div>\
						</div>'),
			options = {
			position: userOptions.position 
					|| object.data('tt-position') 
					|| 'right',
			text: 	userOptions.text 
					|| object.data('tt-text') 
					|| 'Tooltip'
		};
		//Добавляем тултипу необходимый класс для
		//для позиционирования и текст
		tooltip.children().text(options.text);
		tooltip.children().addClass(options.position);

		//Добавляем уникальный идентификатор для инпута и тултипа
		tooltip.attr("data-tt-link-id", linkId);
		object.attr("data-tt-link-id", linkId);

		//Функция размещает тултип около нужного инпута
		function _setPosition(elem, tooltip, position) {
			var elemWidth = elem.outerWidth(),
				elemHeight = elem.outerHeight(),
				elemTopEdge = elem.offset().top,
				elemBottomEdge = elem.offset().top + elemHeight,
				elemLeftEdge = elem.offset().left,
				elemRightEdge = elem.offset().left + elemWidth,
				tooltipWidth = tooltip.outerWidth(true),
				tooltipHeight = tooltip.outerHeight(true);
			
			//Расчитываем координаты в зависимости от позиции
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
		//Добавляем тултип на страницу и позиционируем
		$('body').append(tooltip);
		_setPosition(object, tooltip, options.position);
		//Мониторим ресайз страницы и перепозиционируем
		$(window).resize(function() {
			_setPosition(object, tooltip, options.position);
		});
	};
	$.fn.tooltipRemove = function() {
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
			_resetValidate(); //Сбрасываем текущие тултипы
			//Для каждого инпута в записимости от типа данных
			//выполняем проверку
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


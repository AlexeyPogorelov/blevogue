
var animationPrefix = (function () {
		var t,
		el = document.createElement("fakeelement");
		var transitions = {
			"transition": "animationend",
			"OTransition": "oAnimationEnd",
			"MozTransition": "animationend",
			"WebkitTransition": "webkitAnimationEnd"
		};
		for (t in transitions) {

			if (el.style[t] !== undefined) {

				return transitions[t];

			}

		}
	})(),
	transitionPrefix = (function () {
		var t,
		el = document.createElement("fakeelement");
		var transitions = {
			"transition": "transitionend",
			"OTransition": "oTransitionEnd",
			"MozTransition": "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		};
		for (t in transitions) {

			if (el.style[t] !== undefined) {

				return transitions[t];

			}

		}
	})(),
	loading = {
		avgTime: 3000,
		trg: 1,
		state: 0,
		preloader: $('body > .preloader'),
		loaded: function () {

			if(++loading.state == loading.trg) {

				loading.status(1);
				setTimeout(loading.done, 500);

			} else {

				loading.status(loading.state / loading.trg / 1.1);

			}
		},
		status: function (mult) {

			loading.preloader.find('> .after').css({
				'width': mult * 100 + '%'
			});

		},
		done: function () {

			if (loading.finished) {

				return;
			}

			// TODO temp for develop
			$('section.articles-gallery-1 > article, .article-content, .article-name, .article-date').find('p, h1, h2, h3, h4, h5, h6, blockquote, span').attr('contenteditable', true).on('click', function (e) {
				e.preventDefault();
			});
			$('.article-holder-1 a').on('click', function (e) {
				e.preventDefault();
			});
			// end todo

			// initialize plugins
			$('#main-slider').simpleSlider();

			// WOW init
			if ($.browser.desktop) {

				$('.fadeInUp').addClass('wow fadeInUp');
				$('.fadeInRight').addClass('wow fadeInRight');

				$('section.articles-gallery-1 > article').addClass('wow fadeInUp');

				new WOW().init();

			}

			// blockquote capital letter
			(function () {
				var $blockquote = $('blockquote');
				if ($blockquote.length) {
					$blockquote.each(function () {
						var $self = $(this),
							letter = $self.text().substring(0,1).toUpperCase(),
							text = $self.text().substring(1);
						$self.text( text );
						$self.prepend('<span class="capital"><span>' + letter + '</span><svg><text x="0" y="1em">' + letter + '</text></svg></span>');
					});
				}
			})();

			// hide preloader
			loading.preloader.animate({}).delay(100).animate({
				'opacity': 0
			}, 600, function () {

				loading.status(0);
				$(this).detach();
				loading.finished = true;

			});

		}
	};

	// TODO test it
	$('img').each(function () {

		if (!this.naturalWidth || true) {

			loading.trg ++;
			$(this).one('load', loading.loaded);

		}

	});

setTimeout(function () {

	loading.status(1);
	setTimeout(loading.done, 500);

}, 10000);

$(window).on('load', function () {

	loading.status(1);
	setTimeout(loading.done, 500);

});

$(document).on('ready', function () {
	var $window = $(window),
		winWidth = $window.width(),
		winHeight = $window.height(),
		dom = {
			$body: $('body')
		},
		bodyOverflow = {
			fixBody: function () {

				$('body').width($('body').width())
					.addClass('fixed');

			},
			unfixBody: function () {

				$('body')
					.css({
						'width': 'auto'
					})
					.removeClass('fixed');

			},
			resize: function () {

				this.unfixBody();

			}.bind(this)

		},
		goUp = (function () {

			var $el = $('#to-top'),
				state = false,
				speed = 900,
				paused = false;
			var plg = {
				up: function () {

					paused = true;

					$("html, body").stop().animate({scrollTop:0}, speed, 'swing', function () {

						paused = false;

					}).one('touchstart mousewheel DOMMouseScroll wheel', function () {

						$(this).stop(false, false).off('touchstart mousewheel DOMMouseScroll wheel');
						paused = false;

					});

					plg.hide();

				},
				show: function () {

					if (!state && !paused) {

						$el.addClass('opened');

						state = true;

					}

				},
				hide: function () {

					if (state) {

						$el.removeClass('opened');

						state = false;

					}

				},
				$el: $el
			};

			$el.on('click', function () {

				plg.up();

			});

			return plg;

		})();

		// parallax
		(function () {

			var $parallaxElemens = $('.parallax-element');

			$window.on('scroll', function () {

				var offset = $(this).scrollTop() / 4 - ( $window.height() / 2 );

				$parallaxElemens.css({
					'-webkit-transform': 'translateY(' + offset + 'px)',
					'transform': 'translateY(' + offset + 'px)'
				});

			});

		})();

		// modals
		var modals = {
			opened: [],
			openModal: function ($modal) {

				if (!$modal.data('modal-ununique')) {
					modals.closeModal();
				}
				this.opened.push($modal);
				$modal.addClass('opened');

				bodyOverflow.fixBody();

			},
			closeModal: function ($modal) {

				if ($modal && $modal instanceof jQuery) {

					$modal.removeClass('opened');

					bodyOverflow.unfixBody();

				} else if ($modal) {

					this.closeModal( $( $modal ) );

					return;

				} else if (this.opened.length > 0) {

					for (var y = 0; y < this.opened.length; y++) {

						this.closeModal( this.opened[y] );

					}

					return;

				}
				
				if (this.opened.length > 1) {

					var modal = $modal.get(0);

					// TODO test it
					for (var i = 0; i < this.opened.length; i++) {

						if (modal == this.opened[i].get(0)) {

							this.opened.splice(i, 1);

							break;

						}

					}

				} else {

					this.opened = [];

				}

			}
		};

		$('[data-modal]').on('click', function (e) {

			e.preventDefault();

			var $self = $(this),
				target = $self.attr('data-modal'),
				$target = $(target);

			if ($target.length) {

				modals.openModal($target);

			} else {

				console.warn('Ошибка в элементе:');
				console.log(this);
				console.warn('Не найдены элементы с селектором ' + target);

			}
			
		});

		$('[data-close]').on('click', function (e) {

			e.preventDefault();

			var $self = $(this),
				target = $self.attr('data-close'),
				$target;

			if (target) {

				$target = $(target);

				if ($target.length) {

					modals.closeModal( $target );

				}

			} else {

				modals.closeModal( $self.closest('.opened') );

			}

		});

		$('.modal-holder').on('click', function (e) {

			if (e.target === this) {

				modals.closeModal( $(this) );

			}

		});

		$window.on('keyup', function (e) {

			// esc pressed
			if (e.keyCode == '27') {

				modals.closeModal();

			}

		});

		// add content button
		var createContent = function (type) {

			if ( typeof createContent[type] === 'function') {

				var $editor = createContent[type]();
				this.before( $editor );

			} else {

				console.warn('К сожалению, тип ' + type + ' не предусмотрен программой');
				console.log(this);

			}

		};

		createContent.text = function () {

			var $content = $('<div>', {
					'class': 'editor'
				}),
				$field = editorMethods.createField().appendTo($content),
				$controls = $('<div>', {
					'class': 'controls'
				}).insertBefore($field);

			// controls
			controlsGroups.basic($controls, $field);

			// console.log('text');

			return $content;

		};

		createContent.table = function() {

			var $content = $('<div>')
				.addClass('editor')
				.attr('contenteditable', true);
			// console.log('table');

			return $content;

		};

		$('[data-add-content]').each(function () {

			var $self = $(this);

			$self.on('click', function (e) {

				createContent.call($self, e.target.getAttribute('data-type') );

			});

		});

		// articles hover
		(function () {

			var $gallery = $('.articles-gallery-1');
				$gallery.find('article > .image-holder, .description').hover(function () {
					$(this).closest('article').addClass('hover');
				}, function () {
					$(this).closest('article').removeClass('hover');
				});

		})();

		// cross overflow fix
		(function () {

			$('.modal-holder.cross-bottom').each(function () {

				var $self = $(this);
				$self.on('scroll', function () {

					$(this).find('.close-modal').css({
						'bottom': -$self.scrollTop()
					});

				});

			});

			$('.modal-holder.cross-top').each(function () {

				var $self = $(this);
				$self.on('scroll', function () {

					$(this).find('.close-modal').css({
						'top': $self.scrollTop()
					});

				});

			});

		})();

		// svg width autoresize
		(function () {

			var $svgs = $('.navigation-pannel'),
				resize = function () {

						$svgs.find('.active').each(function () {

							var $self = $(this),
								elWidth = $self.find('span').width();

							$self.find('svg').width( elWidth + 2 );

						});

					};

			resize();
			$window.on('resize', resize);

		})();

		//scroll
		$(document).on('scroll', function () {

			var top = $(this).scrollTop();

			if (top > winHeight / 2) {

				goUp.show();

			} else {

				goUp.hide();

			}

		});

		// resize
		$window.on('resize', function () {

			winWidth = $window.width();
			winHeight = $window.height();

		});

});

// parallax and socials
function parallaxSocials () {

	if ($.browser.mobile) return;

	var windowHeight,
		$parallaxElemens = $('.parallax-element'),
		$parallaxArticle = $('.article-holder-3 > article:nth-child(2)'),
		$socialsElement = $('#fixed-socials'),
		$articleHeader = $('.article-header'),
		$articleComments = $('.comments-holder'),
		socialsStatus = {},
		socialsElement = $socialsElement.get(0),
		currentDoc = (document.documentElement || document.body.parentNode || document.body),
		currentParent = (window.pageYOffset !== undefined) ? window : currentDoc,
		currentOffset = (window.pageYOffset !== undefined) ? 'pageYOffset' : 'scrollTop',
		resizeFunction = function () {

			if (socialsElement) {

				windowHeight = $(window).height();
				socialsStatus.start = $articleHeader.height() + parseInt( $articleHeader.css('margin-top') );
				socialsStatus.end = $articleComments.offset().top - $socialsElement.height() - 100;
				socialsStatus.left = $articleHeader.find('.container').offset().left;
				socialsElement.style.transform = 'translateY(' + socialsStatus.start + 'px)';
				// console.log( socialsStatus.end );
				// console.log( socialsStatus.end );
				if ( socialsStatus.left === 0) {

					socialsStatus.left = $('.article-page').offset().left;

				}
				$socialsElement.css('left', socialsStatus.left);

			}

		};
		resizeFunction();

		$(window).on('scroll', function () {

			var top = currentParent[currentOffset];

			// console.time('timerName');
			for (var i = $parallaxElemens.length - 1; i >= 0; i--) {
				$parallaxElemens[i].style.transform = 'translateY(' + top / 2 + 'px) translateZ(0)';
			}

			if (socialsElement) {

				if ( top > socialsStatus.end ) {

					$socialsElement.removeClass('fixed');
					socialsElement.style.transform = 'translateY(' + socialsStatus.end + 'px) translateZ(0)';

				} else if ( top < socialsStatus.start ) {

					$socialsElement.removeClass('fixed');
					socialsElement.style.transform = 'translateY(' + socialsStatus.start + 'px) translateZ(0)';

				} else {

					$socialsElement.addClass('fixed');
					socialsElement.style.transform = 'translateY(0px) translateZ(0)';
					// socialsElement.style.transform = 'translateY(' + top + 'px) translateZ(0)';

				}

			}

			if ( socialsElement && top > socialsStatus.start && top < socialsStatus.end ) {


			} else if ( socialsElement && top > socialsStatus.end ) {


			} else if ( socialsElement ) {


			}

			// for (var i = 0; i < $parallaxArticle.length; i++) {
				// $parallaxArticle[i].style.transform = 'translateY(' + top / -20 + 'px)';
			// }
			// console.timeEnd('timerName');

		}).on('resize', resizeFunction);

}

var loading = {
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
			$('section.articles-gallery-1 > article, .article-content, .article-name, .article-date, .video').find('p, h1, h2, h3, h4, h5, h6, blockquote, span').attr('contenteditable', true).on('click', function (e) {
				e.preventDefault();
			});
			$('.article-holder-1 a').on('click', function (e) {
				e.preventDefault();
			});
			// end todo

			// initialize plugins
			$('#main-slider').simpleSlider();
			$('body').trigger('scroll');

			// parallax and socials
			parallaxSocials ();

			// WOW init
			if ($.browser.desktop) {

				$('.fadeInUp').addClass('wow fadeInUp');
				$('.fadeInRight').addClass('wow fadeInRight');

				$('#main-slider').addClass('wow');
				$('section.articles-gallery-1 article').addClass('wow');

				new WOW().init();

			}

			// blockquote capital letter
			(function () {
				var $blockquote = $('blockquote');
				if ($blockquote.length) {
					$blockquote.each(function () {
						var $self = $(this),
							letter = $self.text().substring(0,1).toUpperCase(),
							text = $self.text().substring(1),
							$capital = $('<span>').addClass('capital'),
							$original = $('<span>').addClass('original').text( letter ),
							$fake = $('<svg><text x="0" y="1em">' + letter + '</text></svg>'),
							$content = $('<span>').addClass('content').text( text ),
							timeout;
						$self.text('');
						$self.prepend([

							$capital.prepend([

								$original,
								$fake

							])

						]).append( $content );

						timeout = setTimeout(function () {

							$self.css({
								'padding-left': $original.innerWidth()
							});

						}, 300);

						$(window).on('resize', function () {

							clearTimeout( timeout );
							timeout = setTimeout(function () {

								$self.css({
									'padding-left': $original.innerWidth()
								});

							}, 300);

						});
					});
				}
			})();

			// hide preloader
			loading.preloader.animate({}).delay(100).animate({
				'opacity': 0
			}, 600, function () {

				$(window).trigger('resize');
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
		bodyHeight = $('body').height(),
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

		// articles and videos hover
		(function () {

			var $gallery = $('.articles-gallery-1');
				$gallery.find('article > .image-holder, .description').hover(function () {
					$(this).closest('article').addClass('hover');
				}, function () {
					$(this).closest('article').removeClass('hover');
				});

			var $videos = $('.video-gallery');
				$videos.find('.image-container > .image-holder, .description-container').hover(function () {
					$(this).closest('.video').addClass('hover');
				}, function () {
					$(this).closest('.video').removeClass('hover');
				});

		})();

		// cross overflow fix
		(function () {

			$('.modal-holder.cross-bottom').each(function () {

				var $self = $(this),
					$cross = $self.find('.close-modal');
				$self.on('scroll', function (e) {
					e.stopPropagation();

					$cross.css({
						'bottom': -$self.scrollTop()
					});

				});

			});

			$('.modal-holder.cross-top').each(function () {

				var $self = $(this),
					$cross = $self.find('.close-modal');
				$self.on('scroll', function (e) {
					e.stopPropagation();

					$cross.css({
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

			if (top > bodyHeight - winHeight) {

				goUp.show();

			} else {

				goUp.hide();

			}

		});

		// resize
		$window.on('resize', function () {

			winWidth = $window.width();
			winHeight = $window.height();
			bodyHeight = $('body').height();

		});

});
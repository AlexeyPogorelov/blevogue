
if ($.browser.mobile) $('body').addClass('mobile');
if ($.browser.safari) $('body').addClass('safari');

// TODO test touched
if ($.browser.safari) $('.slider-holder').addClass('touched');

if ($.browser.safari && $.browser.mobile) $('body').addClass('safari-mobile');

var blevogue = {};

// WOW classes
(function () {
	if ($.browser.mobile) return;

	blevogue.$wowElements = $('.fadeInUp, .fadeInRight, #main-slider, section.articles-gallery-1 article').addClass('wow');

})();

// additional elements
(function () {
	if ($(window).width() < 480) return;

	var $articlesGallery = $('section.articles-gallery-1');

	// add parallax elements
	if ( $articlesGallery.length === 0 ) return;

	$articlesGallery.find('.article-holder-1').each(function (i) {

		if (i % 2) {

			// $(this).append('<div class="parallax-element type-16"></div><div class="parallax-element type-15"></div>');

		} else {

			$(this).append('<div class="parallax-element type-1"></div><div class="parallax-element type-2"></div>');

		}

	});
	$articlesGallery.find('.article-holder-2').append('<div class="parallax-element type-5"></div><div class="parallax-element type-6"></div><div class="parallax-element type-3"></div><div class="parallax-element type-4"></div>');

	$articlesGallery.find('.article-holder-3').each(function (i) {

		if (i % 2) {

			$(this).append('<div class="parallax-element type-20"></div><div class="parallax-element type-21"></div>');

		} else {

			$(this).append('<div class="parallax-element type-7"></div>');

		}

	});

	$articlesGallery.find('.article-holder-4').append('<div class="parallax-element type-11"></div><div class="parallax-element type-12"></div>');
	$articlesGallery.find('.article-holder-5').append('<div class="parallax-element type-13"></div><div class="parallax-element type-14"></div>');

	$articlesGallery.find('.article-holder-7').each(function (i) {

		if (i % 2) {

			$(this).append('<div class="parallax-element type-17"></div><div class="parallax-element type-18"></div><div class="parallax-element type-19"></div>');

		} else {

			$(this).append('<div class="parallax-element type-8"></div><div class="parallax-element type-10"></div><div class="parallax-element type-9"></div>');

		}

	});

	$articlesGallery.find('.article-holder-8').append('<div class="parallax-element type-17"></div><div class="parallax-element type-18"></div></div><div class="parallax-element type-19"></div>');

})();

// parallax and socials
function parallaxSocials () {

	if ($.browser.mobile) return;

	var windowHeight,
		$parallaxElemens = $('.parallax-element'),
		parallaxElemens = [],
		$parallaxArticle = $('section.articles-gallery-1 .article-holder-3 > article:nth-child(2), section.articles-gallery-1 .article-holder-4 > article:nth-child(2), section.articles-gallery-1 .article-holder-5 > article:nth-child(2), section.articles-gallery-1 .article-holder-6 > article:nth-child(2), section.articles-gallery-1 .article-holder-8 > article'),
		$socialsElement = $('#fixed-socials-2'),
		$articleHeader = $('.article-header'),
		$articleComments = $('.comments-holder'),
		$articlesControl = $('#articles-control'),
		$articlesControlLine = $articlesControl.find('.line'),
		$articlesGallery = $('.articles-gallery-1'),
		articlesGalleryStatus = {},
		articlesControlStatus = 0,
		socialsStatus = {},
		socialsElement = $socialsElement.get(0),
		currentDoc = (document.documentElement || document.body.parentNode || document.body),
		currentParent = (window.pageYOffset !== undefined) ? window : currentDoc,
		currentOffset = (window.pageYOffset !== undefined) ? 'pageYOffset' : 'scrollTop',
		scrollFunction = function () {

			var top = currentParent[currentOffset];
				// viewArea = windowHeight + top;

			// console.time('timerName');
			requestAnimFrame(function () {

				try {

					if ( top > articlesGalleryStatus.start && top + windowHeight * 1.3 < articlesGalleryStatus.end && articlesControlStatus === 0) {

						$articlesControl.addClass('opened');
						articlesControlStatus = 1;

					} else if ( (top < articlesGalleryStatus.start || top + windowHeight * 1.3 > articlesGalleryStatus.end ) && articlesControlStatus === 1) {

						$articlesControl.removeClass('opened');
						articlesControlStatus = 0;

					}

					$articlesControlLine.css('height', ( top - $articlesGallery.offset().top ) / $articlesGallery.height() * 100  + "%" );

				} catch (e) {}

				if (parallaxElemens.length) {

					for (var i = parallaxElemens.length - 1; i >= 0; i--) {

						var parallaxElementTempoTop = parallaxElemens[i].el.getBoundingClientRect().top;

						if ( parallaxElementTempoTop < -windowHeight || parallaxElementTempoTop > windowHeight * 2 ) continue;

						parallaxElemens[i].el.style.transform = 'translateY(' + Math.round( -( parallaxElementTempoTop - windowHeight / 2 ) * parallaxElemens[i].mult ) + 'px) translateZ(0)';

					}

					for (var y = $parallaxArticle.length - 1; y >= 0; y--) {

						var parallaxArticleTempoTop = $parallaxArticle[y].getBoundingClientRect().top;

						if ( parallaxArticleTempoTop < -windowHeight || parallaxArticleTempoTop > windowHeight * 2 ) continue;

						$parallaxArticle[y].style.top = ( parallaxArticleTempoTop - windowHeight / 2 ) * 0.15 + 'px';

					}

				}

				if ( top > socialsStatus.end ) {

					$socialsElement.addClass('invisible');

				} else {

					$socialsElement.removeClass('invisible');

				}

			});
			// console.timeEnd('timerName');

		},
		resizeFunction = function () {

			windowHeight = $(window).height();

			try {

				if (socialsElement) {

					socialsStatus.end = $articleComments.offset().top + $articleComments.height() - windowHeight / 2;

				}

			} catch (e) {

				console.error(e);

			}


			if ($articlesGallery.length) {

				articlesGalleryStatus.start = $articlesGallery.offset().top;
				articlesGalleryStatus.end = $articlesGallery.offset().top + $articlesGallery.height();
			}

			parallaxElemens = [];
			$parallaxElemens.each(function (i) {

				var $self = $(this),
					offset,
					type,
					transformBackup = $self.css('transform');

				if (transformBackup !== 'none') {

					transformBackup = transformBackup.split('(')[1];
					transformBackup = transformBackup.split(')')[0];
					transformBackup = transformBackup.split(',');
					transformBackup = transformBackup[5];
					transformBackup = parseFloat( transformBackup );

				} else {

					transformBackup = 0;

				}

				type = parseInt(this.className.replace('parallax-element type-', ''));

				switch (type) {
					case 0: {
						mult = -0.12;
						break;
					}
					case 1: {
						mult = -0.12;
						break;
					}
					case 2: {
						mult = -0.2;
						break;
					}
					case 3: {
						mult = -0.25;
						break;
					}
					case 4: {
						mult = -0.25;
						break;
					}
					case 5: {
						mult = -0.2;
						break;
					}
					case 6: {
						mult = -0.2;
						break;
					}
					case 7: {
						mult = 0.3;
						break;
					}
					case 8: {
						mult = 0.1;
						break;
					}
					case 9: {
						mult = 0.3;
						break;
					}
					case 10: {
						mult = 0.6;
						break;
					}
					case 11: {
						mult = 0.6;
						break;
					}
					case 12: {
						mult = 0.3;
						break;
					}
					case 13: {
						mult = 0.2;
						break;
					}
					case 14: {
						mult = 0.3;
						break;
					}
					case 15: {
						mult = 0.2;
						break;
					}
					case 16: {
						mult = 0.3;
						break;
					}
					case 17: {
						mult = 0.3;
						break;
					}
					case 18: {
						mult = 0.1;
						break;
					}
					case 19: {
						mult = 0.25;
						break;
					}
					case 20: {
						mult = 0.3;
						break;
					}
					case 21: {
						mult = 0.2;
						break;
					}
					default: {
						mult = 0.5;
						break;
					}
				}

				parallaxElemens.push({
					el: this,
					mult: mult,
					offset: $self.offset().top - transformBackup
				});

			});

			scrollFunction();

		};

		if (!$articleHeader.length) {

			$articleHeader = $('.article-video-header');

		}

		resizeFunction();

		$(window).on('scroll', scrollFunction).on('resize', resizeFunction);

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

		if (loading.finished) return;

		$("html, body").scrollTop(0);

		// TODO temp for developing
		// $('section.articles-gallery-1 > article, .article-content, .article-name, .article-date, .video, .article-page, #about-modal .content-holder').find('p, h1, h2, h3, h4, h5, h6, blockquote, span').attr('contenteditable', true).on('click', function (e) {
		// 	e.preventDefault();
		// });
		// $('.article-holder-1 a').on('click', function (e) {
		// 	e.preventDefault();
		// });
		var loct = location.href.split('/');
		loct = loct[loct.length - 1];
		$('[href="' + loct + '"]').closest('li').addClass('active');

		$('.btn.load-more').on('click', function () {
			var $this = $(this),
				$container = $this.closest('.container'),
				$button = $container.find('.load-more-holder, .pagination-1'),
				$articles = $container.find('article'),
				$clonedArticles;

			$button.remove();

			$container.find('.counter, hr').remove();

			$clonedArticles = $( $container.html() );
			$clonedArticles.addClass('wow').append('<div class="gap"></div>');

			_pogorelov.countArticlas($clonedArticles.find('article'), $articles.length);
			_pogorelov.addHoverOnArticle( $clonedArticles.find('article') );
			$clonedArticles.find('article').css('top', 0);

			$('#articles-control').find('.last-element').html( $articles.length * 2 );

			$container.append( $clonedArticles );
				// $articles.eq($articles.length - 1);

			setTimeout(function () {
				$('body').trigger('resize');
			}, 100);
		});
		// end todo

		// initialize plugins
		_pogorelov.mainSlider =  $('#main-slider').simpleSlider();
		$('body').trigger('scroll');

		// parallax and socials
		parallaxSocials ();

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
								'padding-left': $original.innerWidth() - 10
							});

						}, 100);

					});
				});
			}
		})();

		$('.slider-holder').addClass('touched');

		setTimeout(function () {

			// WOW init
			if ($.browser.desktop) {

				new WOW().init();

			}

		}, 380);

		// hide preloader
		loading.preloader.addClass('done').animate({}).delay(400).animate({
			'opacity': 0
		}, 400, function () {

			bodyOverflow.unfixBody();

			$(window).trigger('scroll').trigger('resize');

			if (blevogue.$wowElements) {

				blevogue.$wowElements.on(transitionPrefix + ' ' + animationPrefix, function (e, classes) {

					if (e.target !== this) return;

					var $self = $(this);
					$self.removeClass('wow animated');

					if (typeof classes === 'string') $self.removeClass(classes);

					if (classes instanceof Array) {
						for (var i = 0; i < classes.length; i++) {
							$self.removeClass(classes[i]);
						}
					}

					$self.off(transitionPrefix + ' ' + animationPrefix);

				});

			}

			$('.slider-holder').removeClass('touched');

			if ($.browser.desktop) {

				$('#main-slider').addClass('wow').on(transitionPrefix, function (e) {

					if ( e.target === this ) {

						$(this).removeClass('wow animated').off(transitionPrefix);

					}

				});

			}

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
	setTimeout(loading.done, 100);

}, 30000);

$(window).on('load', function () {

	loading.status(1);
	setTimeout(loading.done, 200);

});

$(document).on('ready', function () {
	var $window = $(window),
		winWidth = $window.width(),
		winHeight = $window.height(),
		bodyHeight = $('body').height(),
		goUp = (function () {

			var $el = $('#to-top'),
				state = false,
				speed = 900,
				paused = false,
				plg = {
					up: function () {

						paused = true;
						state = true;

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


		// #changepassword
		(function () {

			$('[data-toggle]').on('click', function (e) {

				e.preventDefault();

				var $self = $(this),
					$form = $self.closest('form'),
					classes = [],
					$visibleElements,
					$hiddenElements;

				classes.push( $self.attr('data-toggle') + '-visible' );
				classes.push( $self.attr('data-toggle') + '-hidden' );

				$visibleElements = $('.' + classes[0]);
				$hiddenElements = $('.' + classes[1]);

				$visibleElements.removeClass(classes[0]).addClass(classes[1]);
				$hiddenElements.removeClass(classes[1]).addClass(classes[0]);

				$visibleElements.find('input').addClass('skip');
				$hiddenElements.find('input').removeClass('skip');

			});

		})();

		// article add comment fake textarea
		(function () {

			$('[contenteditable="true"]').each(function () {

				var $self = $(this),
					$textarea,
					fakePlaceholder = null;

				if ($self.hasClass('comment-wysiwyg')) {

					$textarea = $self.siblings('textarea');

					$self.on('keyup', function () {
						$textarea.html( $self.html() );
					}).on('focus', function () {
						if (fakePlaceholder === null) {
							fakePlaceholder = $self.html();
							$self.html('');
						};
						if (fakePlaceholder === $self.html()) $self.html('');
					}).on('blur', function () {
						if (!$self.text().replace(/\n\S/, '')) $self.html( fakePlaceholder );
					});

				}

			});

		})();

		// modals
		var modals = {
			opened: [],
			openModal: function ( $modal ) {

				if (!$modal.data('modal-ununique') && this.opened.length > 0) {
					modals.closeModal( this.opened[this.opened.length - 1], true );
				}
				this.opened.push( $modal );
				// $modal.addClass('opened').one( transitionPrefix, bodyOverflow.fixBody );

				$modal.off( transitionPrefix ).addClass('opened');
				bodyOverflow.fixBody();

				if ( $modal.is('[data-cross]') ) {

					this.$cross = $('<div>').addClass('cross-top-fixed animated ' + $modal.attr('data-cross') ).one('click', function () {

						modals.closeModal();

					}).one(animationPrefix, function () {

						$(this).removeClass( 'animated' );

					}).appendTo('body');

				}

			},
			closeModal: function ($modal, alt) {

				if ( this.opened.length > 0 && !$modal ) {

					for ( var y = 0; y < this.opened.length; y++ ) {

						this.closeModal( this.opened[y] );

					}

					return;

				} else if ( $modal && !($modal instanceof jQuery) ) {

					$modal = $( $modal );

				} else if ( $modal === undefined ) {

					throw 'something went wrong';

				}

				try {

					$modal.removeClass('opened');

				} catch (e) {

					console.error(e);

					this.closeModal();

					return;

				}

				this.opened.pop();

				if (!alt) {

					$modal.one( transitionPrefix, bodyOverflow.unfixBody );

					try {

						this.$cross.addClass('fadeOut').one(animationPrefix, function () {

							$(this).remove();

						});

					} catch (e) {

						console.error(e);

					}

				} else {

					this.$cross.remove();

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

		$('.modal-holder').not('.fake').on('click', function (e) {

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

			controlsGroups.basic($controls, $field);

			return $content;

		};

		createContent.table = function() {

			var $content = $('<div>')
				.addClass('editor')
				.attr('contenteditable', true);

			return $content;

		};

		$('[data-add-content]').each(function () {

			var $self = $(this);

			$self.on('click', function (e) {

				createContent.call($self, e.target.getAttribute('data-type') );

			});

		});

		// articles, slides and videos hover
		(function () {

			if ($.browser.mobile) return;

			var $mainSliderControls = $('#main-slider-controls');

			window._pogorelov.addHoverOnVideo = function ($el) {

				if ( !($el instanceof jQuery) ) return;

				$el.hover(function () {

						var $self = $(this),
							$video = $self.closest('.video'),
							bg = $video.find('> .image-container > .image-holder').css('background-color');
							$video.addClass('hover');

					}, function () {

						$(this).closest('.video').removeClass('hover');

					});

			};

			window._pogorelov.addHoverOnArticle = function ($el) {

				if ( !($el instanceof jQuery) ) return;

				$el.hover(function () {

					var $self = $(this),
						$article = $self.closest('article'),
						bg = $article.find('> .image-holder, .image-container > .image-holder').css('background-color');

					$article.closest('article').addClass('hover');
					$article.find('.date-holder, .description h3, .counter').css('color', bg);
					$article.find('.description').css({
						'border-color': bg,
						'outline-color': bg
					});

				}, function () {

					var $self = $(this),
						$article = $self.closest('article');

					$article.closest('article').removeClass('hover wow animated');
					$article.find('.date-holder, .description, .description h3, .counter').attr('style', '');

				});

			};

			window._pogorelov.countArticlas = function ($el, start) {

				if ( !($el instanceof jQuery) ) return;

				if (typeof start !== 'number') start = 0;

				$el.each(function (i) {

						var $self = $(this);
							count = i + 1 + start,
							$count = $('<div>').addClass('counter');

						if (count < 10) count = '0' + count;

						$count.html(count).appendTo($self);

					});

			};

			// add .line
			var $gallery = $('.articles-gallery-1, .articles-gallery-2, .video-gallery');
				$gallery.find('article').each(function (i) {

						var $self = $(this);
							$line = $('<div>').addClass('line'),
							bg = $self.find('> .image-holder, .image-container .image-holder').css('background-color');

						$line.css({
							'background-color': bg
						});
						$self.find('.description').append($line);

					});
				_pogorelov.countArticlas( $gallery.find('article') );
				_pogorelov.addHoverOnArticle( $gallery.find('article > .image-holder, .description') );

			// TODO remove rudimental meth.
			// _pogorelov.addHoverOnVideo( $('.video-gallery').find('.image-container > .image-holder, .description-container') );
			_pogorelov.addHoverOnArticle( $('.video-gallery').find('.image-container > .image-holder, .description-container') );

			$('#main-slider').on('mouseenter', '.image-holder', function () {
				var $self = $(this),
					$slide = $self.closest('.slide'),
					id = $slide.attr('data-id');
				$slide.closest('#main-slider').find('[data-id=' + id + ']').addClass('hover');

				// TODO mod hover
				if ($slide.hasClass('cloned')) {
					if ( id > _pogorelov.mainSlider.getCurrent() ) {
						$mainSliderControls.find('.slide-prev').addClass('hover');
					} else if ( id < _pogorelov.mainSlider.getCurrent() ) {
						$mainSliderControls.find('.slide-next').addClass('hover');
					}
				} else {
					if ( id < _pogorelov.mainSlider.getCurrent() ) {
						$mainSliderControls.find('.slide-prev').addClass('hover');
					} else if ( id > _pogorelov.mainSlider.getCurrent() ) {
						$mainSliderControls.find('.slide-next').addClass('hover');
					}
				}

			}).on('mouseleave', '.image-holder', function () {
				var $self = $(this),
					id = $self.closest('.slide').attr('data-id');
				$self.closest('#main-slider').find('[data-id=' + id + ']').removeClass('hover');

				if ($mainSliderControls.length) {
					$mainSliderControls.find('.slide-prev, .slide-next').removeClass('hover');
				}

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

		// shuffle array
		Array.prototype.shuffle = function() {

			for (var i = this.length - 1; i > 0; i--) {

				var num = Math.floor(Math.random() * (i + 1)),
					d = this[num];
				this[num] = this[i];
				this[i] = d;

			}

			return this;

		};

		// main-logo random
		(function () {
			var imagesLinks = window.imagesLogo || [
					'img/icons/blevogue-1.png',
					'img/icons/blevogue-2.png',
					'img/icons/blevogue-3.png',
					'img/icons/blevogue-4.png',
					'img/icons/blevogue-5.png'
				],
				$image = $('.logotype-holder').find('img');

			imagesLinks.shuffle();

			$image.attr('src', imagesLinks[0]);

		})();

		// 404 background update
		(function () {

			var $image = $('.error-404');

			if ($image.length === 0) return;

			var i = 0,
				$loadTrigger = $('<img />'),
				isLoaded = true,
				checkStatus = function (url) {
					$loadTrigger.attr('src', url).one('load', function () {
						isLoaded = true;
					});
				},
				imagesLinks = window.imagesArray404 || [
					'http://www.whowhatwear.com/img/uploads/current/images/0/172/928/main.original.585x0.jpg',
					'http://41.media.tumblr.com/5854c1656eb7158ee7f1a5b73c7109db/tumblr_nz0dacz9o11s8rlzuo1_1280.jpg',
					'http://36.media.tumblr.com/ce291dba4dff54db1fade220e2e52d77/tumblr_nvd4f4c8Ri1s8rlzuo1_1280.jpg',
					'http://40.media.tumblr.com/f67496f497e3b9b3503bc9dfeab039e0/tumblr_npx5uv9ZAt1tqq2cuo1_1280.jpg',
					'http://36.media.tumblr.com/2b3d2196968530a3d6354db86b9dd87b/tumblr_o2ppnfpFeF1qajzcfo1_1280.jpg',
					'http://41.media.tumblr.com/09e6206dd5559a526dce1a34e4f1a027/tumblr_o3ca00zeB21s8rlzuo1_1280.jpg',
					'http://41.media.tumblr.com/58c507c4433829b71ce579feb9fe25f1/tumblr_ndaxigFeZ41tqlchwo1_1280.jpg',
					'http://41.media.tumblr.com/1fc4acc5f2b71fcc0c77ded4004336d6/tumblr_n1a7sbnINJ1rckuolo1_1280.jpg',
					'http://36.media.tumblr.com/d5963b292548566a13d282bc9098d6e3/tumblr_nkg8w58pX01unwfw8o1_500.png',
					'http://36.media.tumblr.com/0097fc0034aa8ec03cdffd8223aa3de1/tumblr_o3f242HCSY1s51980o1_1280.jpg',
					'http://40.media.tumblr.com/8b4ee1bdbdeec8c31fc9b921ae7363da/tumblr_na1vshq8zJ1r7eta3o1_500.jpg',
					'http://40.media.tumblr.com/f67496f497e3b9b3503bc9dfeab039e0/tumblr_npx5uv9ZAt1tqq2cuo1_1280.jpg',
					'http://manrepeller.wpengine.netdna-cdn.com/wp-content/uploads/2015/01/shoe-lifts-man-repeller-1.jpg'
				],
				$imageHelper = $('.background-holder');

			imagesLinks.shuffle();

			$imageHelper.css({
							'background-image': 'url(' + imagesLinks[1] + ')'
						});

			setInterval(function () {

				if (!isLoaded) return;

				isLoaded = false;

				if (i % 2) {

					$image.css({
						'background-image': 'url(' + imagesLinks[i] + ')'
					});


					$imageHelper.removeClass('active').one(transitionPrefix, function () {

						$(this).css({
							'background-image': 'url(' + imagesLinks[i + 1] + ')'
						});

					});

				} else {

					$imageHelper.addClass('active').one(transitionPrefix, function () {

						$image.css({
							'background-image': 'url(' + imagesLinks[i + 1] + ')'
						});

					});

				}

				checkStatus( imagesLinks[i + 1] );

				if (imagesLinks.length - 3 < i) {

					i = 0;

				} else {

					i++;

				}

			}, 1000);

		})();

		// validation
		(function () {

			var $profileForms = $('.profile-holder').find('form');
			$profileForms.validate();

		})();


		//scroll
		// $(document).on('scroll', function () {

		// 	var top = $(this).scrollTop();

		// });

		// resize
		$window.on('resize', function () {

			winWidth = $window.width();
			winHeight = $window.height();
			bodyHeight = $('body').height();

		});

});

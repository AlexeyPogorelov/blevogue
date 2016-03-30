(function ($) {

	$.fn.simpleSlider = function (opt) {

		this.each(function (i) {

			var DOM = {},
				state = {
					'touchStart': {},
					'touchEnd': {}
				},
				self = this,
				$window = $(window);

			// options
			if (!opt) {
				opt = {};
			}
			opt = $.extend({
				'loop': true,
				'interval': false,
				'easing': 'swing',
				'prevClass': 'arrow-left-1',
				'nextClass': 'arrow-right-1',
				'holderClass': '.slides-holder',
				'slideClass': '.slide',
				'nameClass': '.slide-name',
				'imageClass': '.slide-image',
				'pagination': false,
				'clickToNext': false,
				'startSlide': 0,
				'autoHeight': false,
				'mouseWheel': false,
				'mouseDrug': false,
				'touch': true,
				'slidesOnPage': 1
			}, opt);

			// methods
			var plg = {
				cacheDOM: function () {
					DOM.$slider = $(self);
					DOM.$section = $(self).closest('section');
					DOM.$preloader = DOM.$slider.find('.slider-preloader');
					DOM.$viewport = DOM.$slider.find('.slider-viewport');
					DOM.$sliderHolder = DOM.$viewport.find('.slider-holder');
					DOM.$slides = DOM.$sliderHolder.find('.slide');
					DOM.$slides.eq(0).addClass('active');
				},
				init: function () {
					state.cur = state.cur || 0;
					state.slides = DOM.$slides.length;
					state.pages = Math.ceil(DOM.$slides.length / opt.slidesOnPage);
					DOM.$preloader.fadeOut(150);
				},
				resize: function () {

					state.sliderWidth = DOM.$viewport.width();

					if ($window.width() > 300 && opt.slidesOnPage > 1 && $window.width() <= 700) {

						opt.slidesOnPage = Math.floor( opt.slidesOnPage / 2 );
						plg.init();

					}

					DOM.$slides.width( DOM.$viewport.width() / opt.slidesOnPage);

					if (opt.autoHeight) {

						DOM.$slides.height(
								(function ($slides) {
									var max = 1;
									$slides.each(function () {
										var height = $(this).find('> div').outerHeight();
										if (height > max) {
											max = height;
										}
									});
									return max;
								})(DOM.$slides)
							);

					}

					state.slideWidth = DOM.$slides.eq(0).outerWidth();
					DOM.$sliderHolder.width(state.slideWidth * state.slides);
					plg.toSlide(opt.startSlide);
				},
				prevSlide: function () {

					var id = state.cur - 1;
					if (id < 0) {

						// this.toSlide(state.pages - 1);
						this.toSlide(0);

						// horizontalSlider.prevPage();

						return;

					}

					this.toSlide(id);

				},
				nextSlide: function () {

					var id = state.cur + 1;
					if (id >= state.pages) {
						// this.toSlide(0);
						this.toSlide(state.pages - 1);

						// TODO test it
						// horizontalSlider.nextPage();

						return;
					}

					this.toSlide(id);

				},
				toSlide: function (id) {

					if ( id < 0 || id >= state.pages ) {
						return;
					}
					DOM.$sliderHolder.css({
						'-webkit-transform': 'translateX( -' + (state.sliderWidth * id) + 'px) translateZ(0)',
						'transform': 'translateX( -' + (state.sliderWidth * id) + 'px) translateZ(0)'
					});
					DOM.$slides.eq(id).addClass('active').siblings().removeClass('active');
					DOM.$pagination.find('.page').eq(id).addClass('active').siblings().removeClass('active');
					state.cur = id;

				},
				createPagination: function () {

					if (DOM.$pagination) {

						DOM.$pagination.empty();

					} else {

						DOM.$pagination = $('<div>').addClass('paginator-holder');

						if (opt.pagination || true) {

							DOM.$pagination.appendTo(DOM.$slider);

						}

					}

					$('<div>')
						.addClass('prev-slide')
						.appendTo(DOM.$pagination);

					for (var i = 0; i < state.pages / opt.slidesOnPage; i++) {
						var page = $('<div>').data('page', i).addClass('page');

						if (!i) {

							page.addClass('active');

						}

						DOM.$pagination.append(page);
					}

					$('<div>')
						.addClass('next-slide')
						.appendTo(DOM.$pagination);

				}
			};

			plg.cacheDOM();
			plg.init();
			plg.createPagination();
			plg.resize();

			// resize
			$window.on('resize', function () {
				plg.resize();
			});

			// click events
			DOM.$slider.on('click', function (e) {

				var $target = $(e.target);

				if ($target.hasClass('page')) {

					plg.toSlide($(e.target).data('page'));

				} else if ($target.hasClass('prev-slide')) {

					plg.prevSlide();

				} else if ($target.hasClass('next-slide')) {

					plg.nextSlide();

				} else if (opt.clickToNext && $target.parents('.slide').length) {

					plg.nextSlide();

				}

			});

			if (opt.mouseWheel) {

				DOM.$slider.on('DOMMouseScroll wheel', function (e) {

					e.preventDefault();
					e.stopPropagation();

					var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail || -e.originalEvent.deltaY;
					if (true || pagesState.lastScrollTime - 50 < new Date().getTime()) {
						if (delta > 0) {

							plg.prevSlide();

						} else if (delta < 0) {

							plg.nextSlide();

						}
					}

				}).on('mousewheel', function (e) {

					e.preventDefault();
					e.stopPropagation();

					var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail || -e.originalEvent.deltaY;
					if (true || pagesState.lastScrollTime - 50 < new Date().getTime()) {
						if (delta > 0) {

							plg.prevSlide();

						} else if (delta < 0) {

							plg.nextSlide();

						}
					}

				});

			}

			if (opt.touch) {

				// drag events

				DOM.$slider.on('touchstart', function (e) {
					// state.touchStart.xPos = e.originalEvent.touches[0].clientX;
					// state.touchStart.yPos = e.originalEvent.touches[0].clientY;
					state.touchStart.timeStamp = e.timeStamp;
					// console.log('-----');
				}).on('touchmove', function (e) {
					state.touchEnd.xPos = e.originalEvent.touches[0].clientX;
					state.touchEnd.yPos = e.originalEvent.touches[0].clientY;

					if (!state.touchStart.xPos) {

						state.touchStart.xPos = e.originalEvent.touches[0].clientX;

					}

					if (!state.touchStart.yPos) {

						state.touchStart.yPos = e.originalEvent.touches[0].clientY;

					}

				}).on('touchend', function (e) {
					var distance = 70,
						speed = 200,
						deltaX = state.touchEnd.xPos - state.touchStart.xPos,
						deltaY = Math.abs(state.touchEnd.yPos - state.touchStart.yPos);
					state.touchEnd.xPos = 0;
					state.touchEnd.yPos = 0;
						// time = e.timeStamp - state.touchStart.timeStamp;
					// console.log('-----');
					// console.log(time);
					// console.log(deltaX);
					// console.log((deltaY));
					// console.log(state.touchEnd.originalEvent.touches[0].clientX);
					// console.log(state.touchStart.originalEvent.touches[0].clientX);
					if (deltaX > distance || -deltaX > distance) {
						if (deltaX < 0) {
							plg.nextSlide();
						} else {
							plg.prevSlide();
						}
					}
					deltaX = null;
					deltaY = null;
					state.touchEnd.xPos = null;
					state.touchEnd.yPos = null;
					state.touchStart.xPos = null;
					state.touchStart.yPos = null;
				});
				// DOM.$slider.on('ondragstart', function (e) {
				// 	e.preventDefault();
				// 	return false;
				// });
				DOM.$slider.find('img').each(function () {
					this.ondragstart = function() {
						return false;
					};
				});
			}
			// DOM.$slides.on('ondragstart', function (e) {
			// });
			if (opt.mouseDrug) {

				DOM.$section.on('mousedown', function (e) {
					DOM.$sliderHolder.addClass('touched');
					state.touchStart.xPos = e.pageX;
					state.touchStart.yPos = e.pageY;
					try {

						state.touchStart.trfX = -parseInt( DOM.$sliderHolder.css('transform').split(',')[4] );

					} catch (error) {

						console.warn('transform is undefined');
						console.log(error);

					}
						// console.log( state.touchStart.trfX );

				}).on('mousemove', function (e) {
					if (e.buttons < 1) {
						touchendCleaner ();
					} else if (state.touchStart.xPos) {

						state.shiftD = state.touchStart.xPos - e.pageX;
						state.shiftX = state.touchStart.trfX + state.shiftD;

						// console.log( state.shiftX );
						// console.log( state.touchStart.trfX );
						// console.log( state.touchStart.xPos - e.pageX );

						DOM.$sliderHolder.css({
							'-webkit-transform': 'translateX( ' + -state.shiftX + 'px) translateZ(0)',
							'transform': 'translateX( ' + -state.shiftX + 'px) translateZ(0)'
						});

					}
				}).on('mouseup mouseleave', function (e) {
					// console.log(state.shiftD);
					if ( Math.abs(state.shiftD) > 40 ) {
						if (state.shiftD > 0) {
							plg.nextSlide();
						} else {
							plg.prevSlide();
						}
					} else {
						plg.toSlide(state.cur);
					}
					touchendCleaner ();
				});
			}

			function touchendCleaner () {
				DOM.$sliderHolder.removeClass('touched');
				state.touchStart.yPos = 0;
				state.touchStart.xPos = 0;
				state.shiftX = 0;
				state.shiftD = 0;
			}

			$window.on( 'resize', plg.resize.bind(plg) );
			plg.init();

			return plg;
		});
	};

})(jQuery);
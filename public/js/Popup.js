
/*
 * jQuery Popup - 2013/7/13
 */

var Popup = (function() {
		function constructor(options) {
			this.options = $.extend({
				id: null,
				url: '',
				title: '温馨提示',
				width: 400,
				height: 300,
				full: null	
			}, options || {});
		}
		var $temp, $title, $shadow, $closeButton, $container, $content, $parent;
		var play;
		var html = '';
		function init() {
			$temp = $('<div class="popup" />');
			$title = $('<div class="title" />');
			$closeButton = $('<div class="close" />'); 
			$container = $('<div class="container" />'); 
		}
		function add(popup) {
			popup.showBefore($temp);
			$closeButton = $closeButton.html('×').appendTo($temp);
			$title.html(popup.options.title).appendTo($temp);
			$content = popup.options.id;
			if($content) {
				$parent = $content.parent();
				$container.append($content.show()).appendTo($temp);
			}else {
				$container.html(html).appendTo($temp);
			}
			$temp = $temp.css({'display': 'none'}).appendTo('body');
			
			popup.setStyle($temp);
			if(!popup.options.full) {
				popup.position($temp);
			}
			$temp.fadeIn();
			popup.close();	
		}
		function resize(popup, el) {
			$(window).bind({
				'resize.popup': function() {
					clearTimeout(play);
					play =setTimeout(function() {
						popup.position(el);
					}, 100);
				}	
			});	
		}
		constructor.prototype = {
			tempHtml: [],
			getData: function() {
				var that = this;
				$.ajax({
					dataType: 'json',
					url: that.options.url,
					beforeSend: function() {
						$shadow = $('<div class="popup_shadow" />').appendTo('body');
					},
					success: function(data) {
						that.data = data;
						that.json = that.data.data;
						that.tempUrl = [];
						that.jsUrl = [];
						for(var i in that.data.temp_url) {
							that.tempUrl[i] = that.data.temp_url[i];
						}
						for(var i in that.data.js_url) {
							that.jsUrl[i] = that.data.js_url[i];
						}
						if(that.data.code == 1) {
							that.getTemp(that.tempUrl, 0);
						}else {
							var msg = data.error.msg;
							if(msg && msg !== '') {
								alert(msg);
							}
							var url = data.error.url;
							
							if(url && url !== '') {
								if(data.error.cross) {
									window.location.href = url;
								}else {
									window.location.hash = url.split('#')[1];
								}
								//console.log('跳转到："' + url + '"');
							}		
						}
					}	
				});
			},
			getTemp: function(tempUrl, index) {
				var that = this;
				$.ajax({
					url: tempUrl[index],
					success: function(data) {
						that.tempHtml[index] = data;
					},
					complete: function() {
						index += 1;
						if(tempUrl[index]) {
							that.getTemp(tempUrl, index);
						}else {
							var bt=baidu.template;
							html = '';
							for(var i in that.tempHtml) {
								html += bt(that.tempHtml[i], that.json[i]);
							}
							init();
							add(that);
							if(!that.options.full) {
								resize(that, $temp);
							}
							that.loadJs(that.jsUrl);
						}	
					}
				});
			},
			loadJs: function(jsUrl) {
				for (var i in jsUrl) {
					$.ajax({
						url : jsUrl[i],
						cache : false,
						dataType : 'script'
					});
				}	
			},
			showBefore: function(el) {
				var that = this,
					width = that.options.width,
					height = that.options.height;
				if(width && width === 'auto') {
					el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'width': 'auto', 'right': 'auto', 'left': 'auto'});
				}
				if(height && height === 'auto') {
					el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'height': 'auto', 'top': 'auto', 'bottom': 'auto'});
				}
			},
			setStyle: function(el) {
				var that = this,
					width = that.options.width,
					height = that.options.height,
					full = that.options.full;
				if(el.css('position') !== 'absolute') {
					el.css({'position': 'absolute'})	
				}
				if(full) {
					var top = full.top,
						right = full.right,
						bottom = full.bottom,
						left = full.left;
					top = (top || top == 0) ? top : 'auto';
					right = (right || right == 0) ? right : 'auto';
					bottom = (bottom || bottom == 0) ? bottom : 'auto';
					left = (left || left == 0) ? left : 'auto';
					console.log(full);
					el.css({'width': 'auto', 'height': 'auto', 'top': top, 'right': right, 'bottom': bottom, 'left': left});
					//$('body').css({'overflow': 'hidden'});
					$('html').css({'overflow': 'hidden'});
				}else {
					if(width && width === 'auto') {
						//el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'width': 'auto', 'right': 'auto', 'left': 'auto'});
						el.css({'width': $container.width(), 'display': 'none', 'visibility': 'visible'});
					}else {
						el.width(width);	
					}	
					if(height && height === 'auto') {
						//el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'height': 'auto', 'top': 'auto', 'bottom': 'auto'});
						el.css({'height': el.height(), 'display': 'none', 'visibility': 'visible', 'position': 'absolute'});
					}else {
						el.height(height);
					}
				}
			},
			position: function(el) {
				var winWidth = $(window).width(),
					winHeight = $(window).height(),
					left = (winWidth - el.outerWidth()) * .5,
					top = (winHeight - el.outerHeight()) * .5;
				left = left > 0 ? left : 0;
				top = top > 0 ? top : 0;
				el.animate({'left': left, top: top}, 100);
			},
			open: function() {
				var that = this;
				if(that.options.id) {
					$shadow = $('<div class="popup_shadow" />').appendTo('body');
					init();
					add(that);
					if(!that.options.full) {
						resize(that, $temp);
					}
				}else {
					that.getData();
				}
			},
			close: function() {
				var that = this;
				$closeButton.bind({
					'click': function() {
						dele();
						return false;	
					}	
				});
				$shadow.bind({
					'click': function() {
						dele();
						return false;	
					}	
				});
				function dele() {
					if($content) {
						$content.appendTo($parent);	
					}
					$temp.fadeOut();
					$shadow.fadeOut();
					$temp.queue(function() {
						$shadow.remove();
						$temp.remove();
						$(window).unbind('resize.popup');
						$(this).dequeue();
					});	
					//$('body').css({'overflow': 'auto'});
					$('html').css({'overflow': 'auto'});
				}
			}	
		};
		return constructor;
	})();
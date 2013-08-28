/**
 *	jQuery tip v1.0
 *	Date: 2013-7-16
 *	Update: 2013-7-16
 */
(function($, window, undefined) {
	//'use strict';
	var app = window.app = window.app || {},
		tt = app.tt = app.tooltip = {};
	tt.tipStatus = false;
	tt.tipElement = null;
	tt.animTime = 300;
	tt.delay = 5000;
	tt.tip = function(type, msg) {
		var that = this;
		if(!that.tipStatus) {
			if(that.tipElement) {
				that.tipElement.remove();	
				that.tipStatus = true;
			}
			var left, top,
				el = that.tipElement = $('<div class="ajax_build_tip ' + type + '" />').html(msg);
			if(el.css('position') !== 'absolute') {
				el.css({'position': 'absolute'});
			}
			if(!el.css('top')) {
				el.css({'top': '30'});
			}
			
			$('body').append(el.css({'visibility': 'hidden', 'display': 'block'}));
			left = ($(window).width() - el.outerWidth()) * .5;
			el.css({'left': left, 'visibility': 'visible', 'display': 'none'}).fadeIn(that.animTime);
			setTimeout(function() {
				el.fadeOut(that.animTime, function() {
					el.remove();
					that.tipStatus = false;
				});
			}, that.delay);	
		}
	};
	
	tt.errorTip = function(msg) {
		this.tip('error', msg);
	};
	
	tt.successTip = function(msg) {
		this.tip('success', msg);
	};
	
	tt.warningTip = function(msg) {
		this.tip('warning', msg);
	};
})(jQuery, this);

/**
 * jQuery bitty v1.0
 * base jquery.history.js & doT.js
 * @author yutlee.cn@gmail.com
 * @date 2013-8-23
 * @update 2013-8-23
 */

(function ($, window, undefined) {
	//'use strict';
	var app = window.app = window.app || {},
		bt = app.bt = app.bt || {};

	bt.tempCache = {};	//缓存模板
	bt.currentUrlCache = []; //缓存当前模板url
	bt.tempUrlCache = []; //缓存模板url
	bt.htmlCache = {};	//缓存模块
	bt.jsCache = {}; //缓存javascript
	
	bt.headers = {
		'Accept': 'application/json'
	};
	
	//自定义doT编译设置
	doT.templateSettings = {
		evaluate:    /\{\@([\s\S]+?)\}\}/g,
		interpolate: /\{\@=([\s\S]+?)\}\}/g,
		encode:      /\{\@!([\s\S]+?)\}\}/g,
		use:         /\{\@#([\s\S]+?)\}\}/g,
		define:      /\{\@##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
		conditional: /\{\@\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
		iterate:     /\{\@~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
		varname: 'it',
		strip: true,
		append: true,
		selfcontained: false
	};
	
	bt.log = function(message, level) {
		if (window.console) {
			if (!level || level === 'info') {
				window.console.log(message);
			}else {
				if (window.console[level]) {
					window.console[level](message);
				}else {
					window.console.log('<' + level + '> ' + message);
				}
			}
		}
	};
	
	bt.isObject = function(variable) {
		return variable && !variable.nodeType && Object.prototype.toString.call(variable) === '[object Object]';
	};
	
	bt.isFunction = function(variable) {
		return typeof(variable) === 'function';
	};
	
	bt.isArray = function(variable) {
		return Object.prototype.toString.call(variable) === '[object Array]';
	};
	
	bt.isString = function(maybeString) {
		return Object.prototype.toString.call(maybeString) === '[object String]';
	};
	
	bt.isUndefined = function(variable) {
		return variable === 'undefined';
	};
	
	/**
	 * bt.loadPage(data)
	 * 加载页面
	 * @param {Json} data 页面数据和模板
	 */
	bt.loadPage = function(data) {
		var that = this;
		if(that.isObject(data)) {
			if(that.isArray(data.temp_url)) {
				var i = 0, j = 0,
					len = data.temp_url.length,
					l = that.currentUrlCache.length,
					url = window.location.href;
				for(; j < l; j++) {
					$('#' + that.currentUrlCache[j].replace(/\//g, '-')).remove();
				}
				that.currentUrlCache = [];
				for(; i < len; i++) {
					var tempUrl = data.temp_url[i];
					var tempId = tempUrl.replace(/\//g, '-');
					var html;
					
					if(!that.tempCache[tempUrl] && !that.isFunction(that.tempCache[tempUrl])) {
						that.tempCache[tempUrl] = doT.template(data.temp['k' + i]);
						that.tempUrlCache.push(tempUrl);
					}
					
					that.currentUrlCache.push(tempUrl);
					html = (that.isArray(data.data)) ? that.tempCache[tempUrl](data.data[i]) : that.tempCache[tempUrl]('');
					$(data.mod[i]).append($('<div id="' + tempId +'"/>').html(html));
					
					if(!that.htmlCache[url] && !that.isObject(that.htmlCache[url])) {
						that.htmlCache[url] = {};
					}else {
						if(!that.htmlCache[url][tempUrl]) {
							that.htmlCache[url][tempUrl] = html;
						}
					}
				}
				bt.headers.Temps = that.tempUrlCache.join(',');
			}
			that.loadJs(data.js_url);
			that.loadCss(data.css_url);
		}else {
			that.log('参数data必要为json对象');	
		}
	};
	
	/**
	 * bt.loadJs(url)
	 * 加载页面javascript
	 * @param {Array} url <script>标签的src属性
	 */
	bt.loadJs = function (url) {
		var that = this,
			i = 0,
			len;
		if(that.isArray(url)) {
			len = url.length;
			for (; i < len; i++) {
				var now = url[i];
				if(!that.jsCache[now]) {
					loadOne(now, false);
					that.jsCache[now] = now;
				}else {
					loadOne(now, true);
				}
			}
		}
		function loadOne(url, cache) {
			$.ajax({
				url: url,
				cache: cache,
				dataType: 'script'
			});	
		}
	};
	
	/**
	 * bt.loadCss(url)
	 * 加载页面css
	 * @param {Array} url <link>标签的href属性
	 */
	bt.loadCsss = function (url) {
		var that = this,
			i = 0,
			len;
		if(that.isArray(url)) {
			len = url.length;
			for (; i < len; i++) {
				var now = url[i];
				if(!that.cssCache[now]) {
					$('head').append('<link rel="stylesheet" href="' + now + '" />');
					that.cssCache[now] = now;
				}
			}
		}
	};
	
	/**
	 * bt.request()
	 * 绑定链接点击事件，Ajax请求获取数据
	 */
	bt.request = function() {
		var that = this;
		$('body').delegate('a', 'click', function() {
			var t = $(this),
				url = t.attr('href');
			that.isLinkClick = true;
			$.ajax({
				url: url,
				dataType: 'json',
				headers: that.headers,
				beforeSend: function() {
					History.pushState('', url, url);
					History.replaceState('', url, url);
				},
				success: function(data) {
					that.isLinkClick = false;
					that.loadPage(data);
				}
			});
			return false;	
		});
	};
	
	/**
	 * bt.request()
	 * 绑定历史地址事件
	 */
	History.Adapter.bind(window, 'statechange', function() {
		var actualState = History.getState(false),
			url = actualState.url;
		if(!bt.isLinkClick) {
			$.ajax({
				url: url,
				dataType: 'json',
				headers: bt.headers,
				success: function(data) {
					bt.loadPage(data);
				}
			});
		}
	});
	
})(jQuery, window);
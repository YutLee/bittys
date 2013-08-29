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
	bt.pageCache = {}; //缓存页面相关内容
	bt.htmlCache = {};	//缓存模块
	bt.jsCache = {}; //缓存javascript
	bt.cssCache = {}; //缓存css
	
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
	 * bt.arrayDiff(array1, array2)
	 * 对比返回在 array1 中但是不在 array2 中的值。
	 * @param {Array} array1 必须，要被对比的数组
	 * @param {Array} array2 必须，和这个数组进行比较
	 */
	bt.arrayDiff = function(array1, array2) {
		var that = this;
		if(!that.isArray(array1)) {
			console.log('参数 array1：' + array1 + '不是数组');
			return false;
		}
		if(!that.isArray(array2)) {
			console.log('参数 array2：' + array2 + '不是数组');
			return false;
		}
		if(that.isArray(array1) && that.isArray(array2)) {
			var newArray = [],
				k1 = 0,
				len1 = array1.length,
				len2 = array2.length;
			for(; k1 < len1; k1++) {
				for(var k2 = 0; k2 < len2; k2++) {
					if(array1[k1] === array2[k2]) {
						break;
					}
					if(k2 === len2 - 1 && array1[k1] !== array2[k2]) {
						newArray.push(array1[k1]);
					}
				}
			}
			return newArray;
		}
	};
	
	/**
	 * bt.loadPage(data)
	 * 加载页面
	 * @param {String} url 必须，新页面地址
	 * @param {Json} data 必须，新页面数据和模板
	 */
	bt.loadPage = function(url, data) {
		var that = this,
			tempId = data.temp_id;
		if(that.isObject(tempId)) {
			var new_temps = data.temp_url;
			var diff = that.arrayDiff(that.currentUrlCache, new_temps);
			diff = diff.length > 0 ? diff : new_temps;
			var k = 0, 
				l = diff.length;
			
			for(; k < l; k++) {
				var id = diff[k].replace(/\//g, '-');
				if($('#' + id).length > 0) {
					$('#' + id).remove();	//删除在当前页面但不在新页面的模块
					console.log('删除在当前页面但不在新页面的模块' + id);
				}
			}
			
			that.currentUrlCache = new_temps;
			
			url = url.replace(/http:\/\/localhost\/git\/bittys\//g, '');	//本地测试用，正式环境下需删除
			if(!that.pageCache[url]) {
				that.pageCache[url] = {};
			}
			if(!that.pageCache[url]['temps']) {
				that.pageCache[url]['temps'] = that.currentUrlCache.join(',');
			}
			
			that.refreshPageCache();
			
			for(var key in tempId) {
				var value = tempId[key],
					id = value.replace(/\//g, '-'),
					html;
				if(!that.tempCache[value] && !that.isFunction(that.tempCache[value])) {
					that.tempCache[value] = doT.template(data.temp[key]);
					that.tempUrlCache.push(value);
				}
				html = (that.isObject(data.data)) ? that.tempCache[value](data.data[key]) : that.tempCache[value]('');
				
				if($('#' + id).length > 0) {	
					$('#' + id).remove();	//删除要替换的已存在当前页面的模块
					console.log('删除要替换的已存在当前页面的模块' + id);
				}
				
				$(data.mod[key]).append($('<div id="' + id +'"/>').html(html));
				console.log('载人新模块："' + id + '"');
			}
			bt.loadCss(data.css_url);
			bt.loadJs(data.js_url);
		}
	}
	
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
	bt.loadCss = function (url) {
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
	 * bt.refreshPageCache()
	 * 更新所有页面缓存信息
	 */
	bt.refreshPageCache = function() {
		var that = this;
		
		for(var key in that.pageCache) {
			if(!that.pageCache[key]['temps'] && that.currentUrlCache) {
				that.pageCache[key]['temps'] = '';
			}
			
			var newTemps = that.arrayDiff(that.pageCache[key]['temps'].split(','), that.currentUrlCache);
			if(newTemps.length > 0) {
				that.pageCache[key]['temps'] = newTemps.join(',');
			}else {
				console.log('页面："' + key + '"首次加载页面' );	
			}
		}
	};
	
	/**
	 * bt.setHeaders()
	 * 设置发送的头部信息
	 * @param {String} url 必须，新页面地址
	 * @param {String} temps 可缺省，请求新页面所需的模板id；多个模板id用","隔开；缺省时，服务器返回完整的页面模板；
	 */
	bt.setHeaders = function(url, temps) {
		var that = this;
		
		if(!that.pageCache[url]) {
			that.pageCache[url] = {};
		}
		if(!that.pageCache[url]['temps']) {
			that.pageCache[url]['temps'] = temps;
		}
		
		that.headers['Temps'] = that.pageCache[url]['temps'] ? that.pageCache[url]['temps'] : '';
		
		var noExist = that.arrayDiff(that.headers.Temps.split(','), that.tempUrlCache);
		that.headers['NoExist'] = noExist.join(',');
	};
	
	/**
	 * bt.request()
	 * 加载新页面，Ajax请求获取数据
	 * @param {String} url 必须，新页面地址
	 * @param {String} temps 可缺省，请求新页面所需的模板id；多个模板id用","隔开；缺省时，服务器返回完整的页面模板；
	 */
	bt.request = function(url, temps) {
		var that = this;
		that.isLinkClick = true;
		that.setHeaders(url, temps);
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
				that.loadPage(url, data);
			},
			error: function(xhr) {
				console.log(xhr);	
			}
		});
	};
	
	/**
	 * bt.bindLink()
	 * 绑定a链接点击事件
	 */
	bt.bindLink = function() {
		$('body').delegate('a[target!=_blank]', 'click', function() {
			var t = $(this),
				url = t.attr('href'),
				temps = t.attr('data-temps');
			bt.request(url, temps);
			return false;	
		});	
	};
	
	/**
	 * 绑定历史地址事件
	 */
	History.Adapter.bind(window, 'statechange', function() {
		var actualState = History.getState(false),
			url = actualState.url;
		url = url.replace(/http:\/\/localhost\/git\/bittys\//g, '');	//本地测试用，正式环境下需删除
		if(!bt.isLinkClick) {
			bt.setHeaders(url);
			$.ajax({
				url: url,
				dataType: 'json',
				headers: bt.headers,
				success: function(data) {
					bt.loadPage(url, data);
				}
			});
		}
	});
	
})(jQuery, window);
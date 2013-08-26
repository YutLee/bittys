/**
 * jQuery bitty v1.0
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
	bt.tempUrlCache = {}; //缓存模板url
	bt.htmlCache = {};	//缓存模块
	
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
					$('#' + that.currentUrlCache[j]).remove();
				}
				that.currentUrlCache = [];
				for(; i < len; i++) {
					var tempUrl = data.temp_url[i];
					var tempId = tempUrl.replace(/\//g, '-');
					
					if(!that.tempUrlCache[tempUrl]) {
						that.tempUrlCache[tempUrl] = tempUrl;
					}
					
					if(!that.tempCache[tempUrl] && !that.isFunction(that.tempCache[tempUrl])) {
						that.tempCache[tempUrl] = doT.template(data.temp[i]);
					}
					
					that.currentUrlCache.push(tempId);
					var html = that.tempCache[tempUrl](data.data[i]);
					$(data.mod[i]).append($('<div id="' + tempId +'"/>').html(html));
					
					if(!that.htmlCache[url] && !that.isObject(that.htmlCache[url])) {
						that.htmlCache[url] = {};
					}else {
						if(!that.htmlCache[url][tempUrl]) {
							that.htmlCache[url][tempUrl] = html;
						}
					}
				}
			}
			if(that.isArray(data.js_url)) {
				var i = 0,
					len = data.js_url.length;
				for(; i < len; i++) {
					$('<script src="' + data.js_url[i] + '" />').appendTo('body');
				}
			}
		}else {
			that.log('参数data必要为json对象');	
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
				url = t.attr('href'),
				headers = {
					'Accept': 'application/json',
					'Request': ''	
				};
			$.ajax({
				url: url,
				dataType: 'json',
				headers: headers,
				success: function(data) {
					that.loadPage(data);
				}
			});
			return false;	
		});
	};
	
})(jQuery, window);
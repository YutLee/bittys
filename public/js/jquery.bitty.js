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
	bt.currentUrlCache = {};	//缓存当前模板url
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
	
	/**
	 * bt.loadPage(data)
	 * 加载页面
	 * @param {Json} data 页面数据和模板
	 */
	bt.loadPage = function(data) {
		var that = this;
		if(that.isObject(data)) {
			
		}else {
			that.log('参数data必要为json对象');	
		}
	};
	
	/**
	 * bt.request()
	 * 绑定链接点击事件，Ajax请求获取数据
	 */
	bt.request = function() {
		
	};
	
})(jQuery, window);
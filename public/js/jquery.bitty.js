/**
 * jQuery tooltip v1.0
 * @license Copyright 2013
 * 
 * Date 2013-7-16
 * Update 2013-9-12 T11:14
 */
(function($, window, undefined) {
	//'use strict';
	var play,
		/** 
		 * 应用程序 
		 * @namespace 
		 */
		app = window.app = window.app || {};
	
	/**
	 * tooltip 对象
	 * @namespace 
	 */
	app.tooltip = {
		/** 
		 * 标志提示工具状态 
		 * @type {boolean}
		 * @private
		 */
		status: false,
		/** 
		 * 定义全局动画时间 
		 * @type {number}
		 */
		animTime: 300,
		/** 
		 * 定义全局提示工具显示时间 
		 * @type {number}
		 */
		delay: 5000,
		/**  
		 * 显示要提示的内容
		 * @param {string} type 提示的类型
		 * @param {string} msg 需要提示的内容
		 * @param {string} delay 提示的动画时长
		 * @param {string} animTime 显示提示内容的时长
		 * @example 
		 * app.tooltip.tip('success', '^_^ 这是一个成功提示。');
		 * @example 
		 * app.tooltip.tip('error', '+_+? 这是另一个出错提示。', 3000, 200);
		 */
		tip: function(type, msg, delay, animTime) {
			var that = this;
			clearTimeout(play);
			if(!that.status) {
				if(that.element) {
					that.element.remove();	
					that.status = true;
				}
				var left, top,
					el = that.element = $('<div class="ajax_build_tip ' + type + '" />').html(msg);
				if(el.css('position') !== 'absolute') {
					el.css({'position': 'absolute'});
				}
				if(!el.css('top')) {
					el.css({'top': '30'});
				}
				
				$('body').append(el.css({'visibility': 'hidden', 'display': 'block'}));
				left = ($(window).width() - el.outerWidth()) * .5;
				el.css({'left': left, 'visibility': 'visible', 'display': 'none'}).fadeIn(animTime || that.animTime);
				if(delay !== 'none') {
					play = setTimeout(function() {
						that.close();
					}, delay || that.delay);	
				}
			}
		},
		/** 关闭提示 */
		close: function() {
			var that = this;
			that.element.fadeOut(that.animTime, function() {
				that.element.remove();
				that.status = false;
			});
		},
		/**  
		 * 出错提示
		 * @param {string} msg 需要提示的内容
		 * @param {string} delay 提示的动画时长
		 * @param {string} animTime 显示提示内容的时长
		 * @example 
		 * app.tooltip.error('+_+? 出错提示。');
		 */
		error: function(msg, delay, animTime) {
			this.tip('error', msg, delay, animTime);
		},
		/**  
		 * 成功提示
		 * @param {string} msg 需要提示的内容
		 * @param {string} delay 提示的动画时长
		 * @param {string} animTime 显示提示内容的时长
		 * @example 
		 * app.tooltip.error('^_^ 成功提示。');
		 */
		success: function(msg, delay, animTime) {
			this.tip('success', msg, delay, animTime);
		},
		/**  
		 * 警告提示
		 * @param {string} msg 需要提示的内容
		 * @param {string} delay 提示的动画时长
		 * @param {string} animTime 显示提示内容的时长
		 * @example 
		 * app.tooltip.error('*_*! 出错提示。');
		 */
		warning: function(msg, delay, animTime) {
			this.tip('warning', msg, delay, animTime);
		}
	};
})(jQuery, window);


/**
 * jQuery bitty v1.0
 * @license Copyright 2013
 * 
 * base jquery.history.js
 * @see https://github.com/browserstate/history.js 
 * 
 * base doT.js
 * @see https://github.com/olado/doT 
 *
 * Date 2013-8-23
 * Update 2013-8-23
 */

(function ($, window, undefined) {
	//'use strict';
	
	//============================== 工具函数开始 ==============================
	/**
	 * 检测对象是否为对象
	 * @param {Object} 用于测试是否为对象的对象
	 * @return {boolean}
	 * @memberOf _global_
	 */
	function isObject(variable) {
		return variable && !variable.nodeType && Object.prototype.toString.call(variable) === '[object Object]';
	}
	/**
	 * 检测对象是否为函数
	 * @param {Object} 用于测试是否为函数的对象
	 * @return {boolean}
	 * @memberOf _global_
	 */
	function isFunction(variable) {
		return typeof(variable) === 'function';
	}
	/**
	 * 检测对象是否为数组
	 * @param {Object} 用于测试是否为数组的对象
	 * @return {boolean}
	 * @memberOf _global_
	 */
	function isArray(variable) {
		return Object.prototype.toString.call(variable) === '[object Array]';
	}
	/**
	 * 检测对象是否为字符串
	 * @param {Object} 用于测试是否为字符串的对象
	 * @return {boolean}
	 * @memberOf _global_
	 */
	function isString(variable) {
		return Object.prototype.toString.call(variable) === '[object String]';
	}
	/**
	 * 对比返回在 array1 中但是不在 array2 中的值。
	 * @param {Array} array1 必须，要被对比的数组
	 * @param {Array} array2 必须，和这个数组进行比较
	 * @return {Array} 返回一个数组，该数组包括了所有在 array1 中但是不在 array2 中的值。
	 * @memberOf _global_
	 */
	function arrayDiff(array1, array2) {
		var that = this;
		if(!isArray(array1)) {
			console.log('参数 array1：' + array1 + '不是数组');
			return false;
		}
		if(!isArray(array2)) {
			console.log('参数 array2：' + array2 + '不是数组');
			return false;
		}
		if(isArray(array1) && isArray(array2)) {
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
	}
	//============================== 工具函数结束 ==============================
	
	var 
		/** @namespace */
		app = window.app = window.app || {};
	
	/** @namespace */
	app.bitty = {
		tempCache: {},	//缓存模板
		currentUrlCache: [],	//缓存当前模板url
		tempUrlCache: [], //缓存模板url
		pageCache: {}, //缓存页面相关内容
		htmlCache: {},	//缓存模块
		jsCache: {}, //缓存javascript
		cssCache: {}, //缓存css
		/**
		 * 头部信息
		 * @type {Object}
		 */
		headers: {
			'Accept': 'application/json'
		},
		/**
		 * 加载页面
		 * @param {string} url 必须，新页面地址
		 * @param {Json} data 必须，新页面数据和模板
		 */
		loadPage: function(url, data) {
			var that = this,
				tempId = data.temp_id,
				error = data.error;

			if(isObject(error)) {
				if(isString(error.url)) {
					that.request({url: error.url});
				}
				if(isString(error.info) && error.info != '') {
					app.tooltip.error(error.info);
				}
				return false;
			}
			
			if(isObject(tempId)) {
				var allTemps = data.temp_url;
				var diff = that.currentUrlCache.length > 0 ? arrayDiff(that.currentUrlCache, allTemps) : allTemps;
				var k = 0, 
					l = diff.length;

				for(; k < l; k++) {
					var id = diff[k].replace(/\//g, '-');
					if($('#' + id).length > 0) {
						$('#' + id).remove();	//删除在当前页面但不在新页面的模块
						console.log('删除在当前页面但不在新页面的模块' + id);
					}
				}
				
				url = url.replace(/http:\/\/localhost\/git\/bittys\//g, '');	//本地测试用，正式环境下需删除
				if(!that.pageCache[url]) {
					that.pageCache[url] = {};
				}
				if(!that.pageCache[url]['temps']) {
					that.pageCache[url]['temps'] = allTemps.join(',');
				}
				if(!that.pageCache[url]['allTemps']) {
					that.pageCache[url]['allTemps'] = allTemps.join(',');
				}
				
				that.currentUrlCache = allTemps;

				for(var key in tempId) {	//遍历需要更新的模板
					var value = tempId[key],
						id = value.replace(/\//g, '-'),
						html;
					if(!that.tempCache[value] && !isFunction(that.tempCache[value])) {
						that.tempCache[value] = doT.template(data.temp[key]);
						that.tempUrlCache.push(value);
					}
					html = (isObject(data.data)) ? that.tempCache[value](data.data[key]) : that.tempCache[value]('');
					
					if($('#' + id).length > 0) {	
						$('#' + id).remove();	//删除要替换的已存在当前页面的模块
						console.log('删除要替换的已存在当前页面的模块' + id);
					}
					
					$(data.mod[key]).append($('<div id="' + id +'"/>').html(html));
					console.log('载人新模块："' + id + '"');
				}
				that.loadCss(data.css_url);
				that.loadJs(data.js_url);
			}
			//console.log('已缓存的模板', that.tempCache);
			//console.log('ajax请求页面模板id', that.pageCache);
		},
		/**
		 * 加载页面javascript
		 * @param {Array} url <script>标签的src属性
		 * @private
		 */
		loadJs: function (url) {
			var that = this,
				i = 0,
				len;
			if(isArray(url)) {
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
		},
		/**
		 * 加载页面css
		 * @param {Array} url <link>标签的href属性
		 * @private
		 */
		loadCss: function (url) {
			var that = this,
				i = 0,
				len;
			if(isArray(url)) {
				len = url.length;
				for (; i < len; i++) {
					var now = url[i];
					if(!that.cssCache[now]) {
						$('head').append('<link rel="stylesheet" href="' + now + '" />');
						that.cssCache[now] = now;
					}
				}
			}
		},
		/**
		 * 更新所有页面缓存信息
		 * @param {string} url 必须，新页面地址
		 */
		refreshPageCache: function(url) {
			var that = this,
				newTemps,
				reTemps;
			for(var key in that.pageCache) {
				if(key === url && that.pageCache[key]['temps'] && that.currentUrlCache) {
					newTemps = arrayDiff(that.pageCache[key]['allTemps'].split(','), that.currentUrlCache);
					newTemps = arrayDiff(newTemps, that.pageCache[key]['temps'].split(','));
					reTemps = that.pageCache[key]['temps'].split(',');
					for(var i = 0; i < newTemps.length; i++) {
						reTemps.push(newTemps[i]);
					}
					that.pageCache[key]['reTemps'] = reTemps.join(',');
					console.log('更新页面缓存' + key);
					break;
				}
			}
		},
		/**
		 * 设置发送的头部信息
		 * @param {string} url 必须，新页面地址
		 * @param {string} temps 可缺省，请求新页面所需的模板id；多个模板id用","隔开；缺省时，服务器返回完整的页面模板；
		 */
		setHeaders: function(url, temps) {
			var that = this,
				newTemps,
				noExist;
			
			if(!that.pageCache[url]) {
				that.pageCache[url] = {};
			}
			
			that.refreshPageCache(url);

			if(temps && temps != '') {
				that.headers['Temps'] = that.pageCache[url]['temps'] = that.pageCache[url]['reTemps'] = temps;
				noExist = arrayDiff(temps.split(','), that.tempUrlCache);
				that.headers['NoExist'] = noExist.join(',');
			}else if(that.pageCache[url]['reTemps']) {
				that.headers['Temps'] = that.pageCache[url]['reTemps'];
				noExist = arrayDiff(that.pageCache[url]['reTemps'].split(','), that.tempUrlCache);
				that.headers['NoExist'] = noExist.join(',');
			}else {
				that.headers['Temps'] = '';
				that.headers['NoExist'] = 'none';
			}
			console.log('需要请求的数据', that.headers);
		},
		/**
		 * 加载中... ...
		 */
		loading: {
			/** 
			 * 加载中的提示信息
			 * @type {string}
			 */
			msg: 'loading...',
			/** 
			 * 加载前的回调函数
			 * @param {Array} 页面上需要删除的模块的 id 数组
			 */
			beforeSend: function(mods) {
				app.tooltip.warning(this.msg, 'none');
				for(var i = 0; i < mods.length; i++) {
					$('#' + mods[i]).parent().addClass('loading');
				}
			},
			/** 
			 * 加载成功的回调函数
			 * @param {Array} 插入页面的模块的 id 数组
			 */
			success: function(mods) {
				app.tooltip.close();
				for(var i = 0; i < mods.length; i++) {
					$('#' + mods[i]).parent().removeClass('loading');
				}
			}
		},
		/**
		 * 设置发送的头部信息
		 * @param {string} options 必须
		 * @private
		 */
		ajax: function(options) {
			var that = this,
				o = $.extend({
					url: '',
					dataType: 'json',
					headers: that.headers,
					type: 'GET',
					data: null
				}, options || {}),
				newMods = [];
			$.ajax({
				url: o.url,
				type: o.type,
				dataType: 'json',
				headers: that.headers,
				data: o.data,
				beforeSend: function() {
					if(isFunction(that.loading.beforeSend)) {
						var mods = that.headers.Temps ? arrayDiff(that.currentUrlCache, that.headers.Temps.split(',')) : that.currentUrlCache;
						var i = 0, len = mods.length;	
						for(; i < len; i++) {
							newMods.push(mods[i].replace(/\//g, '-'));
						}
						that.loading.beforeSend.call(that.loading, newMods);
					}
					if(o.isHistory) {
						History.pushState('', o.title, o.url);
						History.replaceState('', o.title, o.url);
					}
				},
				success: function(data) {
					that.isLinkClick = false;
					if(isFunction(that.loading.success)) {
						that.loading.success.call(that.loading, newMods);
					}
					that.loadPage(o.url, data);
				},
				error: function(xhr) {
					console.error(xhr);	
				}
			});
		},
		/**
		 * 加载新页面，Ajax请求获取数据
		 * @param {string} url 必须，新页面地址
		 * @param {string} temps 可缺省，请求新页面所需的模板id；多个模板id用","隔开；缺省时，服务器返回完整的页面模板；
		 * @param {boolean} isHistory 可缺省， 新页面地址是否加入历史地址记录， 默认 true 加入
		 * @param {string} title 可缺省，新页面标题，缺省下取当前页面标题
		 */
		request: function(options) {
			var that = this,
				o = $.extend({
					url: '',
					temps: '',
					isHistory: true,
					title: document.title
				}, options || {});

			that.isLinkClick = true;
			//url = url.replace(/[\u4e00-\u9fa5]/g, encodeURIComponent('$0', true));	//对中文进行编码
			that.setHeaders(o.url, o.temps);
			that.ajax({url: o.url, isHistory: o.isHistory, title: o.title});
		},
		/**
		 * 绑定<a>链接点击事件
		 */
		bindLink: function() {
			var that = this;
			$('body').delegate('a[target!=_blank]', 'click', function() {
				var t = $(this),
					url = t.attr('href'),
					temps = t.attr('data-temps'),
					title = t.attr('data-title');
				if( !($.trim(url).match(/#.*/) || $.trim(url).match(/javascript:/)) ) {
					that.request({url: url, temps: temps, title: title});
					return false;
				}	
			});	
		},
		/**
		 * 设置发送的头部信息
		 * @param {string} formId 可缺省，表单id；缺省时 submitId 参数必填
		 * @param {string} submitId 可缺省，提交的按钮；缺省时 formId 参数必填
		 * @param {string} url 可缺省，提交的地址；缺省时默认提交到当前地址或表单的 action 属性地址
		 * @param {string} method 可缺省，提交的方式；缺省时默认取表单 method 属性的值，method为空时默认'POST'提交
		 * @param {boolean} isHistory 可缺省， 新页面地址是否加入历史地址记录， 默认 true 加入
		 * @param {string} title 可缺省，新页面标题，缺省下取当前页面标题
		 * @param {string} temps 可缺省，请求新页面所需的模板id；多个模板id用","隔开；缺省时，服务器返回完整的页面模板；
		 */
		ajaxForm: function(options) {
			var that = this,
				o = $.extend({
					formId: null, 
					submitId: null, 
					url: null, 
					method: null,
					isHistory: true,
					title: document.title,
					temps: ''
				}, options || {});

			if(!o.formId) {
				if(!o.submitId) {
					console.log('参数 formId 或 submitId 必须有一个');
					return false;
				}else {
					var button = $('#' + o.submitId);	
					o.formId = button.closest('form')[0];
					button.bind({
						'click.submit': function() {
							return false;	
						}
					});
				}
			}
			var $form = isString(o.formId) ? $('#' + o.formId) : $(o.formId);
			
			if(!o.method) {
				var m = $form.attr('method');
				o.method = !m ? 'GET' : m.toLocaleUpperCase(); 
			}
			
			if(!o.url) {
				var action = $form.attr('action');
				o.url = !action ? window.location.href : action; 
			}
			
			var params = $form.serialize();//form序列化, 自动调用了encodeURIComponent方法将数据编码了 
			params = decodeURIComponent(params, true); //将数据解码

			var data;
			if(o.method == 'POST') {
				data = params;
				o.isHistory = false;
			}else {
				data = '';
				o.url = o.url.match(/&$/g) ? o.url + params :  o.url + '&' +  params;
			}
			that.isLinkClick = true;
			that.setHeaders(o.url, o.temps);
			that.ajax({url: o.url, type: o.method, data: data, isHistory: o.isHistory, title: o.title});
		}
	};
	
	/**
	 * 绑定历史地址事件
	 */
	History.Adapter.bind(window, 'statechange', function() {
		var bt = app.bitty,
			actualState = History.getState(false),
			url = actualState.url;
			
		url = url.replace(/http:\/\/localhost\/git\/bittys\//g, '');	//本地测试用，正式环境下需删除
		//url = url.replace(/[\u4e00-\u9fa5]/g, encodeURIComponent('$0', true));	//对中文进行编码
		
		if(!bt.isLinkClick) {
			bt.setHeaders(url);
			bt.ajax({url: url});
		}
	});
	
})(jQuery, window);
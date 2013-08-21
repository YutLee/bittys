/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);

/*
 * jQuery hash build - v1.4 - 2013/7/3
 */
(function ($, window, undefined) {
	'use strict';
	var ohm = window.ohm = window.ohm || {}; //定义ohm命名空间
	ohm.versions = ohm.versions || [];
	ohm.versions.push('v1.4'); //标记当前版本
	ohm.cache = { //初始化cache
		'' : 'cache',
		MAX : 30, //最大缓存数
		current : null, //当前地址缓存
		latest : null, //最新地址缓存（如:a.html请求b.html，则a为当前地址，b为最新地址）
		currentMod : [], //当前缓存模板
		keyArray : []//记录缓存
	};
	ohm.isCache = true; //是否缓存，默认缓存
	ohm.tempCache = {
		'' : 'temp'
	};
	ohm.jsCache = {
		'' : 'js'
	};
	ohm.cssCache = {
		'' : 'css'
	};
	ohm.dataType = {
		page : 'json',
		mod : 'html'
	}; //请求的数据类型，默认为'json'
	ohm.prefix = 'ohm';
	ohm.currentData = null; //当前请求数据

	ohm.setData = function (data) {
		this.data = data; //设置数据
	};

	ohm.getData = function () {
		return this.data; //获取数据
	};

	ohm.callback = { //回调方法
		setMod : null, //设置模块规则
		noHash : null, //没有hash
		hasCache : null, //已有缓存
		loadJs : null, //重新载入js
		onCacheBeforeClear : null, //清除缓存前
		onTempSuccess : null, //模板加载成功
		onTempExisted : null, //模板已存在
		onNewPageBeforeSend : null, //加载新模块前
		onNewPageSuccess : null, //加载新模块成功
		onNewPageComplete : null, //加载新模块完成
		onNewPageError : null //加载新模块出错
	};
	
	ohm.getTemp = function (tempArray, index, data) {
		var len = tempArray.length;
		var arr = tempArray[index].split('/');
		var mod = arr[arr.length - 2] + '-' + arr[arr.length - 1];
		//var mod = arr[arr.length - 1];
		ohm.cache.currentMod[index] = mod.replace(/\./g, '-'); //替换获得的地址
		if (!ohm.tempCache[tempArray[index]]) {
			$.ajax({
				url : tempArray[index],
				dataType : ohm.dataType.mod,
				beforeSend : function () {},
				success : function (htmlData) {
					var modData = htmlData;
					ohm.tempCache[tempArray[index]] = modData;
					if (ohm.callback.onTempSuccess) {
						ohm.callback.onTempSuccess.call(this, ohm.cache.currentMod[index], index, data);
					}
					if (ohm.getData() && ohm.isCache) {
						ohm.cache.current[index] = ohm.cache.latest[index] = ohm.cache[ohm.url][index] = ohm.getData();
					} else {
						ohm.cache[ohm.url] = null;
					}
					//console.log('加载新模板："' + tempArray[index] + '"');
				},
				complete : function () {
					index += 1;
					if (index < len) {
						ohm.getTemp(tempArray, index, data);
					} else {
						if (ohm.callback.onAllTempComplete) {
							ohm.callback.onAllTempComplete.call(this, ohm.url, data);
						}
						if (ohm.isCache) {
							ohm.cache.keyArray.push(ohm.url);
						}
					}
				},
				error : function (error) {
					//console.error('加载模板出错：', error);
				}
			});
		} else {
			//console.log('获取已缓存模板："' + tempArray[index] + '"');
			if (ohm.callback.onTempExisted) {
				ohm.callback.onTempExisted.call(this, ohm.cache.currentMod[index], index, data);
			}
			if (ohm.getData() && ohm.isCache) {
				ohm.cache.current[index] = ohm.cache.latest[index] = ohm.cache[ohm.url][index] = ohm.getData();
			} else {
				ohm.cache[ohm.url] = null;
			}
			index += 1;
			if (index < len) {
				ohm.getTemp(tempArray, index, data);
			} else {
				if (ohm.callback.onAllTempExisted) {
					ohm.callback.onAllTempExisted.call(this, ohm.url, data);
				}
				if (ohm.isCache) {
					ohm.cache.keyArray.push(ohm.url);
				}
			}
		}
	};

	ohm.getJs = function (url, jsArray) {
		ohm.jsCache[url] = [];
		for (var i in jsArray) {
			ohm.jsCache[url][i] = jsArray[i];
			$.ajax({
				url : jsArray[i],
				cache : false,
				dataType : 'script'
			});
			//console.log('第一次加载js："' + jsArray[i] + '"');
		}
	};

	ohm.reloadJs = function (url) {
		for (var i in ohm.jsCache[url]) {
			$.ajax({
				url : ohm.jsCache[url][i],
				cache : true,
				dataType : 'script'
			});
			//console.log('加载已缓存的js："' + ohm.jsCache[url][i] + '"');
		}
	};

	ohm.getCss = function (cssArray) {
		for (var i = 0; cssArray[i]; i++) {
			if (!ohm.cssCache[cssArray[i]]) {
				ohm.cssCache[cssArray[i]] = $('<link rel="stylesheet" href="' + cssArray[i] + '" />').appendTo('head');
				//console.log('加载css："' + cssArray[i] + '"');
			}
		}
	};

	$(window).bind('hashchange', function (e) { //绑定hashchange事件
		var hash = location.hash; //获取hash
		var url = hash ? hash.split('#')[1] : '';
		ohm.url = url;
		var page = ohm.prefix + '-' + 'index'; // 得到模块名

		if (ohm.callback.setMod) { //根据地址获取模块
			ohm.callback.setMod.call(this, page, url);
		} else { //默认获取模块
			var local;
			if (url.indexOf('r=') > 0) {
				local = url.split('/');
				page = (local[1] && local[2]) ? ohm.prefix + '-' + local[1] + '-' + local[2] : page;
			} else {
				local = url.split('.html')[0].split('/');
				page = (local[0] && local[1]) ? ohm.prefix + '-' + local[0] + '-' + local[1] : page;
			}
			//page = page.replace(/\//g,'-');	//替换获得的地址
		}

		if (ohm.cache.keyArray.length > ohm.cache.MAX) { //清除缓存的内容
			if (ohm.callback.onCacheBeforeClear) {
				ohm.callback.onCacheBeforeClear.call(this, url, page);
			}
			var index = ohm.cache.keyArray[0];
			for (var i in ohm.cache[index]) {
				ohm.cache[index][i].remove();
			}
			ohm.cache[index] = null;
			ohm.jsCache[index] = null;
			ohm.cache.keyArray.shift();
		}

		if (url === '') { //无hash
			if (ohm.callback.noHash) {
				ohm.callback.noHash.call(this);
			}
		} else if (ohm.cache[url]) { // 如果 url 已经缓存，则显示对应的内容
			//console.log('访问的页面已经缓存："' + url + '"');
			if (ohm.cache.current) {
				for (var i in ohm.cache.current) {
					ohm.cache.current[i].hide();
				}
			}
			if (ohm.callback.hasCache) {
				ohm.callback.hasCache.call(this, url, page);
			}
			ohm.reloadJs(url); //加载缓存的js
			for (var i in ohm.cache[url]) {
				ohm.cache[url][i].show();
			}
			ohm.cache.current = [];
			for (var i = 0; i < ohm.cache[url].length; i++) {
				ohm.cache.current.push(ohm.cache[url][i]);
			}
		} else { // 载入新页面
			if (ohm.callback.onNewPageSetting) {
				ohm.callback.onNewPageSetting.call(this, url, page);
			}
			$.ajax({
				url : url,
				dataType : ohm.dataType.page,
				beforeSend : function () {
					//console.log('加载新页面前');
					if (ohm.callback.onNewPageBeforeSend) {
						ohm.callback.onNewPageBeforeSend.call(this, url, page);
					}
				},
				success : function (data) {
					//console.log('请求的新数据为：', data);
					if (data.code == 1) {
						//console.log('请求新数据成功');
						ohm.currentData = data;
						if (ohm.cache.current) {
							for (var i in ohm.cache.current) {
								ohm.cache.current[i].hide();
								//console.log('隐藏当前显示的缓存模块：', ohm.cache.current[i]);
							}
						}
						if (ohm.callback.onNewPageSuccess) {
							ohm.cache.current = [];
							ohm.cache.latest = [];
							ohm.cache[ohm.url] = [];
							ohm.cache.currentMod = [];
							ohm.callback.onNewPageSuccess.call(this, url, page, data);
						}
					} else {
						//console.error('来自php的出错信息：', data.error);
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
				},
				complete : function (data) {
					//console.log('完成新页面加载');
					if (ohm.callback.onNewPageComplete) {
						ohm.callback.onNewPageComplete.call(this, url, page, ohm.cache.latest);
					}
				},
				error : function (error) {
					//console.error('加载新页面出错：', error);
					if (ohm.callback.onNewPageError) {
						ohm.callback.onNewPageError.call(this, url, page, error);
					}
				},
				statusCode : {
					404 : function () {
						//console.error('404错误');
						ohm.cache.current = ohm.cache.latest = null; //请求的页面出错，则当前缓存和最新缓存清空
					}
				}
			});
		}
	});

})(jQuery, this);

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
		var $temp, $title, $shadow, $closeButton, $container;
		var play;
		var html = '';
		function init() {
			$temp = $('<div class="popup" />');
			$title = $('<div class="title" />');
			$shadow = $('<div class="popup_shadow" />'); 
			$closeButton = $('<div class="close" />'); 
			$container = $('<div class="container" />'); 
		}
		function add(popup) {
			$closeButton = $closeButton.html('×').appendTo($temp);
			$title.html(popup.options.title).appendTo($temp);
			if(popup.options.id) {
				$container.append(popup.options.id.clone().show()).appendTo($temp);
			}else {
				$container.html(html).appendTo($temp);
			}
			$temp = $temp.css({'display': 'none'}).appendTo('body');
			$shadow = $shadow.appendTo('body');
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
			setStyle: function(el) {
				var that = this,
					width = that.options.width,
					height = that.options.height,
					full = that.options.full;
				if(el.css('position') !== 'absolute') {
					el.css({'position': 'absolute'})	
				}
				if(full) {
					var top = full.top || 'auto',
						right = full.right || 'auto',
						bottom = full.bottom || 'auto',
						left = full.left || 'auto';
					el.css({'width': 'auto', 'height': 'auto', 'top': top, 'right': right, 'bottom': bottom, 'left': left});
				}else {
					if(width && width === 'auto') {
						el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'width': 'auto', 'right': 'auto', 'left': 'auto'});
						el.css({'width': $container.width(), 'display': 'none', 'visibility': 'visible'});
					}else {
						el.width(width);	
					}	
					if(height && height === 'auto') {
						el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'height': 'auto', 'top': 'auto', 'bottom': 'auto'});
						el.css({'height': $container.height(), 'display': 'none', 'visibility': 'visible'});
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
				el.animate({'left': left, top: top}, 100);
			},
			open: function() {
				var that = this;
				if(that.options.id) {
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
						$temp.fadeOut();
						$shadow.fadeOut();
						$temp.queue(function() {
							$shadow.remove();
							$temp.remove();
							$(window).unbind('resize.popup');
							$(this).dequeue();
						});
						return false;	
					}	
				});
			}	
		};
		return constructor;
	})();
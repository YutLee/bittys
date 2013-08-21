/**
 *	jQuery tip v1.0
 *	Date: 2013-7-16
 *	Update: 2013-7-16
 */
(function($, window, undefined) {
	//'use strict';
	var ohm = window.ohm = window.ohm || {},
		tt = ohm.tt = ohm.tooltip = {};
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
 *	jQuery ajax build v1.6
 *	Date: 2013-7-9
 *	Update: 2013-8-2	--更新模板加载方式
 */

(function ($, window, undefined) {
	//'use strict';
	var ohm = window.ohm = window.ohm || {},
		ab = ohm.ab = ohm.ajaxBuild = {};

	ab.vesion = '1.6';	//记录版本号
	
	ab.indexUrl = '#index';	//主页地址
	ab.isLogin = false; //标记是否登录
	ab.currentUrl = ''; //记录当前地址
	ab.latestUrl = ab.indexUrl; //记录新的地址
	ab.time = '';	//记录页面更新的时间，判断新页面是否需要更新
	
	ab.getData = function () {
		return this.data;
	};

	ab.setData = function (data) {
		this.data = data;
	};

	ab.cache = { //缓存
		key: []//记录所有缓存的hash
	};

	ab.callback = { //回调函数
		noHash: null,
		onBeforeSend: null,
		onDataSuccess: null,
		onTempComplete: null
	};

	/*
	 *	刷新当前页面
	 */
	ab.reload = function () {
		this.time = '';
		$(window).hashchange();
	};

	/*
	 *	加载模板
	 */
	ab.loadTemp = function (tempUrl, append) {
		var that = this,
			len = tempUrl.length,
			latestUrl = that.latestUrl,
			latestData = that.latestData,
			group = grouping(latestData.mod),
			i = 0, 
			j = 0,	//新模板数
			k = 0,
			l = 0,	//已缓存模板数
			url,
			mod,
			temp,
			tempIndex = {};
		
		console.log('模板插入位置分组：', group);
		
		while(k < len) {
			tempIndex[tempUrl[k]] = k;
			k++;
		}
		for(; i < len; i++) {
			url = tempUrl[i];
			temp = that.getCache('temp', url);
			if(!temp) {
				$.ajax({
					url: url,
					beforeSend: function () {
						console.log('开始加载第 ' + (i + 1) + ' 个模板："' + url + '"');
					},
					success: function (data) {
						var newUrl = this.url,
							idx = tempIndex[newUrl],
							newTemp,
							cache;
						
						that.setCache('temp', newUrl, data);	//存储该模板html
						newTemp  = that.getCache('temp', newUrl);
						mod = append ? latestData.mod[idx] : that.getCache(latestUrl, 'mod')[idx];
						cache = that.appendHtml(newTemp, latestData.data[idx], group, idx, mod, append);
						that.setCache(('$' + latestUrl), newUrl, cache);
						console.log('成功加载模板："' + newUrl + '"');
						j++;
						if(j >= len - l) {
							hasLoadedTemp();
						}
					},
					error : function (error) {
						console.error('加载模板出错', error);
					}
				});
			}else {
				console.log('第 ' + (i + 1) + ' 个模板："' + url + '"已存在');
				mod = append ? latestData.mod[i] : that.getCache(latestUrl, 'mod')[i];
				var cache = that.appendHtml(temp, latestData.data[i], group, i, mod, append);
				that.setCache(('$' + latestUrl), url, cache);
				l++;
				if(j >= len - l) {
					hasLoadedTemp();
				}
			}
		}
		function hasLoadedTemp() {//完成所有模板加载
			console.log('完成所有模板加载');
			that.loadJs(latestData.jsUrl);	//加载js
			if(that.callback.onTempComplete) {
				that.callback.onTempComplete.call(that, that.latestUrl);
			}
		}
		//分组插入位置
		function grouping(mod) {
			var group = {}
				i = 0,
				len = mod.length;
			for(; i < len; i++) {
				var now = mod[i];
				if(!group[now]) {
					group[now] = [];	
				}
				group[now].push([i, '']);
			}
			return group;
		}
	};
	
	/*
	 *	插入html
	 */
	ab.appendHtml = function(temp, data, group, idx, mod, append) {
		var bt = baidu.template,
			html = bt(temp, data),
			box = $('<div class="cache" />'),
			cache;
		if(append) {
			cache = $(html).appendTo(this.snapCache);
		}else {
			var i = 0, len = group[mod].length;
			for(; i < len; i++) {
				if(group[mod][i][0] === idx) {
					if(i === 0) {	//此组第一个位置
						var next = i + 1;
						if(next < len - 1) {
							while(group[mod][next][1] == '') {
								next++;
							}
							(group[mod][next][1] != '') ?
								group[mod][i][1] = cache = box.insertBefore(group[mod][i - 1][1]).html(html) :
								group[mod][i][1] = cache = box.appendTo(mod).html(html);
						}else {
							group[mod][i][1] = cache = box.appendTo(mod).html(html);
						}
					}else if(i === len - 1) {	//此组最后一个位置	
						var prev = i - 1;
						if(prev > 0) {
							while(group[mod][prev][1] == '') {
								prev--;
							}
							(group[mod][prev][1] != '') ?
								group[mod][i][1] = cache = box.insertAfter(group[mod][i - 1][1]).html(html) :
								group[mod][i][1] = cache = box.appendTo(mod).html(html);
						}else {
							group[mod][i][1] = cache = box.appendTo(mod).html(html);
						}
						
					}else {	
						var prev = i - 1, next = i + 1;
						if(prev > 0) {
							while(group[mod][prev][1] == '') {
								prev--;
							}
							if(group[mod][prev][1] != '') {
								group[mod][i][1] = cache = box.insertAfter(group[mod][i - 1][1]).html(html);
							}
						}else {
							if(next < len - 1) {
								while(group[mod][next][1] == '') {
									next++;
								}
								(group[mod][next][1] != '') ?
									group[mod][i][1] = cache = box.insertBefore(group[mod][i - 1][1]).html(html) :
									group[mod][i][1] = cache = box.appendTo(mod).html(html);
							}else {
								group[mod][i][1] = cache = box.appendTo(mod).html(html);
							}
						}
					}
				}
			}
		}
		return cache;
	};
	
	/*
	 *	加载css
	 */
	ab.loadCss = function (cssUrl) {
		var that = this;
		for(var i in cssUrl) {
			var now = cssUrl[i];
			if(!that.getCache('css', now)) {
				$('<link rel="stylesheet" href="' + cssUrl[i] + '" />').appendTo('head');
				that.setCache('css', now, now);
				console.log('加载新css："' + now + '"');
			}else {
				console.log('加载的css："' + now + '"已存在');
			}
		}
	};

	/*
	 *	加载js
	 */
	ab.loadJs = function (jsUrl) {
		var that = this;
		for (var i in jsUrl) {
			var now = jsUrl[i];
			if(!that.getCache('js', now)) {
				console.log('加载新js："' + now + '"');
				that.loadOneJs(now, false);
				that.setCache('js', now, now);
			}else {
				console.log('重新加载js："' + now + '"');
				that.loadOneJs(now, true);
			}
		}
	};
	
	/*
	 *	加载一个js
	 */
	ab.loadOneJs = function(jsUrl, cache) {
		$.ajax({
			url: jsUrl,
			cache: cache,
			dataType: 'script'
		});
	}

	/*
	 *	清除缓存
	 */
	ab.clearCache = function () {};
	
	/*
	 *	是否需要更新
	 */
	ab.isReload = function () {
		var that = this,
			time = that.time,
			isLogin = that.isLogin;
		return ((time == '') || (time != that.latestData.time) || (isLogin != that.latestData.isLogin)) ? true : false;
	};

	/*
	 *	获取新数据
	 */
	ab.loadPage = function (url, append, mod) {
		var that = this;
		that.time = that.getCache(url, 'time') || '';	//若新页面已缓存，获取该页面时间
		that.isLogin = that.getCache(url, 'isLogin') || false;	//若新页面已缓存，获取该页面登录状态
		$.ajax({
			type: 'POST',
			data: {
				time: that.time,
				mod: mod || ''
			},
			url: url,
			dataType: 'json',
			beforeSend: function () {
				console.log('加载新数据："' + url + '"');
				if(that.callback.onBeforeSend) {
					that.callback.onBeforeSend.call(that, url);	
				}
			},
			success: function (data) {
				if(that.callback.onDataSuccess) {
					that.callback.onDataSuccess.call(that, url);	
				}
				if(data.code == 1) {
					console.log('成功加载新数据：', data);
					that.latestData = that.resolve(data);
					that.countPage = that.latestData.countPage;
					that.setCache(url, 'mod', that.latestData.mod);
					if(!append) {
						if(that.isReload()) {
							that.removeCachePage(url);	//删除已缓存的页面
							that.loadNewPage(url, that.latestData);	//加载新页面	
						}else {
							that.showCachePage(that.currentUrl, url);	//显示已缓存的页面
						}
					}else {
						that.appendNewPage(url, that.latestData);	//在当前页面添加新内容	
					}
				}else {
					var msg = that.currentMsg = data.error.msg;
					if(msg && msg !== '') {
						if(that.callback.onNewDataError) {
							that.callback.onNewDataError.call(that, msg);	
						}
					}
					var link = data.error.url;
					
					if(link && link !== '') {
						that.hidePage(that.currentUrl);
						if(data.error.cross) {
							window.location.href = link;
						}else {
							window.location.hash = link.split('#')[1];
						}
						console.log('跳转到："' + link + '"');
					}
				}
				if(!append) {
					that.currentUrl = url;
				}
				//that.setCache(url, 'isLogin', that.latestData.isLogin);
				//that.isLogin = that.getCache(url, 'isLogin');
			},
			complete: function () {
				console.log('完成新数据加载');
			},
			error: function(error) {
				console.error('加载新数据出错：', error);
			}
		});
	};
	
	/*
	 *	加载新页面
	 */
	ab.loadNewPage = function (url, data) {
		var that = this;
		that.hidePage(that.currentUrl);	
		that.setCache(url, 'time', data.time);
		that.setCache(url, 'isLogin', data.isLogin);
		that.loadCss(data.cssUrl);
		that.loadTemp(data.tempUrl, false);
		console.log('当前地址："' + that.currentUrl + '"');
		console.log('新地址："' + url + '"');
	}
	
	/*
	 *	添加新页面到当前页面
	 */
	ab.appendNewPage = function (url, data) {
		var that = this;
		that.loadCss(data.cssUrl);
		that.loadTemp(data.tempUrl, true);
		console.log('当前页面地址："' + that.currentUrl + '"');
		console.log('添加页面地址："' + url + '"');
	}
	
	/*
	 *	隐藏当前页面
	 */
	ab.hidePage = function(currentUrl) {
		console.log('隐藏当前页面', currentUrl);
		var that = this,
			$cache = that.cache[('$' + currentUrl)];
		for(var i in $cache) {
			if($cache[i]) {
				$cache[i].hide();
			}
		}
	};
	
	/*
	 *	显示缓存页面
	 */
	ab.showPage = function(newUrl) {
		var that = this,
			$cache = that.cache[('$' + newUrl)];
		for(var i in $cache) {
			$cache[i].show();
		}
	};
	
	/*
	 *	获取当前页面显示的jQuery对象
	 */
	ab.gv = ab.getVisible = function(id) {
		var visible = [],
			that = this,
			$cache = that.cache[('$' + that.currentUrl)];
		for(var i in $cache) {
			if($cache[i]) {
				var now = $cache[i].find(id);
				for(var j = 0, len = now.length; j < len; j++) {
					visible.push(now[j]);
				}
			}
		}
		return $(visible);
	};
	
	ab.gc = ab.getCacheElement = function() {
		var visible = [],
			that = this,
			$cache = that.cache[('$' + that.currentUrl)];
		for(var i in $cache) {
			var now = $cache[i];
			if(now) {
				for(var j = 0, len = now.length; j < len; j++) {
					visible.push(now[j]);
				}
			}
		}
		return $(visible);
	}
	
	/*
	 *	切换需要显示的页面
	 */
	ab.showCachePage = function (currentUrl, newUrl) {
		ab.hidePage(currentUrl);
		ab.showPage(newUrl);
		console.log('请求的页面已缓存，直接显示："' + newUrl + '"');
	};
	
	/*
	 *	删除缓存页面
	 */
	ab.removeCachePage = function (url) {
		console.log('删除缓存页面', url);
		var that = this,
			$cache = that.cache[('$' + url)];
		for(var i in $cache) {
			console.log($cache[i]);
			if($cache[i] && $cache[i].length !== 0) {
				$cache[i].remove();
				$cache[i] = null;
			}
		}
		that.setCache(url, 'time', '');
		that.setCache(url, 'isLogin', false);
		that.setCache(url, 'mod', []);
	};

	/*
	 *	获取当前hash
	 */
	ab.getHash = function () {
		var hash = window.location.hash, //获取hash
		url = hash ? hash.split('#')[1] : '';
		return ab.latestUrl = url;
	};

	/*
	 *	获取当前元素链接url
	 */
	ab.getLink = function (el) {
		var hash = el.attr('href'),
		url = hash ? hash.split('#')[1] : '';
		return ab.newUrl = url;
	};

	/*
	 *	解析hash获取的数据
	 */
	ab.resolve = function (data) {
		console.log(data.mod);
		var that = this,
			newData = {};
			newData.data = [];
			newData.tempUrl = [];
			newData.jsUrl = [];
			newData.cssUrl = [];
			newData.mod = [];
			newData.time = data.time || '';
			newData.countPage = data.count_page;
			newData.isLogin = data.is_login || false;
		for (var i in data.data) {
			newData.data.push(data.data[i]);
		}
		for (var i in data.temp_url) {
			newData.tempUrl.push(data.temp_url[i]);
		}
		for (var i in data.css_url) {
			newData.cssUrl.push(data.css_url[i]);
		}
		for (var i in data.js_url) {
			newData.jsUrl.push(data.js_url[i]);
		}
		for (var i in data.mod) {
			newData.mod.push(data.mod[i]);
		}
		return newData;
	};
	
	/*
	 *	设置URL缓存，存储temp，js，css
	 */
	ab.setCache = function (type, url, value) {
		var type = ab.cache[type] = ab.cache[type] || {};
		if (!type[url]) { //该url未存储
			type[url] = value;
		}
	};

	/*
	 *	获取URL缓存，存储temp，js，css
	 */
	ab.getCache = function (type, url) {
		var type = ab.cache[type] = ab.cache[type] || {};
		return type[url];
	};

	/*
	 *	跳转到新页面或加载新数据
	 */
	ab.jump = function (url) {
		var that = this;
		if (url === '') { //没有hash
			window.location.hash = ab.indexUrl;
		} else {
			that.loadPage(url, false);
		}
	};

	$(window).bind('hashchange', function (e) {
		var url = ab.getHash();
		ab.jump(url);
	});

})(jQuery, this);
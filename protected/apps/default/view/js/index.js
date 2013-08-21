/* 加载页面 */
(function($, window, undefined) {
	var ohm = window.ohm;
	var ab = ohm.ab;
	ohm.tt.delay = 2500;
	ab.indexUrl = 'index.php?r=default/index/home'; 
	ab.callback.onBeforeSend = function(url) {	//请求数据之前回调函数
		if(url === '') {
			
		}else{
			
		}
	};
	ab.callback.onDataSuccess = function(url) {	//请求数据成功回调函数
		
	};
	ab.callback.onTempComplete = function(url) {	//请求模板完成
		
	};
	ab.callback.onNewDataError = function(msg) {
		ohm.tt.errorTip(msg);
	};
	$(window).hashchange();
})(jQuery, this);

// 后退
$('body').delegate('.js_back', 'click', function(){
	history.back();
});
//搜索按钮
$('body').delegate('.toSearch', 'click', function(){
	var that = $(this);
	var input = that.siblings('.inputBox').children('input');
	if(input.length !== 0) {
		input.blur();
		var keyword = input.val();
		if (keyword){
			var surl = '#index.php?r=default/hadsearch/index&keyword=' + keyword;
			that.attr('href', surl);
		}else{ 
			ohm.tt.warningTip('请输入关键字');
			return false;
		}
	}
});

$('body').delegate('.clearInput', 'click', function() {
	var that = $(this);
	var input = that.siblings('.inputBox').children('input');
	input.val('');
});
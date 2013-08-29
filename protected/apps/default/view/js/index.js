// 后退
$(document).delegate('.js_back', 'click', function(){
	history.back();
});
//搜索按钮
$(document).delegate('.toSearch', 'click', function(){
	var that = $(this);
	var input = that.siblings('.inputBox').children('input');
	if(input.length !== 0) {
		input.blur();
		var keyword = input.val();
		if (keyword){
			var surl = '#index.php?r=default/hadsearch/index&keyword=' + keyword;
			that.attr('href', surl);
		}else{ 
			//ohm.tt.warningTip('请输入关键字');
			return false;
		}
	}
});

$(document).delegate('.clearInput', 'click', function() {
	var that = $(this);
	var input = that.siblings('.inputBox').children('input');
	input.val('');
});
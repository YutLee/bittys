(function() {
	
var wrapper = $('#scroll');

var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;
	
if(myScroll) {
	myScroll.destroy();
	myScroll = null;
}
	
loaded();


function pullDownAction () {
	//ohm.ab.reload();	
}

function pullUpAction () {
	if(!wrapper.data('data-page') || wrapper.data('data-page') < 5) {
		if(!wrapper.data('data-page')) {
			wrapper.data('data-page', 2);	
		}else {
			wrapper.data('data-page', wrapper.data('data-page') + 1);
		}
		if(!wrapper.data('data-url')) {
			var hash = window.location.hash;
			hash = hash.replace(/^#/, '').replace(/(&p=)[0-9]*/g, '');
			wrapper.data('data-url', hash);	
		}
		var page = wrapper.data('data-page');
		var url = wrapper.data('data-url') + '&p=' + page;
		setTimeout(function () {
			//ohm.ab.snapCache = $('#listOut');
			//ohm.ab.loadPage(url, true);
		}, 1000);	
	}else {
		app.tt.successTip('没有更多了');
	}
}

function loaded() {
	pullDownEl = $('#pullDown');
	pullDownOffset = pullDownEl.height();
	pullUpEl = $('#pullUp');	
	pullUpOffset = pullUpEl.height();
	
	myScroll = new iScroll(wrapper[0], {
		useTransition: false,
		hScrollbar: false,
		checkDOMChanges: true,
		scrollbarClass: 'myScrollbar',
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.hasClass('loading')) {
				pullDownEl.removeClass('loading');
				pullDownEl.find('.pullDownLabel').html('Pull down to refresh...');
			} else if (pullUpEl.hasClass('loading')) {
				pullUpEl.removeClass('loading');
				pullUpEl.find('.pullUpLabel').html('Pull up to load more...');
			}
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.hasClass('flip')) {
				pullDownEl.addClass('flip');
				pullDownEl.find('.pullDownLabel').html('Release to refresh...');
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.hasClass('flip')) {
				pullDownEl.removeClass('flip loading');
				pullDownEl.find('.pullDownLabel').html('Pull down to refresh...');
				this.minScrollY = -pullDownOffset;
				
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.hasClass('flip')) {
				pullUpEl.addClass('flip');
				pullUpEl.find('.pullUpLabel').html('Release to refresh...');
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.hasClass('flip')) {
				pullUpEl.removeClass('flip loading');
				pullUpEl.find('.pullUpLabel').html('Pull up to load more...');
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl.hasClass('flip')) {
				pullDownEl.addClass('loading');
				pullDownEl.find('.pullDownLabel').html('Loading...');				
				pullDownAction();	
			} else if (pullUpEl.hasClass('flip')) {
				pullUpEl.addClass('loading');
				pullUpEl.find('.pullUpLabel').html('Loading...');				
				pullUpAction();	
			}
		}
	});
}
})();
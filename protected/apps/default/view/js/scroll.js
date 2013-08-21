var wrapper = ohm.ab.gv('#scroll');

var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;
	
loaded();


function pullDownAction () {
	ohm.ab.reload();	
}

function pullUpAction () {
	if(!wrapper.data('data-page') || wrapper.data('data-page') < ohm.ab.countPage) {
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
			ohm.ab.snapCache = ohm.ab.gv('#listOut');
			ohm.ab.loadPage(url, true);
		}, 1000);	
	}else {
		ohm.tt.successTip('没有更多了');
	}
}

function loaded() {
	pullDownEl = ohm.ab.gv('#pullDown')[0];
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = ohm.ab.gv('#pullUp')[0];	
	pullUpOffset = pullUpEl.offsetHeight;
	
	myScroll = new iScroll(wrapper[0], {
		useTransition: false,
		hScrollbar: false,
		checkDOMChanges: true,
		scrollbarClass: 'myScrollbar',
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
			}
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
				
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
				pullDownAction();	
			} else if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';				
				pullUpAction();	
			}
		}
	});
	
}
var wrapper = $('.tab_wrapper')[0];
var tabs = $('#tabs'), page = $('.tab_content');
var chose;
if(iscroll) {
	iscroll.destroy();
	iscroll = null;
}
var iscroll = new iScroll(wrapper, {
	snap: true,
	momentum: false,
	hScrollbar: false,
	checkDOMChanges: true,
	vScroll: false,
	scrollbarClass: 'myScrollbar',
	onSnapStart: function() {
		var bdWidth = $(window).width();
		page.width(bdWidth);
		$('.tab_contents').width(page.width() * page.length);
	},
	onScrollEnd: function () {
		var now = tabs.find('.tab').eq(this.currPageX);
		if(!now.hasClass('choose')) {
			now.addClass('choose').siblings('.choose').removeClass('choose');
		}
	}
});
for(var i = 0; page[i] ; i++) {
	new iScroll(page[i], {checkDOMChanges: true, hScroll: false, scrollbarClass: 'myScrollbar'});
}

iscroll.scrollToPage(1, 0, 100);

tabs.find('.tab').unbind('click');
tabs.find('.tab').bind({
	'click':function() {
		var that = $(this),
			index = that.index();
		iscroll.scrollToPage(index);
	}
});

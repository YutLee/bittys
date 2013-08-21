var wrapper = ohm.ab.gv('.tab_wrapper')[0];
var tabs = ohm.ab.gv('#tabs');
var tabList = [];
var iscroll = new iScroll(wrapper, {
	snap: true,
	momentum: false,
	hScrollbar: false,
	checkDOMChanges: true,
	vScroll: false,
	scrollbarClass: 'myScrollbar',
	onSnapStart: function() {
		var bdWidth = ohm.ab.gc().width(),
			page = ohm.ab.gv('.tab_content');
		page.width(bdWidth);
		ohm.ab.gv('.tab_contents').width(page.width() * page.length);
		for(var i = 0; page[i] ; i++) {
			var s = new iScroll(page[i], {checkDOMChanges: true, hScroll: false, scrollbarClass: 'myScrollbar'});
			tabList.push(s);
		}
	},
	onScrollEnd: function () {
		tabs.find('.choose').removeClass('choose');
		tabs.find('.tab').eq(this.currPageX).addClass('choose');
	}
});
tabList = [];

//iscroll.refresh();
iscroll.scrollToPage(1, 0, 100);
tabs.find('.tab').unbind('click');
tabs.find('.tab').bind({
	'click':function() {
		var that = $(this),
			index = that.index();
		//tabList[index].refresh();
		iscroll.scrollToPage(index);
	}
});
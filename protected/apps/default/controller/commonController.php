<?php
//公共类
class commonController extends baseController
{
	public $layout = '';
	public function __construct() {
		parent::__construct();              		
		@session_start();//开启session
	}

	public function loadhtml() {
		$page = $_GET['html'];
		$this->display($page);	
	}
	
	/**
	 * isFirstLoading()
	 * 判断页面是否首次加载
	 * @return {Boolean} 返回true则是首次加载
	 */
	public function isFirstLoading() {
		return (getallheaders()['Accept'] == 'application/json') ? false : true;
	}
	
	/**
	 * loadFrame($data)
	 * 加载页面基本框架
	 * @param {Json} $data 页面数据
	 */
	public function loadFrame($data = '{}') {
		$this->display('html/header');
		echo '<script>var app = app || {}, bt = app.bt || {};bt.initData = '.$data.';bt.loadPage(bt.initData);bt.request();</script>';
		$this->display('html/footer');
	}
	
	/**
	 * loadPage($data)
	 * 加载页面模板及数据
	 * @param {Json} $data 页面模板和数据
	 */
	public function loadPage($data) {
		if($this->isFirstLoading()) {
			$this->loadFrame($data);
		}else {
			echo $data;
		}
	}
	
	/**
	 * printJson()
	 * 打印Json数据
	 * @param {Json} $data 需要打印的数据
	 * @return {Json} $data
	 */
	public function printJson($data) {
		if($data['code'] == '') {
			$data['code'] = 1;
		}
		return json_encode($data);
	}
}
?>
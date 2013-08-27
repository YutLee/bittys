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
	 * getRequest()
	 * 获取客户端请求的数据
	 * @return {Object} 返回客户端请求的数据
	 */
	public function getRequest() {
		$request = array(
			'temps' => explode(',', getallheaders()['Temps']),
			'current' => explode(',', getallheaders()['Current'])
		);
		return $request;
	}
	
	/**
	 * getTempId()
	 * 获取客户端未缓存的模板
	 * @param {Array} $temps 当前页面所有模板id
	 * @return {Array} 返回客户端未缓存的模板id
	 */
	public function getTempId($temps) {
		return array_diff($temps, $this->getRequest()['temps']);
	}
	
	/**
	 * getNotShowerId()
	 * 获取客户端新页面在发送请求页面中未出现的模块
	 * @param {Array} $current 当前页面所有模板id
	 * @return {Array} 返回客户端新页面在发送请求页面中未出现的模块id
	 */
	public function getNotShowerId($current) {
		return array_diff($current, $this->getRequest()['current']);
	}
	
	/**
	 * getNotShower()
	 * 获取客户端新页面在发送请求页面中为出现的数据
	 * @param {Array} $data 当前页面所有数据
	 * @return {Array} 返回客户端新页面在发送请求页面中为出现的数据
	 */
	public function getNotShower($data) {
		
	}
	
	/**
	 * loadFrame($data)
	 * 加载页面基本框架
	 * @param {Json} $data 页面数据
	 */
	public function loadFrame($data = '{}') {
		$this->display('html/header');
		echo '<script>(function(window, undefined) {var app = window.app = window.app || {}, bt = app.bt;bt.initData = '.$data.';bt.loadPage(bt.initData);bt.request();})(window);</script>';
		$this->display('html/footer');
	}
	
	/**
	 * loadPage($data)
	 * 加载页面模板及数据
	 * @param {Json} $data 页面模板和数据
	 */
	public function loadPage($data) {
		$result = $this->printJson($data);
		if($this->isFirstLoading()) {
			$this->loadFrame($result);
		}else {
			echo $result;
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
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
	 * getNoCacheTemps()
	 * 获取客户端未缓存的模板
	 * @param {Array} $temp_url 当前页面所有模板id
	 * @return {Array} 返回客户端未缓存的模板
	 */
	public function getNoCacheTemps($temp_url) {
		$temp = array();
		foreach($temp_url as $key => $value) {
			$temp[$key] = $this->display($value, true);
		}
		return $temp;
	}
	
	/**
	 * loadFrame($data)
	 * 加载页面基本框架
	 * @param {Json} $data 页面数据
	 */
	public function loadFrame($data = '{}') {
		$this->display('html/header');
		echo '<script>(function(window, undefined) {var app = window.app = window.app || {}, bt = app.bt;bt.initData = '.$data.';bt.loadPage(window.location.href,bt.initData);bt.bindLink();})(window);</script>';
		$this->display('html/footer');
	}
	
	/**
	 * loadPage($data)
	 * 加载页面模板及数据
	 * @param {Json} $data 页面模板和数据
	 */
	public function loadPage($data) {
		$temp_id = array();
		$temp = array();
		$temp_url = $data['temp_url'];
		if(is_array($temp_url) && count($temp_url) > 0) {
			$new_temp = $this->getTempId($temp_url);
			foreach($new_temp as $key => $value) {
				$temp_id['k'.$key] = $value;
				$temp['k'.$key] = $this->display($value, true);
				//array_push($data['temp_id'], array('0' => $key, '1' => $value));
				//array_push($data['temp'], array('0' => $key, '1' => $this->display($value, true)));//获取模板内容
			}
			$data['temp_id'] = $temp_id;
			$data['temp'] = $temp;
		}
		foreach($data as $key => $value) {
			$now = $data[$key];
			if(!$now || (is_array($data[$key]) && count($data[$key]) == 0)) {
				unset($data[$key]);
			}
		}
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
			//$data['code'] = 1;
		}
		return json_encode($data);
	}
}
?>
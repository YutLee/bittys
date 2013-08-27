<?php
class indexController extends commonController
{ 
    public function index() {
		//界面显示数据
		
		$alltemps_url = array(
			'0' => 'html/home'
		);
		$mod = array(
			'0' => '#mod_index'
		);
		$request = $this->getTempId($alltemps_url);
		$temp_url = $this->getNotShowerId($alltemps_url);
		
		$temp = array();
		$data = '';
		foreach($request as $value) {
			array_push($temp, $this->display($value, true));
		}
		$result = array(
			'alltemps_url' => $alltemps_url,
			'temp_url'	=> $temp_url,
			'temp' => $temp,
			'data' => $data,
			'mod' => $mod
		);
		
		$this->loadPage($result);	
    }
}

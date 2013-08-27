<?php
class indexController extends commonController
{ 
    public function index() {
		//界面显示数据
		
		$temp_url = array(
			'0' => 'html/home'
		);
		$mod = array(
			'0' => '#mod_index'
		);
		$result = array(
			'temp_url'	=> $temp_url,
			'temp' => $temp,
			'data' => $data,
			'mod' => $mod,
			'daf' => array()
		);
		$this->loadPage($result);	
    }
}

<?php
class indexController extends commonController
{ 
    public function index() {
		//界面显示数据
		$temp_url = ['html/home'];
		$mod = ['#mod_index'];
		$temp = [];
		$data = '';
		foreach($temp_url as $value) {
			array_push($temp, $this->display($value, true));
		}
		$result = array(
			'temp_url'	=> $temp_url,
			'current_url' => $temp_url,
			'temp' => $temp,
			'data' => $data,
			'mod' => $mod
		);
		
		$this->loadPage($result);	
    }
}

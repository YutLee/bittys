<?php
class indexController extends commonController
{
    public function index() {
        $this->display('html/index');	
    }
    
    public function home() {
		//界面显示数据
		$temp_url = array(
			'0' => url('index/loadhtml') .'&html=html/home'
		);
		$mod = array(
			'0' => '#mod_index'
		);
		$result = array(
			'code'		=> 1,
			'temp_url'	=> $temp_url,
			'mod'		=> $mod,
		);
		setcookie('mycookie', true);
		echo json_encode($result);	
    }
}

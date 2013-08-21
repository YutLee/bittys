<?php
class searchController extends commonController
{

    public function index() {
		//界面显示数据
		$data = array(
			'0' => '',
			'1' => array(
				'key' => array( '巧克力', '饼干', '牛肉干', '薯片', '酒', '糖', '鱼', '果冻' )
				)
		);
		$temp_url = array(
			'0' => url('index/loadhtml') .'&html=html/search_head',
			'1' => url('index/loadhtml') .'&html=html/search'
		);
		$mod = array(
			'0' => '#mod_index',
			'1' => '#mod_index'
		);
		$result = array(
			'code'		=> 1,
			'data'		=> $data,
			'temp_url'	=> $temp_url,
			'mod'		=> $mod
		);
		
		echo json_encode($result);		
    }
	
}

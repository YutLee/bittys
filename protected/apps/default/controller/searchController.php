<?php
class searchController extends commonController
{

    public function index() {
		//界面显示数据
		$data = array(
			'0' => '',
			'1' => array(
				'key' => array( '巧克力', '饼干', '牛肉干', '薯片', '酒', '糖', '鱼', '果冻' ),
				'link' => 'html/search_result'
				)
		);
		$temp_url = array(
			'0' => 'html/search_head', 
			'1' => 'html/search'
		);
		$mod = array(
			'0' => '#mod_index', 
			'1' => '#mod_index'
		);
		$result = array(
			'temp_url' => $temp_url,
			'data'     => $data,
			'mod'      => $mod
		);
		
		$this->loadPage($result);		
    }
	
}

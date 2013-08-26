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
		$temp_url = ['html/search_head', 'html/search'];
		$mod = ['#mod_index', '#mod_index'];
		$temp = [];
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

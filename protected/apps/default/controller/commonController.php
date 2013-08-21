<?php
//公共类
class commonController extends baseController
{
	public $layout = '';
	public function __construct()
	{
		parent::__construct();              		
		@session_start();//开启session
	}

	 public function loadhtml(  ) 
    {
		$page = $_GET['html'];
		$this->display($page);	
	}

	public function printAjaxJSON( $code=0, $data="", $temp_url="", $css_url="", $js_url="", $mod="" ){
		echo json_encode(array(
				'code'		=> $code,
				'data'		=> $data,
				'temp_url'	=> $temp_url,
				'css_url'	=> $css_url,
				'js_url'	=> $js_url,
				'time'      => time(),
				'is_login'  => true,
				'mod'		=> $mod,
				'error'		=> array('msg'=>$this->error,'url'=>$this->error_url,'cross'=>$this->cross)
			));
		exit;
	}

}
?>
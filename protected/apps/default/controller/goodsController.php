<?php
class goodsController extends commonController
{
    public $m;
    
    function __construct(  )
    {
        $this->m = model( 'goods' );
    }
    
    public function index(  )
    {
		$this->layout='';
        $id = in( $_GET['id'] );
        $result = array( 'code' => 0, 'data'=> array(  ));
        if ( empty( $id ) ) {
            /* 显示产品列表 */
        } else {
            if ( $goodsInfo = $this->m->getInfo( $id, 'store_id, default_image, goods_name, price, description' ) ) {
                $data = array($goodsInfo);
            }
        }
        $temp_url = array(
			'0' => 'html/goods'
		);
		$js_url = array(
			'0' => __APPVIEW__ .'/js/setscroll.js'
		);
		$mod = array(
			'0' => '#mod_index'
		);
		$temp = array();
		foreach($temp_url as $value) {
			array_push($temp, $this->display($value, true));
		}
		$result = array(
			'current_url' => $temp_url,
			'temp_url' 	  => $temp_url,
			'temp'        => $temp,
			'data'        => $data,
			'mod'         => $mod,
			'js_url'      => $js_url
		);
		
		$this->loadPage($result);
    }
    
    public function base(  )
    {
		$this->layout='';
        $this->display(  );
    }
    
    public function detail(  )
    {
		$this->layout='';
        $this->display(  );
    }
    
    public function comment(  )
    {
		$this->layout='';
        $this->display(  );
    }
}
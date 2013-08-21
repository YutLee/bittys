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
			'0' => url('index/loadhtml') .'&html=html/goods'
		);
		$js_url = array(
			'0' => __APPVIEW__ .'/js/setscroll.js'
		);
		$mod = array(
			'0' => '#mod_index'
		);
		$result = array(
			'code'		=> 1,
			'data'		=> $data,
			'temp_url'	=> $temp_url,
			'js_url'	=> $js_url,
			'time'      => time(),
			'is_login'  => true,
			'mod'		=> $mod,
		);
		
		echo json_encode($result);
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
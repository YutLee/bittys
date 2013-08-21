<?php
class storeController extends commonController
{
     public $m;
    
    function __construct(  )
    {
        $this->m = model( 'store' );
    }
    
    public function index(  )
    {
		$this->layout='';
        $id = in( $_GET['id'] );
        $result = array( 'code' => 0, 'data'=> array(  ));
        if ( empty( $id ) ) {
            /* 显示店铺列表 */
        } else {
            if ( $storeInfo = $this->m->getInfo( $id, '*' ) ) {
                $goodsInfo = $this->m->getGoods( $id, 'goods_id, goods_name, default_image,price' );
                $data = array(
						'0' => array('store'=>$storeInfo, 'goods'=>$goodsInfo)
					);
            }
        }
        $temp_url = array(
			'0' => url('index/loadhtml') .'&html=html/store'
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
}
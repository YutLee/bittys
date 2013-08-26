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
			'0' => 'html/store'
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
			'temp_url'    => $temp_url,
			'temp'        => $temp,
			'data'        => $data,
			'mod'         => $mod,
			'js_url'      => $js_url
		);
		
		$this->loadPage($result);
    }
}
<?php
class hadsearchController extends commonController
{
	public $m;

    function __construct(  )
    {
        $this->m = model( 'goods' );    
    }
	
    public function index(){
		$this->layout='';
        $keyword = in( $_GET['keyword'] );
		$keyword = $keyword == null ? in( $_POST['keyword'] ) : $keyword; 
		$currentPage = isset($_GET['p']) ? intval(in($_GET['p'])) : 1;
        $pageSize = isset($_GET['pageSize']) ? intval(in($_GET['pageSize'])) : 3;
		$pageSize = $pageSize < 1 ? 5 : $pageSize;
		$mysort = "price asc";
		$start = $curentPage - 1;
		$start = $start < 0 ? 0 : $start;
        $start = $start * $pageSize;
		$limit = "$start, $pageSize";
        $sqlCount = "SELECT count( * ) as total FROM  " . config( 'DB_PREFIX' ) . "goods g LEFT JOIN ".config( 'DB_PREFIX' )."store s ON g.store_id = s.store_id WHERE g.if_show = 1 AND g.closed = 0 AND s.state = 1 AND (g.goods_name LIKE '%" . $keyword . "%') AND s.region_id > 0";
        $goodsCount = model( 'goods' )->query( $sqlCount );
		if ( $goodsCount > 0 ) {
			$sql = "SELECT g.goods_id, g.goods_name, g.default_image, g.price, g.store_id, s.region_id, s.region_name FROM  " . config( 'DB_PREFIX' ) . "goods g LEFT JOIN ".config( 'DB_PREFIX' )."store s ON g.store_id = s.store_id WHERE g.if_show = 1 AND g.closed = 0 AND s.state = 1 AND (g.goods_name LIKE '%" . $keyword . "%') AND s.region_id > 0 ORDER BY {$mysort} limit {$limit}";
			$goodsInfo = model( 'goods' )->query( $sql );            
			if ($goodsInfo) {
				$storeIds = array(  );                
				foreach ( $goodsInfo as $k=>$v ) {
					if ( is_numeric( $v['store_id'] ) ) {
						$goodsInfo[$k]['comment'] = empty($comment) ? 0 : $comment;
						$storeIds[] = $v['store_id'];
					}
				}
		
				$tmpArr = $tmpArr2 = array(  );
				if ($storeArr = model( 'store' )->select( 'store_id in(' . join( ',', $storeIds ) . ' )', 'store_id, store_name, tel, store_logo, store_banner' )) {
					foreach ( $storeArr as $v ) {
						/* 搜索中有商品的店铺显示在前面 */
						if ( isset( $info[$v['store_id']] ) ) {
							$tmpArr[] = $v;
						} else {
							$tmpArr2[] = $v;
						}
						$info[$v['store_id']]['store'] = $v;    
					}
					$storeInfo = array_merge($tmpArr, $tmpArr2);
					$data1 = array(
									'currentPage'=> $currentPage,
									'no_data'  => false,
									'goods'    => $goodsInfo,
									'store'    => $storeInfo,
									'news'     => file_get_contents( 'http://www.100msh.cn/search?q='.urlencode( $keyword ). '&format=json&p='.$currentPage ),
									'nextPage' => $nextPage,
									'totalPage'=> $totalPage,
									'time'     => $time
								);
					if($currentPage && $currentPage > 1) {
						$data = array(
							'0' => $data1
							);
					}else {
						$data = array(
							'0' => '',
							'1' => $data1
							);
					}
				}                
			}
		}
		$data = $data ? $data : array('', array('no_data' => true));
		$temp_url = array(
			'0' => 'html/search_head', 
			'1' => 'html/search_result'
		);
		$mod = array(
			'0' => '#mod_index',
			'1' => '#mod_index'
		);
		$js_url = array(
			'0' => __APPVIEW__ .'/js/scroll.js'
		);
		$result = array(
			'temp_url'   => $temp_url,
			'data'       => $data,
			'js_url'     => $js_url,
			'count_page' => 3,			
			'mod'        => $mod
		);
		$this->loadPage($result);	
	}

}
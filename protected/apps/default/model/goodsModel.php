<?php
class goodsModel extends baseModel
{    
    protected $table = 'goods';

    function __construct(  )
    {
        parent::__construct(  );
    }

    function getInfo( $gid, $fields='*' ) {
        $storeInfo = $storeInfo = $comment = array(  );
        if ($storeInfo = $this->getStoreInfo( $gid, 'store_id' ) ) {
            $result = $this->find( "goods_id=$gid AND if_show=1 AND closed=0", $fields );
            $comment = $this->getComment( $gid );
        }
        return array_merge( array('goods'=>$result, 'store'=>$storeInfo, 'comment'=> $comment)  );
    }

    /* 通过商品id取得评论的条数 */
    public function getCommentCount( $gid )
    {
        if ( empty( $gid ) || ! is_numeric( $gid ) ) return '';
        return model( 'order_goods' )->count( "goods_id='{$gid}'" );
    }

    public function getComment( $gid )
    {
        if ( empty( $gid ) || ! is_numeric( $gid ) ) return '';
        return model( 'order_goods' )->select( "goods_id='{$gid}'", 'comment' );
    }

    public function getStoreInfo( $gid, $fields='*' )
    {
        if ( empty( $gid ) || ! is_numeric( $gid ) ) return '';
        $sid = $this->find( "goods_id='{$gid}'", 'store_id' );        
        return model( 'store' )->getInfo( $sid['store_id'], $fields );
    }

    
}
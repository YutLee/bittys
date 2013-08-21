<?php
class order_goodsModel extends baseModel
{    
    protected $table = 'order_goods';

    function __construct(  )
    {
        parent::__construct(  );
    }

    function getCommentByGid( $gid )
    {
        return $this->select( "goods_id='{$gid}'", 'comment' );
    }
}
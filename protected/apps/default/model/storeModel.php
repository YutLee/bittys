<?php
class storeModel extends baseModel
{
    protected $table = 'store';

    function __construct(  )
    {
        parent::__construct(  );
    }

    function getGoods( $sid, $fields='*', $start=0, $offset=10 )
    {
        if ( empty( $sid ) ) return '';
        return model( 'goods' )->select( "store_id={$sid} AND if_show=1 AND closed=0", $fields, 'price asc', "$start, $offset" );
    }

    function getInfo( $id, $fields )
    {
        return $this->find( "store_id={$id} AND state=1", $fields );
    }
    
}
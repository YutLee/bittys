<?php
class baseModel extends M{
     protected $prefix='';
     public function __construct( $database= 'DB' ){
        parent::__construct();        
		$this->prefix = config('DB_PREFIX');
	}
}
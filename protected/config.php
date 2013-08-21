<?php
return array (
  'REWRITE' => 
  array (
  ),
  'APP' => 
  array (
    'DEBUG' => true,
    'LOG_ON' => true,
    'LOG_PATH' => BASE_PATH . 'cache/log/',
    'URL_HTTP_HOST' => '',
    'TIMEZONE' => 'PRC',
    'COOKIE_RANGE' => '',
    'COOKIE_PATH' => '/',
    'COOKIE_PRE' => 'yx_',
    'HTML_CACHE_ON' => false,
    'HTML_CACHE_PATH' => BASE_PATH . 'cache/html_cache/',
    'HTML_CACHE_RULE' => 
    array (
      'default' => 
      array (
        'index' => 
        array (
          'index' => 3000,
        ),
        'search' => 
        array (
          '*' => 3000,
        ),
        'photo' => 
        array (
          '*' => 3000,
        ),
        'page' => 
        array (
          '*' => 3000,
        ),
      ),
    ),
  ),
  'DB' => 
  array (
    'DB_TYPE' => 'mysql',
    'DB_HOST' => 'localhost',
    'DB_USER' => 'miso',
    'DB_PWD' => 'miso',
    'DB_PORT' => '3306',
    'DB_NAME' => 'ecmall',
    'DB_CHARSET' => 'utf8',
    'DB_PREFIX' => 'ecm_',
    'DB_CACHE_ON' => false,
    'DB_CACHE_PATH' => BASE_PATH . 'cache/db_cache/',
    'DB_CACHE_TIME' => 600,
    'DB_PCONNECT' => false,
    'DB_CACHE_CHECK' => true,
    'DB_CACHE_FILE' => 'cachedata',
    'DB_CACHE_SIZE' => '15M',
    'DB_CACHE_FLOCK' => true,
  ),
  'TPL' => 
  array (
    'TPL_TEMPLATE_PATH' => '',
    'TPL_TEMPLATE_SUFFIX' => '.html',
    'TPL_CACHE_ON' => false,
    'TPL_CACHE_TYPE' => '',
    'TPL_CACHE_PATH' => BASE_PATH . 'cache/tpl_cache/',
    'TPL_CACHE_SUFFIX' => '.php',
  ),
  'ver_name' => '1.1.4',
  'ver_date' => '20130527',
  'copyright' => '100msh',
  'sitename' => '百米跑腿业务',
  'siteurl' => 'http://www.100msh.com/',
  'keywords' => '100msh',
  'description' => '100msh',
  'telephone' => '400',
  'QQ' => '',
  'email' => 'ole@100msh.com',
  'address' => '东门中路',
  'icp' => 'ICPxxxxxx',
  'fileupSize' => 8000000,
  'imgupSize' => 1000000,
  'ifwatermark' => true,
  'watermarkImg' => 'logo.png',
  'watermarkPlace' => 9,
  'coverMaxwidth' => 260,
  'coverMaxheight' => 208,
  'thumbMaxwidth' => 145,
  'thumbMaxheight' => 110,
  'allowType' => 'jpg,bmp,gif,png,flv,mp4,mp3,wma,mp4,7z,zip,rar,ppt,txt,pdf,xls,doc,swf,wmv,avi,rmvb,rm',
);
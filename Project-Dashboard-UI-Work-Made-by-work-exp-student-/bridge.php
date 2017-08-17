<?php 
@ini_set('max_execution_time', 0);
@ini_set('zlib.output_compression', 0);
@ini_set('implicit_flush', 1);
//@ini_set('display_errors','On');
ini_set('memory_limit', -1); // no limit
//error_reporting(E_ALL);


if( !array_key_exists( 'client_id', $_REQUEST ) )
	die( "Please specify requested parameter. <br/>" );
if( !array_key_exists( 'client_secret', $_REQUEST ) )
	die( "Please specify requested parameter. <br/>" );
if( !array_key_exists( 'code', $_REQUEST ) )
	die( "Please specify requested parameter. <br/>" );




$server = "https://github.com/login/oauth/access_token";

$postdata = http_build_query(
    array(
        'client_id' => $_REQUEST['client_id'],
        'client_secret' => $_REQUEST['client_secret'],
		'code' => $_REQUEST['code'],
		
    )
);

$opts = array('http' =>
    array(
        'method'  => 'POST',
        'header'  => 'Accept: application/json',
        'content' => $postdata
    )
);

$context  = stream_context_create($opts);


$result = file_get_contents($server, false, $context);

echo ($result);
?>

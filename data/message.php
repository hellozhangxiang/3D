<?php
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin:*");
require("../init.php");
session_start();
date_default_timezone_set("PRC");
$msgtime=date ( "Y-m-d H:i:s" );
$msg=$_REQUEST["message"];
$name=$_SESSION["uname"];
$sql="INSERT INTO tw_msg VALUES(NULL,'$name','$msg','$msgtime');";
$result=sql_execute($sql);
if(count($result)>0){
	echo '{"code":1,"msg":"留言成功！"}';
}else{
	echo '{"code":-1,"msg":"留言无效！"}';
}
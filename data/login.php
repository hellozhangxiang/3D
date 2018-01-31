<?php
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin:*");
session_start();
require("../init.php");
@$name=$_REQUEST["uname"];
@$upwd=$_REQUEST["upwd"];
$_SESSION["uname"]=$name;
$_SESSION["uname"]=$name;
$sql="select uid from tw_user where uname='$name' and upwd='$upwd'";
$result=sql_execute($sql);
if(count($result)>0){
	//var_dump($result);
	//echo $result[0]["uid"];
	echo '{"code":1,"msg":"登录成功!"}';
}
else
	echo '{"code":0,"msg":"账户与密码不匹配!"}';
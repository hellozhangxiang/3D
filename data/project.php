<?php
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin:*");
require("../init.php");
session_start();
$sql="SELECT * FROM tw_data";
$result=sql_execute($sql);
//var_dump($result);
echo json_encode($result);
<?php
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin:*");
require("../init.php");
@$city=$_REQUEST["city"];
@$project=$_REQUEST["project"];
$data=[];
if($city==""&&$project==""){
	die("您没有进行选择！");
	
}else{
	$sql="SELECT title FROM tw_data WHERE city='$city' OR city LIKE '%".$city."%'";
	$result=sql_execute($sql);
	$data["projectname"]=$result;
	if(count($result)<1){
		$data["msg"]="该城市没有项目";
		echo json_encode($data);
		die();
	}else{
		if($project==""){
			$project=$data["projectname"][0]["title"];
		}
		$sql="SELECT * FROM tw_data WHERE title='$project' AND city='$city' OR city LIKE '%".$city."%'";
		$result=sql_execute($sql);
		$data["result"]=$result;
	}
	echo json_encode($data);
}

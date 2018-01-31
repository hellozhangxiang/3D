<?php
header("Content-Type:application/text;charset=utf-8");
header("Access-Control-Allow-Origin:*");
require("../init.php");
$msg=$_REQUEST["msg"];
if($msg==""){
	die('{"code":-1,"msg":"输入框为空！请输入您要查找的内容！"}');
}
$msglist= explode(" ",$msg);
//var_dump($msglist);
$newmsg="%";
$newmsg.=str_replace(' ','',$msg);//"第一第二"
$newmsg.="%";
//var_dump($newmsg);
$sql="SELECT * FROM tw_data WHERE title LIKE '$newmsg' OR intr LIKE '$newmsg' OR province LIKE '$newmsg' OR city LIKE '$newmsg'"; 
$result=sql_execute($sql);
//如果找到了，就不执行后续sql查找
if(count($result)){
	echo json_encode($result);
}else{
	$arr=[];
	for($i=0;$i<count($msglist);$i++){
		$newmsgs=" title LIKE '%";
		$newmsgs.=$msglist[$i];
		$newmsgs.="%' OR intr LIKE '%";
		$newmsgs.=$msglist[$i];
		$newmsgs.="%' OR province LIKE '%";
		$newmsgs.=$msglist[$i];
		$newmsgs.="%'  OR city LIKE '%";
		$newmsgs.=$msglist[$i];
		$newmsgs.="%' ";
		array_push($arr,$newmsgs);
	}
	$sql="SELECT * FROM tw_data WHERE ";
	$mysql="";
	for($j=0;$j<count($arr);$j++){
		if($j==(count($arr)-1)){
			$mysql.=$arr[$j];
		}else{
			$mysql.=$arr[$j]." OR ";
		}
	}
	$sql.=$mysql;
	$newresult=sql_execute($sql);
	if(count($newresult)>0){
		echo json_encode($newresult);
	}else{
		echo '{"code":-1,"msg":"没有找到您搜索的项目！"}';
	}
}

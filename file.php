<?php
header("Content-Type:application/json;charset=utf-8");
header("Access-Control-Allow-Origin:*");
require("./init.php");
session_start();
date_default_timezone_set("PRC");
$rs=empty($_FILES);
$uplodTime=date ( "Y-m-d H:i:s" );
if($rs){
	die('{"code":-1,"msg":"没有上传文件"}');
};
$filname=$_FILES["myfil"]["name"];
$picname=$_FILES["mypic"]["name"];
$filsize=$_FILES["myfil"]["size"];
$ftitle=$_REQUEST["ftitle"];
$fileintr=$_REQUEST["fileintr"];
$filepro=$_REQUEST["filepro"];
$filecity=$_REQUEST["filecity"];
$uname=$_SESSION["uname"];
$type=strstr($filname,".");
if($type==".laz"){
	$typetwo=strstr($picname,".");
	/*if($ftitle!=""){
		//$ftitle=iconv("UTF-8","gb2312", $ftitle);//解决乱码问题
		$fileName=$ftitle.$type;
	}else{
		$fileName=$filname.$type;
		
	}*/
	if($typetwo==".jpg"||$typetwo==".png"||$typetwo==".gif"){
		//图片压缩指定大小生产新图片的方法
			function mkThumbnail($src, $width = null, $height = null, $filename = null) {  
				if (!isset($width) && !isset($height))  
					return false;  
				if (isset($width) && $width <= 0)  
					return false;  
				if (isset($height) && $height <= 0)  
					return false;  
			  
				$size = getimagesize($src);  
				if (!$size)  
					return false;  
			  
				list($src_w, $src_h, $src_type) = $size;  
				$src_mime = $size['mime'];  
				switch($src_type) {  
					case 1 :  
						$img_type = 'gif';  
						break;  
					case 2 :  
						$img_type = 'jpeg';  
						break;  
					case 3 :  
						$img_type = 'png';  
						break;  
					case 15 :  
						$img_type = 'wbmp';  
						break;  
					default :  
						return false;  
				}  
			  
				if (!isset($width))  
					$width = $src_w * ($height / $src_h);  
				if (!isset($height))  
					$height = $src_h * ($width / $src_w);  
			  
				$imagecreatefunc = 'imagecreatefrom' . $img_type;  
				$src_img = $imagecreatefunc($src);  
				$dest_img = imagecreatetruecolor($width, $height);  
				imagecopyresampled($dest_img, $src_img, 0, 0, 0, 0, $width, $height, $src_w, $src_h);  
			  
				$imagefunc = 'image' . $img_type;  
				if ($filename) {  
					$imagefunc($dest_img, $filename);  
				} else {  
					header('Content-Type: ' . $src_mime);  
					$imagefunc($dest_img);  
				}  
				imagedestroy($src_img);  
				imagedestroy($dest_img);  
				return true;  
			}  
		/*******************/
		$thisTime=time().rand(1000,9999);
		$fileName=$thisTime.$type;
		$picName=$thisTime.$typetwo;
		$pic="uploads/images/".$picName;
		$newFile="uploads/".$fileName;
		move_uploaded_file($_FILES["myfil"]["tmp_name"],$newFile);
		move_uploaded_file($_FILES["mypic"]["tmp_name"],$pic);
		$newPic="uploads/images/".$thisTime."min".$typetwo;

		//在指定位置生产缩略图
		mkThumbnail($pic, 300, 123,$newPic); 

		$sql="INSERT INTO tw_data VALUES(NULL,'$filname','$newFile','$ftitle','$fileintr','$filepro','$filecity','$newPic','$uname','$uplodTime',1);";
		$result=sql_execute($sql);
		if(count($result)>0){
			$newFile=json_encode($newFile);
			$newPic=json_encode($newPic);
			$thisTime=json_encode($thisTime);
			echo '{"code":1,"msg":"上传成功！","laz":'.$newFile.',"img":'.$newPic.',"tim":'.$thisTime.'}';
		}else{
			echo '{"code":-1,"msg":"数据库插入信息有误！"}';
		}
	}else{
		echo '{"code":-1,"msg":"图片格式错误！"}';
	}
}else{
	echo '{"code":-1,"msg":"文件格式错误！"}';
}
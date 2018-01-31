
var indexHtml="";//用于section的innerHTML
//点击三维实景展示事件方法
function click3D(url){
	event.preventDefault();
	var myurl="../tw_3d_html/"+url+"/"+url+".html";
	indexHtml = `<iframe src='${myurl}' style='' width='100%' height='400px' align='center' frameborder='0' scrolling='no'></iframe>`;
	$(".section").html(indexHtml);
	$("#sectionSele").addClass("notShow");
	$("#statistics").addClass("notShow");
	$("#wode").addClass("notShow");
};
/*****************************************/
//构造初始化主页的ajax请求方法
function onloadData(){
	$.ajax({
		type: "GET",
		url: "data/project.php",
		success: function (data) {
			//调用方法初始化
			getOnload(data);

		},
		error: function () { 
			
		}
	});
}
//动态加载项目数据，初始化页面
	//构造初始化主页带参方法<p class="text-muted">${data[num].intr}</p>
	var isSequence=1;
	function changeSequence(){
		if(isSequence==1){
			isSequence=0;
		}else{
			isSequence=1;
		
		}
		onloadData();
	}
	function getOnload(data){
		var len=data.length;
			if(isSequence==1){
				indexHtml =`<h3 class='indexTitle'><span class='glyphicon glyphicon-menu-right'></span>案件展示
					<select style="font-size:.7em;" onchange="javascript:changeSequence()">
						<option >正序</option>
						<option >倒序</option>
					</select>
				</h3>
					<div class="container" style="position:relative;left:4%">	
				`;
			}else{
				indexHtml =`<h3 class='indexTitle'><span class='glyphicon glyphicon-menu-right'></span>案件展示
					<select style="font-size:.7em;" onchange="javascript:changeSequence()">
						<option >倒序</option>
						<option >正序</option>
					</select>
				</h3>
					<div class="container" style="position:relative;left:4%">	
				`;
			}
				var rowLen=Math.ceil(len/3);
				for(var i=0;i<rowLen;i++){
					indexHtml+=`<div class="row">`;
					for(var j=0;j<3;j++){
						var num=i*3+j;
						//console.log(data[num]);
						
						if(num<len){
							
							if(isSequence==1){
								var uploadTime=data[len-num-1].dname.slice(8,22);
								indexHtml+=`
								<div class="col-sm-6 col-md-4" style="position:relative">
									<div>
										<span>${data[len-num-1].intr}</span>
										<p ><a onclick="javascript:click3D(${uploadTime})">3D展示</a></p>	
									</div>
									<div class="thumbnail">
									  <img src="${data[len-num-1].img}" alt="...">
									  <div class="caption">
										<h4 class="">${data[len-num-1].title}</h4>
									  </div>
									</div>	
								</div>`;
							}else{
								var uploadTime=data[num].dname.slice(8,22);
								indexHtml+=`
								<div class="col-sm-6 col-md-4" style="position:relative">
									<div>
										<span>${data[num].intr}</span>
										<p ><a onclick="javascript:click3D(${uploadTime})">3D展示</a></p>	
									</div>
									<div class="thumbnail">
									  <img src="${data[num].img}" alt="...">
									  <div class="caption">
										<h4 class="">${data[num].title}</h4>
									  </div>
									</div>	
								</div>`;
							}
						}else{break;}
					}
					indexHtml+=`</div>`;
				}
		$(".section").html(indexHtml);
	};

//调用方法初始化页面
onloadData();

/*****************************************/

//文件上传
var $uploadData = $("#uploadData");
var $uploadFileDivA = $(".uploadFile>div>a");
var $uploadFile = $(".uploadFile");
$uploadData.on("click", function (e) {
	e.preventDefault();
	console.log(111);
	$uploadFile.removeClass("notShow");
});
$uploadFileDivA.on("click", function (e) {
	e.preventDefault();
	$uploadFile.addClass("notShow");
});
var fd = new FormData();
//显示选中的文件名称
var myfile=document.getElementById("myfile");
$("#myfile").on("change", function () {
	fileChoseName.innerHTML = myfile.files[0].name;
	fileChoseName.style.color="green";
});
var img=document.getElementById("img");
$("#img").on("change", function () {
	myimg.innerHTML = img.files[0].name;
	myimg.style.color="green";
});
$("#shangchuan").on("click", function (e) {
	e.preventDefault();
	fd.append("myfil", myfile.files[0]);
	fd.append("mypic", img.files[0]);
	//console.log(myfile.files[0]);
	var fileTitle = $("#filename").val();
	var fileintr= $("#fileintr").val();
	var filepro= $("#filepro").val();
	var filecity= $("#filecity").val();
	if(fileTitle==""||fileintr==""||filepro==""||filecity==""){
		alert("请填写完信息");
	}else{
		//发送ajax请求
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "file.php?ftitle="+fileTitle+"&fileintr="+fileintr+"&filepro="+filepro+"&filecity="+filecity, true);
		xhr.setRequestHeader("X-Request-With", "XMLHttpRequest");
		xhr.send(fd);

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var json = JSON.parse(xhr.responseText);
				if (json.code > 0) {
					//清空file功能尚未添加

					var projectImg=json.img;
					var projectData=json.laz;
					var projectTime=json.tim;
					var mydata={
						laz:projectData,
						tim:projectTime
					}
					var projectWorker=new Worker("js/transforming_data.js");
					projectWorker.postMessage(mydata);
					projectWorker.onmessage = function(e){
						//当子线程执行完毕返回数据的时候自动调用函数
						onloadData();
						alert(e.data);
					}
					
					$(".uploadOk").removeClass("notShow");
					var timer = setTimeout(function () {
						$(".uploadOk").addClass("notShow");
						clearTimeout(timer);
						timer = null;
					}, 1000);
				} else {
					$(".uploadErr").removeClass("notShow");
					var timer = setTimeout(function () {
						$(".uploadErr").addClass("notShow");
						clearTimeout(timer);
						timer = null;
					}, 1000);
				}
			}
		}
	}
});

/*****************************************/

//判断是否登陆
if (sessionStorage.uname) {
	$(".isLogin").css({ display: "none" });
	var uname = "欢迎用户：";
	uname += sessionStorage.getItem("uname");
	uname += `<span id="logOff" style="cursor:pointer;margin-left:2em;">退出登陆</span>`;
	$("#user").html(uname);

	//退出登陆
	var logOff = document.getElementById("logOff");
	logOff.onclick = function () { sessionStorage.clear(); location.href = "login.html" };

/*****************************************/

	//页头鼠标移入移出事件
	var liders = document.querySelectorAll(".lider");
	var liderUls = document.querySelectorAll(".myHeaderUl>li>ul>li");
	for (let liderUl of liderUls) {
		liderUl.onmouseover = function () { var $this = this; $this.parentElement.style.height = "200%"; $this.style.background = "#E8580A"; };//inherit
		liderUl.onmouseout = function () { var $this = this; $this.parentElement.style.height = 0; $this.style.background = "black"; }
	}
	for (let lider of liders) {
		if (lider.nextElementSibling)
			lider.onmouseover = function () { var $this = this; $this.nextElementSibling.style.height = "200%"; $this.style.background = "#E8580A" };//inherit
		lider.onmouseout = function () { this.style.background = "black" };
		lider.parentElement.onmouseout = function () {
			this.lastElementChild.style.height = 0;
		}
	}

	//点击首页事件
	$(".goIndex").on("click", function (e) {
		e.preventDefault();
		onloadData();
		$("#wode").removeClass("notShow");
		$("#statistics").removeClass("notShow");
		$("#sectionSele").removeClass("notShow");
	})
/*****************************************/
	//导航栏点击背景色设置事件
	$(".backgoundColor>.blackColor").on("click", function (e) {
		e.preventDefault();
		$("body,body>header,footer").css({ background: "black" });
	});
	$(".backgoundColor>.whiteColor").on("click", function (e) {
		e.preventDefault();
		$("body,body>header,footer").css({ background: "white" });
	})
} else {
	$(".isLogin").css({ display: "block" });
	var i = 3;
	var htmls = "";
	var timer = setInterval(function () {
		if (i > 1) {
			i--;
			htmls = `<h1>请先登陆!</h1>
				<h1>${i}秒后跳转到登陆页面!</h1>
				`;
			$(".isLogin>div").html(htmls);

		} else {
			clearInterval(timer); location.href = "login.html";
		}
	}, 1000);

}
/*****************************************/

//头部搜索框任意搜索
	var $searchInput=$("#searchInput");
	var searchClick=document.getElementById("searchClick");
	function goSearch(e){
		e.preventDefault();
			
		$.post("data/search.php",{msg:$searchInput.val()},function(result){
			//需要转换result格式
			var result=JSON.parse(result);
			if(result.code&&result.code==-1){
				window.alert(result.msg);
			}else{
				getOnload(result);
			}
		});
	}
	searchClick.onclick=function(e){goSearch(e)};
	$searchInput.bind('keypress',function(e){ 
		//头部输入框回车键等同于点击搜索
		if (e.keyCode == 13) {
			goSearch(e);
		}
	});
		//留言功能
		var leaveMesseage=document.getElementById("leaveMessage");
		leaveMesseage.onclick=function(){
			var theMessage=$("#theMessage").val();
			$.post("data/message.php",{message:theMessage},function(result){
				window.alert(result.msg);
			});
		};

/*****************************************/
	//城市 项目名称精确查找

//项目选项select值改变触发事件
function selectOnload(data){
				indexHtml =`
					<div class="container" style="position:relative;left:4%">	
				`;
					indexHtml+=`<div class="row">`;	
							var uploadTime=data.dname.slice(8,22);
							indexHtml+=`
							<div class="col-sm-6 col-md-4" style="position:relative">
								<div>
									<span>${data.intr}</span>
									<p ><a onclick="javascript:click3D(${uploadTime})">3D展示</a></p>	
								</div>
								<div class="thumbnail">
								  <img src="${data.img}" alt="...">
								  <div class="caption">
									<h4 class="">${data.title}</h4>
									
									
								  </div>
								</div>	
							</div>`;
					indexHtml+=`</div>`;
		$(".section").html(indexHtml);
	};


var searchTimer;
var $sectionSearch=$("#sectionSearch");
var searchData={projectname:[],result:[]};
//输入城市时发送ajax请求
$sectionSearch.on("keyup",function(){
	var htmls="";
	searchTimer=setTimeout(function(){
		$.post("data/pcp.php",{city:$sectionSearch.val(),project:""},function(backdata){	
			 //searchData=backdata;
			if(backdata.msg){
				htmls="<option class='opt'>";
				htmls+=backdata.msg;
				htmls+="</option>";
				$(".section").html("<br/</br></br></br><h2 style='text-align:center'>没有找到您查找的内容！</h2>");
			}else{
				htmls="";
				 searchData=backdata;
				for(var k=0;k<backdata.projectname.length;k++){
					if(k==0){
						htmls+="<option class='opt' value='"+k+"' selected>";
						htmls+=backdata.projectname[k].title;
						htmls+="</option>";
					}else{
						htmls+="<option class='opt' value='"+k+"'>";
						htmls+=backdata.projectname[k].title;
						htmls+="</option>";
					}
				}
				getOnload(backdata.result);
				//selectOnload(backdata.result[0]);
			}
			$("#projectSlect").html(htmls);
			
			clearTimeout(searchTimer);
		});
		//延迟0.3秒发送AJAX，减轻服务器负担
	},300);
});
var $projectSlect=$("#projectSlect");

$projectSlect.on("change",function(){
	var newVal=$projectSlect.val();
	selectOnload(searchData.result[newVal]);
});
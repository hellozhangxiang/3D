/*importScripts("jquery-1.11.3.js");
onmessage = function(e){
  //console.log("接收UI线程数据"+e.data.tim);
  var tim=e.data.tim;
  var thisdata=e.data.laz;
  $.ajax({
		type: "GET",
		url: "http://localhost/cgi-bin/potreeConverter.exe?source="+thisdata+"&target="+tim+"&overwrite=true&page="+tim+"&title="+tim+"&input-format=laz",
		headers:{
        "Access-Control-Allow-Headers":"X-Requested-With"
		},
		success: function () {
				postMessage("自动生成完毕");
		},
		error: function () { 
			
		}
	});
}*/
onmessage = function(e){
  //console.log("接收UI线程数据"+e.data.tim);
  var tim=e.data.tim;
  var thisdata=e.data.laz;
  var xhr = new XMLHttpRequest();
		//打开Http链接
   xhr.open("GET","http://127.0.0.1/cgi-bin/pc.cgi?source="+thisdata+"&target="+tim+"&overwrite=true&page="+tim+"&title="+tim+"&input-format=laz", true);
		//修改请求消息头
   xhr.setRequestHeader("X-Request-With", "XMLHttpRequest");
		//发送数据
   xhr.send();

   xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
				postMessage("自动生成完毕");
		} else {
				
		}
	}
}
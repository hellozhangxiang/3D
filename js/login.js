sessionStorage.clear();
var can = document.getElementById("canvas");
//设置绘图环境
var cxt = can.getContext("2d");
//获取浏览器窗口的宽高
var w = can.width = window.innerWidth;
var h = can.height = window.innerHeight;
//让画布的宽高跟随浏览器窗口的变化而变化
window.onresize = function () {
	w = can.width = window.innerWidth;
	h = can.height = window.innerHeight;
}
//面向对象
var drops = [];
//创建雨滴对象，构造函数
function Drop() { }
//添加原型对象方法
Drop.prototype = {
	init: function () {//初始化方法(设置每个雨滴的初始属性)
		//设置坐标，在窗口最上方生成初始位置，x坐标下落过程中始终不变
		this.x = random(0, w);
		this.y = 0;
		//y方向的速度值
		this.vy = random(2, 3);
		//雨滴下落的最大高度，在接近窗口底端位置随机生成高度值，即下落后的y坐标
		this.l = random(0.8 * h, 0.9 * h);
		//波纹的初始半径
		this.r = 1;
		this.vr = 1;//半径增大的速度
		//判断雨滴消失的透明度
		this.a = 1;//  => 0 
		this.va = 0.96;//透明度的变化系数
	},
	draw: function () {//绘制图形
		if (this.y > this.l)//雨滴已经下落到指定位置 开始绘制圆形
		{
			cxt.beginPath();//先开始路径
			cxt.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
			cxt.strokeStyle = "rgba(0,255,255," + this.a + ")";
			cxt.stroke();
		} else {//绘制下落的雨滴
			cxt.fillStyle = "rgb(0,255,255)";
			cxt.fillRect(this.x, this.y, 2, 10);
		}
		this.update();//绘制完后更新坐标
	},
	update: function () {//更新坐标位置
		if (this.y < this.l) {
			this.y += this.vy;
		} else {//雨滴下落到了指定位置 开始绘制波纹
			if (this.a > 0.03) {
				this.r += this.vr;
				if (this.r > 50) {
					this.a *= this.va;
				}
			} else {
				//重新初始化雨滴数据
				this.init();
			}

		}

	}
}

for (var i = 0; i < 30; i++) {
	setTimeout(function () {
		var drop = new Drop();   //新建一个雨滴实例化对象
		drop.init();             //drop.init();//初始化
		drops.push(drop);
	}, i * 300)

}
function move() {
	//先绘制透明层再绘制雨滴  雨滴就把先绘制的透明层覆盖 下一次再绘制透明层就会把之前绘制的雨滴覆盖 若干的透明层叠加就越来越不透明了
	cxt.fillStyle = "rgba(0,0,0,0.1)";
	cxt.fillRect(0, 0, w, h);
	for (var i = 0; i < drops.length; i++) {
		drops[i].draw();
	}
	requestAnimationFrame(move);//一个动画帧
}
move()

//生成随机数的方法
function random(min, max) {
	return Math.random() * (max - min) + min;//min ~ max之间的随机数
}

//点击登陆调用函数进行ajax请求
function login() {
	$(".resultLogin").css({ width: "550px", height: "350px", border: "1px solid #BFBFBF" });
	var $uname = $("#uname").val();
	var $upwd = $("#upwd").val();
	if ($uname == "" || $upwd == "") {
		$(".resultLogin>div>h2").css({ color: "red" }).html("账户和密码不能为空");
		$(".resultLogin>div>img").attr("src", "images/err.jpg");
		setTimeout(function () {
			$(".resultLogin").css({ width: "0", height: "0", border: "none" });
		}, 1000);
	} else {
		$.ajax({
			type: "POST",
			url: "./data/login.php",
			data: { uname: $uname, upwd: $upwd },
			success: function (data) {
				console.log(data);
				if (data.code == 1) {
					$(".resultLogin>div>h2").css({ color: "#01D867" }).html(data.msg);
					$(".resultLogin>div>img").attr("src", "images/ok.jpg");
					setTimeout(function () {
						$(".resultLogin").css({ width: "0", height: "0", border: "none" });
						sessionStorage.setItem("uname", $uname);
						location.href = "index.html";
					}, 1000)
				} else {
					$(".resultLogin>div>h2").css({ color: "red" }).html(data.msg);
					$(".resultLogin>div>img").attr("src", "images/err.jpg");
					setTimeout(function () {
						$(".resultLogin").css({ width: "0", height: "0", border: "none" });
					}, 1000)
				}
			},
			error: function () { }
		});
	}


}
$("#loginButton").on("click", login);
document.onkeydown = function (e) {
	if (e.keyCode == 13) {
		login();
	}
}
SET NAMES UTF8;
DROP DATABASE IF EXISTS tw;
CREATE DATABASE tw CHARSET=UTF8;
USE tw;
CREATE TABLE tw_user(
	uid TINYINT PRIMARY KEY AUTO_INCREMENT,
	uname VARCHAR(32),
	upwd  VARCHAR(32),
	uright TINYINT
);
INSERT INTO tw_user VALUES(1,"caoboshi","123456",1);
INSERT INTO tw_user VALUES(2,"duanpeng","123456",0);
INSERT INTO tw_user VALUES(3,"zhangxiang","123456",0);

#上传文件：ID 文件本身名字 自动生成名字 中文标题 中文介绍 项目所在省份 项目所在城市 项目样板图片 上传人员账户名称 上传时间 是否显示的值暂定都为1
CREATE TABLE tw_data(
	did TINYINT PRIMARY KEY AUTO_INCREMENT,
	filename VARCHAR(32),
	dname VARCHAR(32),
	title VARCHAR(32),
	intr VARCHAR(32),
	province VARCHAR(32),
	city VARCHAR(32),
	img VARCHAR(64),
	duser VARCHAR(32),
	dtime VARCHAR(32),
	dshow TINYINT

);

#留言：ID 留言用户名称 留言信息 留言时间
CREATE TABLE tw_msg(
	mid TINYINT PRIMARY KEY AUTO_INCREMENT,
	mname VARCHAR(32),
	msg VARCHAR(512),
	mtime VARCHAR(32)
);
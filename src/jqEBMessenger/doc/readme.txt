私有云部署需要更改配置的地方：
1.  js/jqEBMessengerUI.min.js文件中，修改主服务器LC地址，$.ebMsg.options.DOMAIN_URL="xxx"，例如 $.ebMsg.options.DOMAIN_URL="test-lc.entboost.com"
2.  js/onlinecall.js文件中，修改在线客服访问地址，var eb900url =xxx，例如 var eb900url="http://onlinecall.entboost.com"
	浮动窗中电话号码 "0755-27362216"修改为用户公司的电话号码
3.  用户在自己的网站页面最后增加以下代码,xxx是900号码
	 <script type="text/javascript" src="http://服务器域名或IP:端口/js/onlinecall.js?to_account=xxx" charset="UTF-8"></script>
	 
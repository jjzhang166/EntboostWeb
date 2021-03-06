#恩布互联WEBIM说明文档

恩布互联WEBIM是一款基于jquery的纯前端项目，可以轻松的与恩布互联通讯服务器进行通讯。

###拥有哪些功能
* 与通讯服务器完全分离，可以部署到任何地方
* 包含组织架构、一对一聊天、群组聊天、个人设置等IM的标准功能
* 具有在线客服功能，一句代码即可在网页中嵌入在线客服

###目录结构
* webim [根目录]
	* css
	* images
	* images2
	* js   [webim核心js文件夹]
		* jqEBMessengerUI.js[UI层js	文件]
		* jquery.jqEBMessenger.js [通讯层js文件(sdk)]
		* onlinecall.js[在线客服js文件]
	* libs [第三方库文件夹]
	* client.html [入口文件]
* server_plugin_webim [位于IM服务器，基于ajax技术，负责与前端webim通讯的组件]

###部署方式
恩布IM服务器在安装的时候会内置一个webim,访问方式为`http://xxx/webim/client.html`,xxx是恩布IM服务器的http访问地址。用户也可以独立部署，将webim文件夹部署到任何一个http服务器，请参考如下配置<br/>

* <font style='color:red;'>修改webim/client.html中的相关内容 【必改项】</font>
	* 修改主服务器LC地址，$.ebMsg.options.DOMAIN_URL="xxx";，例如 `$.ebMsg.options.DOMAIN_URL="entboost.entboost.com"`;
	
	* 修改webim地址，$.ebMsg.options.WEBIM_URL = "xxx";， 例如`$.ebMsg.options.WEBIM_URL="http://entboost.entboost.com/webim"`;
	
	* 修改默认客服号码，$.ebMsg.options.CUS_ACCOUNT = "xxx";，例如`$.ebMsg.options.CUS_ACCOUNT="9009301234"`;

* <font style='color:red;'>修改webim/js/onlinecall.js文件中的相关内容</font>
	* 修改webim地址，var webimUrl=xxx，例如 `var webimUrl="http://entboost.entboost.com/webim"`
	浮动窗中电话号码 `"400-800-1180"`修改为用户公司的电话号码
	
	* 用户在自己的网站添加如下代码(实现在线客服功能)
	`格式：<script type="text/javascript" src="http://ip或域名:port/js/onlinecall.js?to_account=9009301234"></script>`
	`例如<script type="text/javascript" src="http://entboost.entboost.com/webim/js/onlinecall.js?to_account=9009301234"></script>`	
	
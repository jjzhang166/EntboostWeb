define([
	"../libs/jquery/jquery-1.8.3.min"
	], function(jQuery) {

    (function ($, window) {
        //创建恩布互联的命名空间
        $.extend({
            jqEBMessenger: {
                options: {
                    IFRAME_DEBUG: false,    //显示iframe调试窗口
                    MAX_RETRY_TIMES: 5, //最大重试次数
                    HTTP_PREFIX: "http://", //http访问前缀
                    DOMAIN_URL: "test-lc.entboost.com", //主服务器URL
                    TIMEOUT: 8000, //访问超时时间 (毫秒)
                    MAX_RELOGON_TIMES: 20, //最大重登次数限制
                    MAX_RELOADCHAT_TIMES: 200 //最大会话重连次数限制
                }
            }
        });
        //创建一个外部使用的命名空间
        $.ebMsg = {};

        //暴露外部使用的配置文件
        $.ebMsg.options = $.jqEBMessenger.options;

        if(!$.jqEBMessenger.fn)
            $.jqEBMessenger.fn ={};

    })(jQuery, window);
});
define([
    "../libs/jquery/jquery-1.8.3.min"
    ], function(jQuery) {
    /**
     * 运行主程序
     * Created by nick on 2014/5/30.
     */
    (function (window, $) {

        var ebUI =  $.ebMsg.UI; //UI接口

        //控制连接到测试/正式环境
        $.ebMsg.options.DOMAIN_URL ="entboost.entboost.com";

       //iframe子页面日志窗口显示控制
        var IFRAME_DEBUG =$.ebfn.getQueryStringRegExp(document.location.href, 'iframe_debug');
        if(IFRAME_DEBUG && (IFRAME_DEBUG=='true' || IFRAME_DEBUG=='TRUE')) {
            $.ebMsg.options.IFRAME_DEBUG =IFRAME_DEBUG;
        }

        $(document).ready(function() {
            //注册页面关闭前的事件
            window.onbeforeunload = function () {
                return "该操作将放弃保存当前的消息内容";
            };
            //注册页面关闭后的事件
            window.onunload = function () {
                window.clear_text_area_log();
            };

            //页面加载时绑定点击事件，单击取消闪烁提示
            $(document).bind("click", function(){
                $.CancelFlashTip();
            });

            //绑定ctrl + enter事件 及 输入字符时取消闪烁事件
            $.fn.ctrlEnter = ebUI.ctrlEnter;

            //登录
            ebUI.logon();

        });

    })(window, jQuery);
});

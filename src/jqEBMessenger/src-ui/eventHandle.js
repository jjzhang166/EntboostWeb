define([
    "../libs/jquery/jquery-1.8.3.min"
], function(jQuery) {

    /**
     * api交互事件处理
     * Created by nick on 2014/6/4.
     */
    (function (window, $) {
        var jqEBM = $.jqEBMessenger;
        var ebUI = jqEBM.UI; //UI接口

        ebUI.recall_flag = false;//激活重新对话标记
        ebUI.callInfoMap = {}; //会话信息
        ebUI.accountInfoMap = {}; //用户信息
        ebUI.clientInfo = null; //当前用户信息
        ebUI.talkReadyMap = {}; //通话环境是否准备好 key=callId, value=布尔值（true=可通话，false=不可通话）

        var eventHandle = $.ebMsg.eventHandle;
        //-----------------重载事件处理-----------------------//

        //加载表情完毕事件
        eventHandle.onLoadEmotions = function (emotions) {
            ebUI.onLoadEmotions(emotions);
        };

        //接收到信息
        eventHandle.onReceiveMessage = function (callInfo, accountInfo, richInfo) {
            var htmlStr = ebUI.processRichInfo(richInfo);
//            text_area_log("htmlStr:"+htmlStr);
            $.ShowReceiveMsg(callInfo.call_id, accountInfo.fInfo.name, htmlStr);
        };

        /**
         * 服务器连接断线
         */
        eventHandle.onDisconnect = function() {
            for(var callId in ebUI.callInfoMap) {
                ebUI.addClickLink(callId,
                    "服务器断线，点击链接可再次上线。",
                    "再次上线",
                    "reloadLogon(this);"
                );
            }
        };

        //单个聊天会话结束
        eventHandle.onTalkOver = function (callId) {
            ebUI.talkReadyMap[callId] = false;

            //由于在线客服只是用于一对一通话，因此这里不提示会话结束
//            ebUI.addClickLink(callId,
//                "会话暂时结束，点击链接可再次接通。",
//                "再次对话",
//                "reloadChat(this, " + callId + ");"
//            );

            //由于在线客服只是用于一对一通话，因此当会话结束时处理为则下线
            $.ebMsg.offline(function() {
                    for(var callId in ebUI.callInfoMap) {
                        ebUI.addClickLink(callId,
                            "由于过长时间没有对话，因此当前已自动下线，点击链接可再次上线。",
                            "再次上线",
                            "reloadLogon(this);"
                        );
                    }
                },
                function (error){
                    text_area_log("offline error, code =" + error.code, + ", msg =" + error.msg);
                });
        };

        //聊天会话ID变更
        eventHandle.onChangeCallId = function (existCallId, newCallId) {
            ebUI.changeCallId(existCallId, newCallId);
        };

        //未知错误
        eventHandle.onError = function (error) {
            //alert(error.code + " : " + error.msg);
        };
        //-----------------重载事件处理-----------------------//

    })(window, jQuery);
});
define([
        "../libs/jquery/jquery-1.8.3.min",
        "global.js",
        "domainCtrl"
        ], function(jQuery) {
    /**
     * jquery EB CM相关功能函数
     * @version v1.0
     * @createDate -- 2014-2-28
     * @author nick
     * @requires jQuery v1.8 later
     **/
    (function ($, window) {
        var ifrMessenger = window.ifrMessenger;
        var jqEBM =$.jqEBMessenger;
        var EBCM =jqEBM.EBCM = {};
        var fn =jqEBM.fn;

        /**
         * 访问CM心跳动作
         * @param cm_url CM {string} http访问地址
         * @param chat_id {string} 聊天id
         */
        EBCM.ebwebcm_hb = function (cm_url, chat_id) {
            var key = jqEBM.CM_CONNECTMAP_KEY_PREFIX + fn.createRestUrl(cm_url, jqEBM.API_VERSION, "ebwebcm.hb");
            text_area_log("connectMap[" + key + "]=" + jqEBM.connectMap[key]);
            if (!jqEBM.connectMap[key] || jqEBM.connectMap[key] === 0) {//限制一个服务只有一个um长连接
                jqEBM.connectMap.increase(key);

                var parameter = {
                    chat_id: chat_id
                };
                ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.hb"]
                    , jqEBM.fn.createRestUrl(cm_url, jqEBM.API_VERSION, "ebwebcm.hb")
                    , $.toJSON(parameter)
                    , true
                    , 40000);//40秒超时
            } else {
                text_area_log(key + ",只允许一个长连接");
            }
        };

        /**
         * 发送富文本消息
         * @param call_id  {string} 会话编号
         * @param to_uid {int} 对方uid；(群组会话时)指定和某一人对话(注意这里并不表示私聊)，空值表示和全部人说话
         * @param isPrivate {boolean} 是否私聊
         * @param rich_info {string} json格式的富文本消息
         * @param successCallback {function} 发送成功回调函数
         * @param failureCallback {function} 发送失败回调函数
         * @returns {string} 执行状态
         */
        EBCM.ebwebcm_sendrich = function (callInfo, to_uid, isPrivate, rich_info, successCallback, failureCallback) {
            var parameterStr = [
                '{',
                '"chat_id":',
                callInfo.chat_id,
                ', "private":',
                isPrivate ? 1 : 0,
                ', "rich_info":',
                rich_info
            ].join("");
            if (to_uid) {
                parameterStr = parameterStr + ', "to_uid":' + to_uid;
            }

            parameterStr = parameterStr + "}";

            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.sendrich"]
                , jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.sendrich")
                , parameterStr
                , false
                , null
                , function(state, param) {
                    if(state==jqEBM.errCodeMap.OK) {
                       if(successCallback) successCallback();
                    } else {
                       if(failureCallback) failureCallback(state);
                    }
                });
        };

        /**
         * 进入聊天会话
         * @param call_id {string} 会话编号
         */
        EBCM.ebwebcm_enter = function (call_id) {
            //		text_area_log('ebwebcm_enter call_id='+call_id);
            if (!call_id) {
                text_area_log("ebwebcm_enter call_id is null");
                return;
            }

            //通过call_id在本地查找call_info信息
            var callInfo = jqEBM.chatMap[call_id];
            if (!callInfo) {
                text_area_log("ebwebcm_enter not found callInfo for call_id=" + call_id);
                return;
            }
            text_area_log('ebwebcm_enter==>callInfo:\n' + $.toJSON(callInfo));

            //填充参数值
            var parameter = {
                logon_type: jqEBM.clientInfo.logon_type,
                from_uid: jqEBM.clientInfo.my_uid,
//			account: jqEBM.clientInfo.my_account,
                chat_id: callInfo.chat_id,
                chat_key: callInfo.chat_key,
                call_id: callInfo.call_id,
                appname: callInfo.cm_appname
            };

            if (callInfo.group_code == "0") {//非群组/非对方会话才填入离线用户参数
                var account = callInfo.firstAccount();
                if (account.offline) {
                    parameter.off_uid = account.uid;
                }
            }

            if (callInfo.group_code) {
                parameter.group_code = callInfo.group_code;
            }

            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.enter"],
                jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.enter"),
                $.toJSON(parameter));
        };

        /**
         * 结束会话
         * @param call_id {int} 会话编号
         */
        EBCM.ebwebcm_exit = function (call_id) {
            if (!call_id) {
                text_area_log("ebwebcm_exit call_id is 0");
                return;
            }

            var callInfo = jqEBM.chatMap[call_id];

            if (!callInfo) {
                text_area_log('ebwebcm_exit, callInfo not found, call_id=' + call_id);
                return;
            }

            if (!callInfo.chat_id) {
                text_area_log('ebwebcm_exit, chat_id is 0, call_id=' + call_id);
                return;
            }

            var parameter = {
                chat_id: callInfo.chat_id
            };
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.exit"],
                jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.exit"),
                $.toJSON(parameter));
        };

        /**
         * 申请上传文件
         * @param chat_id
         * @param failureCallback
            */
        EBCM.ebwebcm_sendfile_apply = function (chat_id, failureCallback) {
            if (!chat_id) {
                text_area_log("ebwebcm_sendfile_apply chat_id is 0");
                return;
            }

            var callInfo = jqEBM.chatMap.callInfoByChatId(chat_id);

            if (!callInfo) {
                text_area_log('ebwebcm_sendfile_apply, callInfo not found, chat_id=' + chat_id);
                return;
            }

            var parameter = {
                chat_id: chat_id,
                apply: 1
            };
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.sendfile"],
                jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.sendfile"),
                $.toJSON(parameter),
                true,
                null,
                failureCallback);
        };


    })(jQuery, window);
});
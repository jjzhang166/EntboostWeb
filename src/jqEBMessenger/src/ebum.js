define([
    "../libs/jquery/jquery-1.8.3.min",
    "global.js",
    "domainCtrl"
], function(jQuery) {
    /**
     * jquery EB UM相关功能函数
     * @version v1.0
     * @createDate -- 2014-2-28
     * @author nick
     * @requires jQuery v1.8 later
     **/
    (function ($, window) {
        var ifrMessenger = window.ifrMessenger;
        var jqEBM =$.jqEBMessenger;
        var EBUM =jqEBM.EBUM = {};

        /**
         * 访问UM心跳动作
         *
         */
        EBUM.ebwebum_hb = function () {
            var key = jqEBM.UM_CONNECTMAP_KEY_PREFIX;
            text_area_log("connectMap[" + key + "]=" + jqEBM.connectMap[key]);
            if (!jqEBM.connectMap[key] || jqEBM.connectMap[key] === 0) {//限制全局只有一个um长连接
                jqEBM.connectMap.increase(key);
                var parameter = {
                    uid: jqEBM.clientInfo.my_uid
                };
                ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.hb"],
                    jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.hb"),
                    $.toJSON(parameter),
                    true,
                    40000);//40秒超时
            } else {
                text_area_log(key + "只允许一个长连接");
            }
        };

        /**
         * 加载通讯录
         * @param callback (function) 回调函数
         */
        EBUM.ebwebum_loadcontact = function (callback) {
            var parameter = {
                uid: jqEBM.clientInfo.my_uid
            };
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.loadcontact"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.loadcontact"),
                $.toJSON(parameter),
                true,
                null,
                callback);
        };

        /**
         * 加载离线信息
         * @param callback (function) 回调函数
         */
        EBUM.ebwebum_loadinfo = function (callback) {
            var parameter = {
                uid: jqEBM.clientInfo.my_uid
            };

            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.loadinfo"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.loadinfo"),
                $.toJSON(parameter),
                true,
                40000, //40秒超时
                callback);
        };

        /**
         * 加载企业架构
         * @param callback (function) 回调函数
         */
        EBUM.ebwebum_loadorg = function (callback) {
            var parameter = {
                uid: jqEBM.clientInfo.my_uid
            };

            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.loadorg"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.loadorg"),
                $.toJSON(parameter),
                true,
                40000, //40秒超时
                callback);
        };

        /**
         * 呼叫对方
         * @param to_account {string} 对方账号
         * @param exist_call_id {string} 已存在的会话编号，用于群组会话
         * @param call_key {string} 呼叫来源KEY，实现企业被呼叫限制
         * @param callback 回调函数
         */
        EBUM.ebwebum_callaccount = function (to_account, exist_call_id, call_key, callback) {
            var parameter = {
                uid: jqEBM.clientInfo.my_uid,
                to_account: to_account
            };
            if (exist_call_id) {
                parameter.exist_call_id = exist_call_id;
            }

            if(call_key) {
                parameter.call_key = call_key;
            }

            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.callaccount"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.callaccount"),
                $.toJSON(parameter),
                true,
                null,
                callback);
        };

        /**
         * 登记下线
         * @param callback {function} 回调函数
         */
        EBUM.ebwebum_offline = function (callback) {
            var parameter = {
                uid: jqEBM.clientInfo.my_uid
            };
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.offline"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.offline"),
                $.toJSON(parameter),
                true,
                null,
                callback);
        };

        /**
         * 登记在线
         * @param line_state {int} 在线状态
         * @param callback {function} 回调函数
         */
        EBUM.ebwebum_online = function (line_state, callback) {
            var parameter = {
                uid: jqEBM.clientInfo.my_uid,
                logon_type: jqEBM.clientInfo.logon_type,
                //account: jqEBM.clientInfo.my_account,
                online_key: jqEBM.clientInfo.my_um_online_key,
                line_state: line_state,
                appname: jqEBM.clientInfo.um_appname
            };
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.online"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.online"),
                $.toJSON(parameter),
                true,
                null,
                callback);
        };

        /**
         * UM退出/挂断会话
         * @param call_id {int}
         * @param hangup {boolean}
         */
        EBUM.ebwebum_hangup = function (call_id, hangup) {
            var parameter = {
                uid: jqEBM.clientInfo.my_uid,
                call_id: call_id,
                hangup: (hangup ? 1 : 0)
            };
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.hangup"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.hangup"),
                $.toJSON(parameter));
        };

    })(jQuery, window);
});
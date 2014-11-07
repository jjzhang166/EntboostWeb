define([
    "../libs/jquery/jquery-1.8.3.min",
    "global.js",
    "domainCtrl"
], function(jQuery) {
    /**
     * jquery EB LC相关功能函数
     * @version v1.0
     * @createDate -- 2014-2-28
     * @author nick
     * @requires jQuery v1.8 later
     **/
    (function ($, window) {
        var ifrMessenger = window.ifrMessenger;
        var jqEBM =$.jqEBMessenger;
        var EBLC =jqEBM.EBLC = {};

        /**
         * 普通用户登录
         * @param account {string} 用户账号
         * @param password {string} 用户密码
         * @param successCallback {function} 发送成功回调函数
         * @param failureCallback {function} 发送失败回调函数
         */
        EBLC.ebweblc_logonaccount = function(account, password, successCallback, failureCallback) {
            var parameter ={
                account: account
            };
            if(password) {
                parameter.pwd =password;
            }
            if(jqEBM.clientInfo.acm_key && jqEBM.clientInfo.acm_key.length>0) {
                parameter.acm_key =jqEBM.clientInfo.acm_key;
            }
            if(jqEBM.clientInfo.my_uid) {
                parameter.uid =jqEBM.clientInfo.my_uid;
            }

            ifrMessenger.sendMessage(jqEBM.apiMap["ebweblc.logonaccount"],
                jqEBM.fn.createRestUrl(jqEBM.options.HTTP_PREFIX + jqEBM.options.DOMAIN_URL, jqEBM.API_VERSION, "ebweblc.logonaccount"),
                $.toJSON(parameter),
                true,
                null,
                function(state, param) {
                    if(state == jqEBM.errCodeMap.OK) {
                        if (successCallback) successCallback(param);
                    } else {
                        if (failureCallback) failureCallback(state);
                    }
                });
        };

        /**
         * 匿名用户登录
         * @param successCallback {function} 发送成功回调函数
         * @param failureCallback {function} 发送失败回调函数
         */
        EBLC.ebweblc_logonvisitor = function(successCallback, failureCallback) {
            var parameter ={};

            if(jqEBM.clientInfo.my_uid && jqEBM.clientInfo.my_uid.length>0) {
                parameter.uid =jqEBM.clientInfo.my_uid;
            }
            if(jqEBM.clientInfo.acm_key && jqEBM.clientInfo.acm_key.length>0) {
                parameter.acm_key =jqEBM.clientInfo.acm_key;
            }


            ifrMessenger.sendMessage(jqEBM.apiMap["ebweblc.logonvisitor"],
                jqEBM.fn.createRestUrl(jqEBM.options.HTTP_PREFIX + jqEBM.options.DOMAIN_URL, jqEBM.API_VERSION, "ebweblc.logonvisitor"),
                $.toJSON(parameter),
                true,
                null,
                function(state, param) {
                    if(state == jqEBM.errCodeMap.OK) {
                        if (successCallback) successCallback(param);
                    } else {
                        if (failureCallback) failureCallback(state);
                    }
                });
        };

    })(jQuery, window);
});
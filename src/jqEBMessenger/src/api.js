/**
 * Created by nick on 2014/5/27.
 */
define([
    "../libs/jquery/jquery-1.8.3.min"
], function($) {
    /**
     * api函数
     */
   (function($, window) {
       var jqEBM = $.jqEBMessenger;
       if (!jqEBM.api)
           jqEBM.api ={};

       var api = jqEBM.api;
       var options = jqEBM.options;
       var fn = jqEBM.fn;
       var clientInfo = jqEBM.clientInfo;

       /**
        * 以游客身份登录验证
        * @param successCallback(clientInfo) {function} 发送成功回调函数
        * @param failureCallback(error) {function} 发送失败回调函数
        */
       api.logonVisitor = function (successCallback, failureCallback) {
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           var url =options.HTTP_PREFIX + options.DOMAIN_URL + "/iframe_domain.html?fr_name="
               + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION;
           fn.load_iframe(url,
               try_times,
               //用户登录
               function () {
                   jqEBM.EBLC.ebweblc_logonvisitor(successCallback, failureCallback);
               });
       };

       /**
        * 普通用户身份登录验证
        * @param account
        * @param password
        * @param successCallback(clientInfo) {function} 发送成功回调函数
        * @param failureCallback(error) {function} 发送失败回调函数
        */
       api.logonAccount = function (account, password, successCallback, failureCallback) {
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           fn.load_iframe(options.HTTP_PREFIX + options.DOMAIN_URL + "/iframe_domain.html?fr_name="
                   + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION,
               try_times,
               //用户登录
               function () {
                   jqEBM.EBLC.ebweblc_logonaccount(account, password, successCallback, failureCallback);
               });
       };

       /**
        * 登出下线
        * @param successCallback() {function} 发送成功回调函数
        * @param failureCallback(error) {function} 发送失败回调函数
        */
       api.offline = function (successCallback, failureCallback) {
           jqEBM.EBUM.ebwebum_offline(function(state, param) {
               if(state == jqEBM.errCodeMap.OK) {
                   if (successCallback) successCallback();
               } else {
                   if (failureCallback) failureCallback(state);
               }
           });
       };

       /**
        * 呼叫对方
        * @param toAccount 对方用户账号
        * @param existCallId 已存在的会话编号
        * @param callKey 呼叫来源KEY，实现企业被呼叫限制
        * @param successCallback(callInfo, accountInfo) 发送成功回调函数
        * @param failureCallback(error) 失败回调函数
        */
       api.callAccount = function (toAccount, existCallId, callKey, successCallback, failureCallback) {
           jqEBM.EBUM.ebwebum_callaccount(toAccount, existCallId, callKey, function(state, param) {
               if (state == jqEBM.errCodeMap.OK) {
                   if (successCallback) successCallback(param.callInfo, param.accountInfo);
               } else {
                   if (failureCallback) failureCallback(state);
               }
           });
       };

       /**
        * 发生富文本信息
        * @param callId {int} 会话编号
        * @param content {String} 富文本内容
        * @param successCallback {function} 发送成功回调函数
        * @param failureCallback {function} 发送失败回调函数
        */
       api.sendMessage = function (callId, content, successCallback, failureCallback) {
           //处理特殊字符
           var htmlData = content.replace(new RegExp("<br>", "gm"), "\n");
           htmlData = htmlData.replace(new RegExp("&nbsp;", "gm"), " ");
           //htmlData = $.trim(htmlData);

           //检查内容长度
           if ($.ebfn.stringByteLength(htmlData) > 2048) {
               text_area_log("length:" + $.ebfn.stringByteLength(htmlData) + "\n" + htmlData);
               failureCallback(jqEBM.errCodeMap.CONTENT_TOO_LONG);
               return;
           }

           var trimHtmlData = $.ebfn.replaceDivTag(htmlData, "\n");
           text_area_log("trimHtmlData=\n" + trimHtmlData);
           var ary = $.ebfn.html2ArraySplitByImgTag(trimHtmlData);
           text_area_log("ary=\n" + $.toJSON(ary));
           var jsonRichInfo = $.ebfn.richArray2Json(ary, jqEBM.APPNAME_CM);

           jqEBM.sendRich(callId, jsonRichInfo, successCallback, failureCallback);
       };

       /**
        * 上传文件
        * @param fileElementId 浏览文件的file控件id
        * @param chatId 聊天编号
        * @param sendingCallback 反馈服务器离线保存文件情况的回调函数
        * @param sentCallback 反馈对方接收文件情况的回调函数
        */
       api.sendfile = function(fileElementId, chatId, sendingCallback, sentCallback) {
           var batch_number = Math.floor(Math.random() * 10000000);
           var fileName =$("#"+fileElementId).val();
           text_area_log("fileName = " + fileName);
           var batchObj = {
               fileName: fileName,
               sendingCallback: sendingCallback,
               sentCallback: sentCallback
           };
           jqEBM.uploadAttachmentMap[batch_number] = batchObj;

           jqEBM.EBCM.ebwebcm_sendfile_apply(chatId, function(error) {
               sendingCallback(error);
               delete jqEBM.uploadAttachmentMap[batch_number];
           });

           //jqEBM.uploadAttachmentMap[batch_number] = fileName;

           var callInfo =jqEBM.chatMap.callInfoByChatId(chatId);

           jqEBM.ajaxFileUpload(batch_number,
               jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.sendfile"),
               false, fileElementId, chatId, null, null);

           return batch_number;
       };


       //导出外部调用的api
       $.extend($.ebMsg, jqEBM.api);

   })(jQuery, window);
});
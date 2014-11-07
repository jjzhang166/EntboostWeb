define([
    "../libs/jquery/jquery-1.8.3.min",
    "eblc",
    "ebum",
    "ebcm"
], function(jQuery) {
    (function($, window) {
        var jqEBM =$.jqEBMessenger;
        if(!jqEBM.prc)
            jqEBM.prc ={};
        var processor = jqEBM.prc;

        /**
         * 用户在另一客户端登录
         * @param req
         * @param jsonData
         */
        processor.processOnlineAnother = function (req, jsonData) {
            text_area_log('processOnlineAnother，用户在另一客户端登录');
            ///后续处理，清理会话、退出到登录界面等
            jqEBM.clientInfo.tickoff =true;

            if(jqEBM.msgcodeMap['EB_WM_ONLINE_ANOTHER_CM'] == jsonData.msg) {//EB_WM_ONLINE_ANOTHER_CM
                var pv =$.evalJSON(req.pv);
                var callInfo =jqEBM.chatMap.callInfoByChatId(pv.chat_id);
                jqEBM.EBCM.ebwebcm_exit(callInfo.call_id);
            } else if(jqEBM.msgcodeMap['EB_WM_ONLINE_ANOTHER_UM'] == jsonData.msg) {//EB_WM_ONLINE_ANOTHER_UM
                jqEBM.clientInfo.line_state =0;

                var list =jqEBM.chatMap.names();
                if(list)
                    for(var i=0;i <list.length; i++) {
                        var call_info =jqEBM.chatMap[list[i]];
                        if(call_info)
                            jqEBM.EBCM.ebwebcm_exit(call_info.call_id);
                    }
            }

        };

        /**
         * 处理会话连接成功事件
         * @param req
         * @param data
         */
        processor.processCallConnected = function (req, data) {
            //处理旧会话信息
            jqEBM.changeCallId(req, data);

            //新返回的call_info数据
            var callConnect_info =data.call_info;

            //创建或更新会话信息
            var call_info =jqEBM.mergeCallInfo(callConnect_info.call_id,
                    callConnect_info.group_code,
                    callConnect_info.from_uid,
                    callConnect_info.from_account,
                    callConnect_info.from_info,
                    jqEBM.options.HTTP_PREFIX + callConnect_info.url,
                    callConnect_info.appname,
                    callConnect_info.chat_id,
                    callConnect_info.chat_key,
                    callConnect_info.offline_user=='0'?'false':'true',
                    null);

            text_area_log('processCallConnected===' + call_info.cm_url);

            var try_times =0;//必须定义变量
            jqEBM.fn.load_iframe(call_info.cm_url+'/iframe_domain.html?fr_name=' + jqEBM.fn.domainURI(call_info.cm_url) + (jqEBM.options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION,
                try_times,
                function(){
                    jqEBM.EBCM.ebwebcm_enter(call_info.call_id);
                });
        };

        /**
         * 处理对方应答拒绝事件
         * @param req
         * @param data
         */
        processor.processCallReject = function (req, data) {
            //处理旧会话信息
            jqEBM.changeCallId(req, data);

            //新返回的call_info数据
            var new_call_info =data.call_info;

            var pv =$.evalJSON(req.pv);

            //创建或更新会话信息
            jqEBM.mergeCallInfo(new_call_info.call_id, new_call_info.group_code, new_call_info.from_uid, new_call_info.from_account, new_call_info.from_info, null, null, null, null, null, pv.call_key);

            jqEBM.updateAccountIncall(new_call_info.call_id, new_call_info.from_uid, false);
        };

        /**
         * 处理对方应答超时事件
         * @param req
         * @param data
         */
        processor.processCallTimeout = function (req, data) {
            //处理旧会话信息
            jqEBM.changeCallId(req, data);

            //新返回的call_info数据
            var new_call_info =data.call_info;

            var pv =$.evalJSON(req.pv);

            //创建或更新会话信息
            jqEBM.mergeCallInfo(new_call_info.call_id, new_call_info.group_code, new_call_info.from_uid, new_call_info.from_account, new_call_info.from_info, null, null, null, null, null, pv.call_key);

            jqEBM.updateAccountIncall(new_call_info.call_id, new_call_info.from_uid, false);

//            showSurface(new_call_info.call_id
//                    ,new_call_info.from_uid
//                    ,new_call_info.from_account
//                    ,"未知"
//                    ,"对方不在位置");
        };

        /**
         * 处理振铃事件
         * @param req
         * @param data
         */
        processor.processCallAlerting = function (req, data) {
            //处理旧会话信息
            jqEBM.changeCallId(req, data);

            //新返回的call_info数据
            var new_call_info =data.call_info;

            var pv =$.evalJSON(req.pv);

            //创建或更新会话信息
            jqEBM.mergeCallInfo(new_call_info.call_id, new_call_info.group_code, new_call_info.from_uid, new_call_info.from_account, new_call_info.from_info, null, null, null, null, null, pv.call_key);

        };

        /**
         * 处理对方加入会话事件
         * @param req
         * @param data
         */
        processor.processUserCMEnter = function (req, data) {
            var pv =$.evalJSON(req.pv);
            var call_info =jqEBM.chatMap.callInfoByChatId(pv.chat_id);

            jqEBM.updateAccountIncall(call_info.call_id, data.from_uid, true);

//            if(jqEBM.eventHandle) {
//                jqEBM.eventHandle.onTalkReady(call_info, jqEBM.accountInfoMap[data.from_uid]);
//            }
        };

        /**
         * 处理自己离开会话事件
         * @param call_id
         */
        processor.processMyCMExit = function (call_id ) {
            if(jqEBM.eventHandle) {
                jqEBM.eventHandle.onTalkOver(call_id);
            }
        };

        /**
         * 处理对方离开会话事件
         * @param req
         * @param jsonData
         */
        processor.processUserCMExit = function (req ,data) {
            var pv =$.evalJSON(req.pv);
            var call_info = jqEBM.chatMap.callInfoByChatId(pv.chat_id);
            jqEBM.updateAccountIncall(call_info.call_id, data.from_uid, false);
        };

        //loadorg
        processor.processLoadorg = function (orgData) {
            //var objData =$.parseJSON(jsonData);
            //alert($.toJSON(jsonData));

            //表情信息
            var emotions =orgData.emotions;
            //排序
            if(emotions) {
                emotions.sort(function (a, b) {
                    return a.index - b.index;
                });

                var retEmotions =[];
                for (var i = 0; i < emotions.length; i++) {
                    var emotion = emotions[i];
                    if (emotion.res_type == "6") {
                        var newEmotion = $.ebfn.clone(emotion);
                        //http://cm-static1.entboost.com/servlet.ebwebcm.res?resid=5289BBAF3C8D0037
                        //"info": "5289BBAF3C8D0037;cm-static1.entboost.com:18012;POPChatManager"
                        newEmotion.url = [
                            "http://",
                            emotion.server.split(":")[0],
                            "/servlet.ebwebcm.res?resid=",
                            emotion.resid
                        ].join("");
                        retEmotions.push(newEmotion);
                    }
                }

                if(jqEBM.eventHandle)
                    jqEBM.eventHandle.onLoadEmotions(retEmotions);
            }

            //待定
            //fire组织架构加载完成事件
            //ebUI.onLoadOrgEvent

        };

        /**
         * 处理加载离线信息事件
         * @param req
         * @param jsonData
         */
        processor.processLoadinfo = function (req, jsonData) {
            //待定
        };

        /**
         * 处理服务器离线保存文件情况事件
         * @param req
         * @param data
         */
        processor.processSendingFile = function (req, data) {
            var pv =$.evalJSON(req.pv);
            var call_info =jqEBM.chatMap.callInfoByChatId(pv.chat_id);

            var batchObj =jqEBM.uploadAttachmentMap[data.batch_number];

            //防止多次处理
            if(batchObj == null) {
                text_area_log("processSendingFile batch_number=" + data.batch_number + " 不存在, 忽略处理");
                return;
            }
            delete jqEBM.uploadAttachmentMap[data.batch_number];

            //fire 文件上传失败事件
            if(jqEBM.statecodeMap["EB_STATE_PARAMETER_ERROR"] == data.code && data.error == "upload file empty error") {
//                if(jqEBM.eventHandle)
//                    jqEBM.eventHandle.onSendingFile(jqEBM.errCodeMap.UPLOAD_FILE_EMPTY, call_info.call_id, fileName, null, null);
                if(batchObj.sendingCallback)
                    batchObj.sendingCallback(jqEBM.errCodeMap.UPLOAD_FILE_EMPTY, call_info.call_id, batchObj.fileName);
                return;
            }

            //fire 文件大小超过最大限制
            if(data.code == jqEBM.statecodeMap["EB_STATE_FILE_BIG_LONG"]) {
//                if(jqEBM.eventHandle)
//                    jqEBM.eventHandle.onSendingFile(jqEBM.errCodeMap.CONTENT_TOO_LONG, call_info.call_id, fileName, null, null);
                if(batchObj.sendingCallback)
                    batchObj.sendingCallback(jqEBM.errCodeMap.CONTENT_TOO_LONG , call_info.call_id, batchObj.fileName);
                return;
            }

            //fire 文件上传成功事件
            if(data.code==jqEBM.statecodeMap["EB_STATE_OK"] || data.code == jqEBM.statecodeMap["EB_STATE_FILE_ALREADY_EXIST"]) {
                var url = ((call_info.cm_url.indexOf("http")===0)?"":"http://") + call_info.cm_url + "/servlet.ebwebcm.res?file=" + data.file;
//                if(jqEBM.eventHandle)
//                    jqEBM.eventHandle.onSendingFile(jqEBM.errCodeMap.OK, call_info.call_id, fileName, data.mime_type, url);
                if(batchObj.sendingCallback)
                    batchObj.sendingCallback(jqEBM.errCodeMap.OK, call_info.call_id, batchObj.fileName, data.mime_type, url);
            }

            //保存回调对象给sentFile事件继续使用
            jqEBM.uploadAttachmentMap[data.msg_id] = batchObj;
        };

        /**
         * 处理对方接收文件情况事件
         * @param req
         * @param data
         */
        processor.processSentFile = function (req, data) {
            //自己的事件忽略处理
            if(data.from_uid == jqEBM.clientInfo.my_uid)
                return;

            //忽略无用事件
            if(data.from_uid == "0")
                return;

            //fire 对方接收文件成功事件
            var pv =$.evalJSON(req.pv);
            var call_info =jqEBM.chatMap.callInfoByChatId(pv.chat_id);

            var batchObj = jqEBM.uploadAttachmentMap[data.msg_id];

//            if(jqEBM.eventHandle)
//                jqEBM.eventHandle.onSentFile(jqEBM.errCodeMap.OK, call_info.call_id, fileName);
            if(batchObj && batchObj.sentCallback)
                batchObj.sentCallback(jqEBM.errCodeMap.OK, call_info.call_id, batchObj.fileName);

            delete jqEBM.uploadAttachmentMap[data.msg_id];
        };

        /**
         * 处理对方拒绝或取消接收文件事件
         * @param req
         * @param data
         */
            processor.processCancelReceiveFile = function (req, data) {
            var pv =$.evalJSON(req.pv);
            var call_info =jqEBM.chatMap.callInfoByChatId(pv.chat_id);

            var batchObj =jqEBM.uploadAttachmentMap[data.msg_id];

//            var spls =fileName.split("\\");
//            fileName =spls[spls.length-1];

//            if(jqEBM.eventHandle)
//                jqEBM.eventHandle.onSentFile(jqEBM.errCodeMap.UPLOAD_FILE_REJECT, call_info.call_id, fileName);
            if(batchObj && batchObj.sentCallback) {
                batchObj.sentCallback(jqEBM.errCodeMap.UPLOAD_FILE_REJECT, call_info.call_id, batchObj.fileName);
            }

            delete jqEBM.uploadAttachmentMap[data.msg_id];
        };

    })(jQuery, window);
});
define(["../libs/jquery/jquery-1.8.3.min"], function(jQuery) {
    (function ($, window) {
        var jqEBM = $.jqEBMessenger;

        /**
         * 更新本地callInfo信息
         * @param call_id {string} 会话编号
         * @param group_code {int} 群组/部门编号
         * @param uid {string} 用户ID
         * @param from_account {string} 群组/部门中成员邮箱账号
         * @param from_info {string} 电子名片
         * @param cm_url {string} CM服务http地址
         * @param cm_appname {string} CM应用名
         * @param chat_id {string} 聊天编号
         * @param chat_key 聊天密钥
         * @param offlineString 成员是否离线(与from_acount一起使用)
         * @param call_key 呼叫来源KEY实现企业被呼叫限制
         */
        jqEBM.mergeCallInfo = function (call_id, group_code, uid, from_account, from_info, cm_url, cm_appname, chat_id, chat_key, offlineString, call_key) {
            if (!call_id) {
                text_area_log("mergeCallInfo call_id is null");
                return null;
            }

            var callInfo = jqEBM.chatMap[call_id];

            if (!callInfo) {//call_info不存在，创建一个新的
                callInfo = jqEBM.createCallInfo();
                callInfo.call_id = call_id;
                jqEBM.chatMap[call_id] = callInfo;
                text_area_log("mergeCallInfo create new callInfo for call_id:" + call_id);
            }

            if (group_code)
                callInfo.group_code = group_code;

            if (uid) {
                var account = callInfo.accounts[uid];
                if (!account) {
                    account = {};
                    account.uid = uid;
                    account.offline = true;
                    account.incall = false;
                    callInfo.accounts[uid] = account;
                }
                if (offlineString) {//更新本地用户在线/离线状态
                    if (offlineString == 'true' || offlineString == 'TRUE')
                        account.offline = true;
                    else
                        account.offline = false;
                }

                text_area_log("account_uid=" + account.uid + ", offline=" + account.offline);
                account = null;
            }

            //更新全局accountInfo对照表
            if (uid) {
                var accountInfo = jqEBM.accountInfoMap[uid];
                if (!accountInfo) {//不存在则新建
                    accountInfo = jqEBM.createAccountInfo(uid);
                    jqEBM.accountInfoMap[uid] = accountInfo;
                }

                //帐号(邮箱)
                if (from_account && from_account.length > 0) {
                    accountInfo.from_account = from_account;
                }

                //电子名片
                if (from_info && from_info.length > 0) {
//			text_area_log(from_info);
                    var arry = from_info.split(";");
                    for (var i = 0; i < arry.length; i++) {
                        var entity = arry[i];
                        if (entity.length === 0) continue;

                        var key = entity.split("=")[0];
                        var value = entity.split("=")[1];
//				text_area_log("key="+key+", value="+value);

                        switch (key) {
                            case "t"://类型
                                accountInfo.fInfo.type = parseInt(value, 10);
                                break;
                            case "ec"://群成员编码
                                accountInfo.fInfo.empCode = value;
                                break;
                            case "na"://名称
                                accountInfo.fInfo.name = value;
                                break;
                            case "ph"://手机
                                accountInfo.fInfo.mobile = value;
                                break;
                            case "tel"://固话号码
                                accountInfo.fInfo.telphone = value;
                                break;
                            case "em"://电子邮件
                                accountInfo.fInfo.email = value;
                                break;
                            case "ti"://职务
                                accountInfo.fInfo.title = value;
                                break;
                            case "de"://群/部门名称
                                accountInfo.fInfo.departmentName = value;
                                break;
                            case "en"://公司名称
                                accountInfo.fInfo.entpriseName = value;
                                break;
                        }
                    }
                    text_area_log($.toJSON(accountInfo.fInfo));

                }
            }

            if (cm_url)
                callInfo.cm_url = cm_url;

            if (cm_appname)
                callInfo.cm_appname = cm_appname;

            if (chat_id)
                callInfo.chat_id = chat_id;

            if (chat_key)
                callInfo.chat_key = chat_key;

            if(call_key)
                callInfo.call_key = call_key;

            return callInfo;
        };

        /**
         * 更新account是否在会话(本地缓存)
         * @param call_id {int} 会话编号
         * @param uid {int} 用户唯一数字编号
         * @param incall {boolean} 是否在会话
         */
        jqEBM.updateAccountIncall = function (call_id, uid, incall) {
            if (!call_id || !uid) {
                text_area_log("updateAccountIncall call_id or uid is null");
                return null;
            }

            var callInfo = jqEBM.chatMap[call_id];
            if (!callInfo) {
                text_area_log("updateAccountIncall not found call_info for call_id=" + call_id);
                return null;
            }

            var account = callInfo.accounts[uid];
            if (!account) {
                text_area_log("updateAccountIncall not found account for call_id=" + call_id + ", uid=" + uid);
                return null;
            }

            account.incall = incall;

            text_area_log('updateAccountIncall call_id=' + call_id + ", uid=" + uid + ', update incall=' + incall);
            text_area_log("updateAccountIncall chatMap:\n" + $.toJSON(jqEBM.chatMap));

            return callInfo;
        };

        /**
         * 更新account是否正在被呼叫(callaccount)
         * @param call_id {int} 会话编号
         * @param uid {int} 用户唯一数字编号
         * @param becalling {boolean} 是否正在被呼叫
         */
        jqEBM.updateAccountBecalling = function (call_id, uid, becalling) {
            if (!call_id || !uid) {
                text_area_log("updateAccountBecalling call_id or uid is null");
                return null;
            }

            var callInfo = jqEBM.chatMap[call_id];
            if (!callInfo) {
                text_area_log("updateAccountBecalling not found call_info for call_id=" + call_id);
                return null;
            }

            var account = callInfo.accounts[uid];
            if (!account) {
                text_area_log("updateAccountBecalling not found account for call_id=" + call_id + ", uid=" + uid);
                return null;
            }

            account.becalling = becalling;

            text_area_log('updateAccountBecalling call_id=' + call_id + ", uid=" + uid + ', update becalling=' + becalling);
            text_area_log("updateAccountBecalling chatMap:\n" + $.toJSON(jqEBM.chatMap));

            return callInfo;
        };

        /**
         * 变更会话编号处理，处理旧会话信息
         * @param req
         * @param data
         * @returns
         */
        jqEBM.changeCallId = function (req, data) {
            //新返回的call_info数据
            var new_call_info =data.call_info;
            var pv =$.evalJSON(req.pv);

            var new_call_id =new_call_info.call_id;

            var exist_call_id =null;
            if(jqEBM.msgcodeMap['EB_WM_CALL_CONNECTED'] == data.msg) {//call_connected
                text_area_log("changeCallId call_connected group_code="+new_call_info.group_code+", oc_id="+new_call_info.oc_id+", new_call_id="+new_call_info.call_id);

                if(new_call_info.oc_id != "0" && new_call_info.oc_id != new_call_id) {
                    exist_call_id =new_call_info.oc_id;
                }
            } else {//call_alerting
                text_area_log("changeCallId call_alert group_code=" + new_call_info.group_code + ", exist_call_id="+pv.exist_call_id+", new_call_id="+new_call_info.call_id);

                exist_call_id =pv.exist_call_id;
            }

            text_area_log("changeCallId last status:, exist_call_id="+exist_call_id+", new_call_id="+new_call_id);

            //一对一会话call_id变更
            if(exist_call_id && exist_call_id.length>0//原来已有call_id，二次以上call
                && exist_call_id!=new_call_id//原有call_id与返回的call_id不相同
                && new_call_info.group_code == "0"//非群组会话
                ) {
                text_area_log("call_id变更，exist_call_id="+exist_call_id+", new_call_id="+ new_call_id);

                //删除旧会话信息
                delete jqEBM.chatMap[exist_call_id];
                text_area_log("删除call_info, call_id=" + exist_call_id);

                if(jqEBM.eventHandle) {
                    jqEBM.eventHandle.onChangeCallId (exist_call_id, new_call_id);
                }
            }

            jqEBM.uidCallidMap[new_call_info.from_uid] = new_call_id;
            text_area_log("uidCallidMap==\n" + $.toJSON(jqEBM.uidCallidMap));
        };

        /**
         * 上线
         * @param callback {function} 回调函数
         */
        jqEBM.online = function (callback) {
            var try_times = 0;
            jqEBM.fn.load_iframe(jqEBM.clientInfo.um_url + '/iframe_domain.html?fr_name=' + jqEBM.fn.domainURI(jqEBM.clientInfo.um_url) + (jqEBM.options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION,
                try_times,
                function () {
                    jqEBM.EBUM.ebwebum_online(1, callback);
                });
        };

        /**
         * 处理接收到的富文本信息
         * @param richInfo {Array} 富文本信息内容
         * @returns {Array} 富文本结构数组
         */
        jqEBM.processRichInfo = function (richInfo) {
            var richInfoArray =[];
            var src ="";
            var entity = null;

            for(var i=0;i <richInfo.length;i++) {
                if(richInfo[i].text) {//文本
                    //htmlContent.push(richInfo[i].text.replace(/\n|\r|\r\n/gm, "<br>"));
//                    text_area_log("richInfo[i].text:"+richInfo[i].text);
                    entity = {
                        type: "text",
                        content: richInfo[i].text
                    };
                }  else if(richInfo[i].img) {//截图
                    src = ((richInfo[i].cm_server.indexOf("http")===0)?"":"http://") + richInfo[i].cm_server + "/servlet.ebwebcm.res?file=" + richInfo[i].img;
                    entity = {
                        type: "screenshot",
                        content: src
                    };
                }
                else if(richInfo[i].resid) {//表情
                    src = [
                        "http://",
                        richInfo[i].cm_server,
                        "/servlet.ebwebcm.res?resid=",
                        richInfo[i].resid
                    ].join("");
                    entity = {
                        type: "emotion",
                        content: src
                    };
                }
                richInfoArray.push(entity);
            }
            return richInfoArray;
        };

        /**
         * 发送消息(图文混排)
         * @param call_id {string} 会话编号
         * @param jsonRichInfo {string} json格式的富文本消息
         * @returns 执行状态
         */
         jqEBM.sendRich = function (call_id, jsonRichInfo, successCallback, failureBack) {
            var errCodeMap = $.jqEBMessenger.errCodeMap;

            if (!call_id || call_id.length === 0) {
                text_area_log("sendRich call_id is null");
                failureBack(errCodeMap.CALLID_INVALID);
                return;
            }

            if (jqEBM.clientInfo.line_state === 0) {
                failureBack(errCodeMap.NOT_LOGON);
                return;
            }

            var callInfo = jqEBM.chatMap[call_id];
            if (!callInfo) {
                text_area_log($.toJSON(jqEBM.chatMap));
                text_area_log('no callInfo is ready');
                failureBack(errCodeMap.CALLID_NOT_EXIST);
                return ;
            }

             jqEBM.EBCM.ebwebcm_sendrich(callInfo, null, false, jsonRichInfo, successCallback, failureBack);
        };

        /**
         * ajax方式上传文件
         * @param batch_number 批次号
         * @param url
         * @param secureuri
         * @param fileElementId
         * @param chat_id
         * @param success_handle
         * @param error_handle
         * @returns {Boolean}
         */
        jqEBM.ajaxFileUpload = function (batch_number, url, secureuri, fileElementId, chat_id, success_handle, error_handle) {
            var parameter = {
//			chat_id: chat_id,
//			batch_number: batch_number
            };

            $.ajaxFU.ajaxFileUpload({
                url: url + "?chat_id=" + chat_id + "&batch_number=" + batch_number, //你处理上传文件的服务端
                secureuri: secureuri,
                fileElementId: fileElementId,
                dataType: 'json',
                data: parameter,
                type: 'POST',
                success: function (data, status) {
                    if (success_handle)
                        success_handle(data, status);
                },
                error: function (data, status, e) {
                    if (error_handle)
                        error_handle(data, status, e);
                }
            });
        };

        /**
         * 重新登录
         *
         */
//        jqEBM.reloadLogon = function () {
//            if(jqEBM.current_relogon_times < jqEBM.options.MAX_RELOGON_TIMES) {
//                jqEBM.current_relogon_times ++;
//
//                setTimeout(function(){
//                    if(!jqEBM.clientInfo.tickoff) {
//                        setTimeout(function () {
//                            text_area_log("===============start to reload Logon============");
//                            //重置属性
//                            //jqEBM.clientInfo.reset();
//
//                            //重登
//                            var try_times = 0;//必须定义变量
//                            jqEBM.fn.load_iframe(jqEBM.options.HTTP_PREFIX + jqEBM.options.DOMAIN_URL + "/iframe_domain.html?fr_name="
//                                    + jqEBM.fn.domainURI(jqEBM.options.HTTP_PREFIX + jqEBM.options.DOMAIN_URL) + (jqEBM.options.IFRAME_DEBUG ? "&debug=true" : "") + "&v=" + jqEBM.STATIC_VERSION,
//                                try_times,
//                                function () {
//                                    if(jqEBM.clientInfo.user_type=="visitor") {
//                                        jqEBM.EBLC.ebweblc_logonvisitor();
//                                    } else {else
//                                        jqEBM.EBLC.ebweblc_logonaccount(jqEBM.clientInfo.my_account, null);
//                                    }
//                                });
//                        }, 1000);
//                    }
//                }, 2000);
//            } else {
//                alert("非常抱歉，过多尝试重新登录，该操作已到达最大限制");
//            }
//        };

        /**
         * 重载会话
         * 如果uid = null，则呼叫会话中所有成员uid
         * @param callId
         * @param uid {long} 用户ID 可选
         * @param call_key {string} 呼叫来源KEY，实现企业被呼叫限制
         */
        jqEBM.reloadChat = function (callId, uid, call_key) {
            if(jqEBM.current_reloadchat_times < jqEBM.options.MAX_RELOADCHAT_TIMES) {
                jqEBM.current_reloadchat_times ++;

                setTimeout(function() {
                    if(!jqEBM.clientInfo.tickoff) { //非 多处登录而被踢下线
                        text_area_log("=======start to reload chat========");

                        //var call_info =jqEBM.chatMap.callInfoByChatId(chat_id);
                        var callInfo =jqEBM.chatMap[callId];
                        if(!callInfo) {
                            text_area_log("reloadChat call_info not found for call_id=" + callId);
                            return;
                        }

                        if(callInfo.hangup) {
                            text_area_log("会话已被注销，自动reloadChat无效");
                            return;
                        }

                        callInfo.hangup =false;

                        //如果uid = null，则呼叫会话中所有成员uid
                        var uids = null;
                        if(uid != null) {
                            uids = [uid];
                        } else {
                            uids = callInfo.getUids();
                        }

                        for(var i =0; i< uids.length; i++) {
                            uid = uids[i];
                            var account = callInfo.accounts[uid];
                                if (!account) {
                                text_area_log("reloadChat account not found for uid=" + uid);
                                continue;
                            }

                            if (account.becalling) {
                                text_area_log("account is be calling ,reloadChat exit, uid=" + uid);
                                continue;
                            }

                            jqEBM.updateAccountBecalling(callInfo.call_id, uid, true);

                            text_area_log("reload chat, callaccount to_account=" + jqEBM.accountInfoMap[uid].from_account + ", call_id=" + callInfo.call_id);
                            jqEBM.EBUM.ebwebum_callaccount(jqEBM.accountInfoMap[uid].from_account, callInfo.call_id, call_key, null);
                        }
                    }
                }, 1000);
            } else {
                alert("非常抱歉，过多尝试重新载入会话，该操作已到达最大限制");
            }
        };

    })(jQuery, window);
});
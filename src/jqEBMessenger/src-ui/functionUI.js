define(["../libs/jquery/jquery-1.8.3.min"], function(jQuery) {
    (function (window, $) {
        var jqEBM = $.jqEBMessenger;
        if(!jqEBM.UI)
            jqEBM.UI = {};

        $.ebMsg.UI = jqEBM.UI;

        var ebUI = jqEBM.UI;

        //消息显示类型
        ebUI.MESSAGE_TYPE_ATTACHMENT = 2;	//附件选取界面
        ebUI.MESSAGE_TYPE_ME = 1;			//自己
        ebUI.MESSAGE_TYPE_OUTSIDE = 0;	//对方
        ebUI.MESSAGE_TYPE_SYSTIPS = -1;	//系统信息

        //保存光标位置缓存
        ebUI.cusorPosMap = {};

        /**
         * 清空日志
         */
        window.clear_text_area_log =function () {
            if ($('#log_area').length > 0) {
                var logTextArea = $('#log_area')[0];
                logTextArea.value = "";
                logTextArea.scrollTop = logTextArea.scrollHeight;
            }
        };

        /**
         * 打开恩布首页
         */
        window.openEBHOMEWin = function () {
            window.open ("http://www.entboost.com","恩布官方网站","width=1366,height=768,top=0,left=0,toolbar=yes,menubar=yes,scrollbars=yes, resizable=yes,location=yes, status=yes");
        };
        /**
         * 保存当前光标的在iframe中位置
         * @param iframe iframe对象
         */
        ebUI.saveCusorPos = function (iframe) {
            //编辑器获取焦点
            iframe.focus();
            if (iframe.document.selection) {
                //获取当前光标的位置
                var rangeObj = iframe.document.selection.createRange();
                var ieSelectionBookMark = rangeObj.getBookmark();
                ebUI.cusorPosMap[iframe.name] = ieSelectionBookMark;
    //		text_area_log($.toJSON(cusorPosMap));
            }
        };

        /**
         * 把光标还原到之前保存的到iframe中位置
         * @param iframe iframe对象
         */
        ebUI.setCusorPos = function (iframe) {
            //编辑器获取焦点
            iframe.focus();

            var ieSelectionBookMark = ebUI.cusorPosMap[iframe.name];
            if (ieSelectionBookMark) {
                //还原光标的位置
                var rangeObj = iframe.document.selection.createRange();
                rangeObj.moveToBookmark(ieSelectionBookMark);
                rangeObj.select();
            }
        };

        /**
         * 绑定ctrl + enter事件 及 输入字符时取消闪烁事件
         * @param btns
         * @param iframe_name
         * @param fn
         */
        ebUI.ctrlEnter = function(btns, iframe_name, fn) {
            btns = $(btns);
            var thiz =this;

            function performAction (e) {
                fn.call(thiz, e);
            }

            var tframe=document.getElementById(iframe_name).contentWindow || document.frames[iframe_name][0];
            var doc =tframe.document;

            $(doc.body).bind("keydown", function(e){
                if (/msie/.test(jqEBM.AGENT)) {
                    //记录光标位置
                    ebUI.saveCusorPos(tframe);
                }

                //取消闪烁事件
                $.CancelFlashTip();

                if (e.keyCode === 13 && e.ctrlKey) {
                    performAction(e);
                    e.preventDefault();//阻止默认回车换行
                }
            });

            btns.bind("click", performAction);
        };

        /**
         * 在信息接收框中增加一条可点击执行链接信息
         * @param call_id
         * @param tips 内容提示
         * @param click_name 链接显示名
         * @param click_handle_str 执行函数
         */
        ebUI.addClickLink = function (call_id, tips, click_name, click_handle_str) {
            var sysTip = [
                tips,
                '<a href="###" onclick="',
                click_handle_str,
                '">',
                click_name,
                '<a>'
            ].join("");
            $.ShowSysTips(call_id, sysTip);
        };

        /**
         * 显示聊天界面
         * @param call_id 会话编号
         * @param from_uid 对方用户数字编号
         * @param from_account 对方账号名
         * @param sysTip 界面加载成功后的提示内容
         */
        ebUI.showSurface = function (call_id, from_uid, from_account, userName, sysTip) {
            //识别会话界面是否重复建立
            if($("body").find("div[class=chat-main][id="+call_id+"]").length===0) {
                //加载聊天界面
                //		var uid =call_info.firstAccount().uid;
                $.WebIM({
                    callId: call_id,
                    sender: jqEBM.clientInfo.username,
                    receiver: from_account,
                    userName: userName
                }, function() {
                    if(sysTip && sysTip.length>0)
                    //$.ShowSysTips(call_id, "系统准备完毕！可以开始对话");
                        $.ShowSysTips(call_id, sysTip);
                });

                //$("#loading_img").hide();
                $("#loading_message").remove();
                $("#loading_img").remove();
                $("#"+call_id).show(500);
            } else {
                $.ShowSysTips(call_id, sysTip);
                text_area_log("callId="+call_id+" 已存在，重用界面");
            }
        };

        /**
         * 登录
         */
        ebUI.logon = function() {
            //游客登录
            $.ebMsg.logonVisitor(ebUI.onLogonSuccess, function (error) {
                alert(error.code + " : " + error.msg);
            });
        };

        /**
         * 呼叫会话中的所有成员
         * @param callId 会话编号
         */
        ebUI.callAccountsOfChat = function (callId) {
            var callInfo = ebUI.callInfoMap[callId];
            var uids = callInfo.getUids();
            for (var i = 0; i < uids.length; i++) {
                var uid = uids[i];
                var accountInfo = ebUI.accountInfoMap[uid];
                $.ebMsg.callAccount(accountInfo.from_account, callId, callInfo.call_key, ebUI.onCallAccountSuccess, ebUI.callAccountFailureCallback);
            }
        };

        /**
         * 登录成功后处理
         * @param clientInfo
         */
        ebUI.onLogonSuccess = function(clientInfo) {
            ebUI.clientInfo = clientInfo;
            var callCount = 0;

            //如果存在已呼叫会话，则用旧的会话编号作为参数进行呼叫
            for (var existCallId in ebUI.callInfoMap) {
                callCount++;
                ebUI.callAccountsOfChat(existCallId);
            }

            //没有已存在的会话时
            if (callCount === 0) {
                //对方用户账号
                ebUI.to_account =$.ebfn.getQueryStringRegExp(document.location.href, 'to_account');
                ebUI.call_key =$.ebfn.getQueryStringRegExp(document.location.href, 'call_key');
                $.ebMsg.callAccount(ebUI.to_account, null, ebUI.call_key, ebUI.onCallAccountSuccess, ebUI.callAccountFailureCallback);
            }
        };

        //对话环境准备就绪
        ebUI.onCallAccountSuccess = function (callInfo, accountInfo) {
            ebUI.callInfoMap[callInfo.call_id] = callInfo;
            ebUI.accountInfoMap[accountInfo.uid] = accountInfo;
            //显示聊天界面
            ebUI.showSurface(callInfo.call_id
                , accountInfo.uid
                , accountInfo.from_account
                , accountInfo.fInfo.name
                , ebUI.recall_flag ? "可以开始对话" : null);

            ebUI.talkReadyMap[callInfo.call_id] =true;
        };

        /**
         * 呼叫对方失败的回调函数
         * @param error
         */
        ebUI.callAccountFailureCallback = function (error) {
            var errCodeMap = jqEBM.errCodeMap;
            switch (error) {
                case errCodeMap.CALLACCOUNT_NOT_EXIST:
                    $("#loading_message").html("您呼叫的用户名并不存在<br/>请查验：" + ebUI.to_account);
                    break;
                case errCodeMap.CALLACCOUNT_NO_RESPONSE:
                    $("#loading_message").append("对方没有应答通话请求");
                    break;
                case errCodeMap.CALLACCOUNT_REJECT:
                    $("#loading_message").append("对方拒绝通话请求");
                    break;
                default :
                    alert(error.code + " : " + error.msg);
                    break;
            }
            $('#loading_img').remove();
        };

        /**
         * 会话编号变更
         * @param existCallId
         * @param newCallId
         */
        ebUI.changeCallId = function (existCallId, newCallId) {
            //alert("old="+existCallId+",new="+newCallId);
            //识别旧会话界面，更新界面参数
            var chatEl =$("div[class=chat-main][id="+existCallId+"]");
            if(chatEl.length>0) {
                chatEl.attr("id", newCallId);
                chatEl.attr("old_id", existCallId);

                var revEl =$("iframe[name=receiveMessage"+existCallId+"]");
                revEl.attr("name", "receiveMessage"+newCallId);
                revEl.attr("id", "receiveMessage"+newCallId);

                var sendEl =$("iframe[name=sendMessage"+existCallId+"]");
                sendEl.attr("name", "sendMessage"+newCallId);
                sendEl.attr("id", "sendMessage"+newCallId);
            }
        };

        /**
         * 处理加载表情信息事件
         */
        ebUI.onLoadEmotions = function(emotions) {
            $.IM.defaultOptions.faceImageArray = [];
            if (emotions) {
                for (var i = 0; i < emotions.length; i++) {
                    var emotion = emotions[i];
                    var faceImage = {
                        snap: emotion.url,
                        gif : emotion.url
//                        resid : emotion.resid,
//                        server : emotion.server,
//                        appname : emotion.appname
                    };
                    $.IM.defaultOptions.faceImageArray.push(faceImage);
                }
            }
        };

        /**
         * 组成显示图片的<img>标签
         * @param url
         * @param targetWidth 显示的宽度
         * @param targetHeight 显示的高度
         * @returns
         */
        ebUI.createShowPictureTag = function (url, targetWidth, targetHeight) {
//            var url = ((serverName.indexOf("http")===0)?"":"http://") + serverName + "/servlet.ebwebcm.res?file=" + fileName;
            var image_url = [
                '<img src="',
                url,
                '"',
                ' onclick="window.open(\'',
                url,
                '\')"',
                    ' onload="adjustImgSize(this, '+ targetWidth + ',' + targetHeight + ');updateScroll();"',
                ' style="cursor:pointer;"',
                '/>'
            ].join("");
            return image_url;
        };

        /**
         * 处理接收到的富文本信息
         * @param richInfo {Array} 富文本结构数组
         * @returns {String} html脚本
         */
        ebUI.processRichInfo = function (richInfo) {
            var htmlContent = [];
            var info = null;
            for(var i=0;i <richInfo.length;i++) {
                info = richInfo[i];
                switch (info.type) {
                    case "text":
                        htmlContent.push($.ebfn.htmlEncode(info.content));
                        break;
                    case "screenshot":
                        htmlContent.push(ebUI.createShowPictureTag(info.content, 350, 200));
                        break;
                    case "emotion":
                        htmlContent.push('<img src="' + info.content + '"/>');
                        break;
                }
            }
            return htmlContent.join("");
        };

        /**
         * 处理 上传离线文件 情况
         * @param state
         * @param callId
         * @param fileName
         * @param mimeType
         * @param url
         */
        ebUI.onSendingFile = function(state, callId, fileName, mimeType, url) {
            var chatEl =$("body").find("div[class=chat-main][id="+callId+"]");
            var file =chatEl.find("#attachment_file")[0];
            var errCodeMap = jqEBM.errCodeMap;

            switch(state) {
                //申请上传文件失败
                case errCodeMap.SENDFILE_REQUEST_FAILURE:
                    $.ShowSysTips(callId, "<span style='color:red;'>申请上传文件失败。</span>");
                    break;
                //空文件
                case errCodeMap.UPLOAD_FILE_EMPTY:
                    $.ShowSysTips(callId, "<span style='color:red;'>上传文件失败，请先选择一个文件后再点击传送。</span>");
                    break;
                //文件超长
                case errCodeMap.CONTENT_TOO_LONG:
                    $.IM.defaultOptions.resetUploadAttachment();
                    chatEl.find("#upfile").val("");
                    //清空file控件内容
                    file.outerHTML += "";
                    file.value = "";

                    $.ShowSysTips(callId, "<span style='color:red;'>很抱歉！上传失败，文件超过最大限制(1MB-兆字节)。</span>");
                    break;
                //离线保存成功
                case errCodeMap.OK:
                    chatEl.find("#upfile").val("");
                    //清空file控件内容
                    file.outerHTML += "";
                    file.value = "";

                    var spls =fileName.split("\\");
                    var showHtml = [
                        "服务器已经成功保存离线文件。<br/> <span style='color: blue;'>",
                        spls[spls.length-1] ,
                        "</span>"
                    ];
                    //如图片资源则自动显示
                    if(jqEBM.pictureMimeTypeMap[mimeType]) {
                        var image_url =ebUI.createShowPictureTag(url, 400, 200);
                        showHtml.push("<br/>");
                        showHtml.push(image_url);
                        text_area_log(image_url);
                    }

                    $.ShowSysTips(callId, showHtml.join(""));

                    break;

            }
            $.IM.defaultOptions.resetUploadAttachment();
        };

        /**
         * 处理 对方接收文件情况
         * @param state
         * @param callId
         * @param fileName
         */
        ebUI.onSentFile = function (state, callId, fileName) {
            var spls =fileName.split("\\");
            fileName =spls[spls.length-1];
            var errCodeMap = jqEBM.errCodeMap;

            switch(state) {
                //
                case errCodeMap.OK:
                    $.ShowSysTips(callId, "对方已经成功接收到文件。<br/> <span style='color: blue;'>" + fileName + "</span>");
                    break;
                //f对方拒绝或取消接收文件事件
                case errCodeMap.UPLOAD_FILE_REJECT:
                    $.ShowSysTips(callId, "对方<span style='color:red;font-weight:bold;'>拒绝</span>接收文件。<br/> <span style='color:red;'>" + fileName + "</span>");
                    break;
            }
        };

    })(window, jQuery);
});
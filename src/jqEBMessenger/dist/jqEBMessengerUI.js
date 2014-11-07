/*
 * jqEBMessengerUI
 * https://github.com/Administrator/jqEBMessenger
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */


;(function($, window, undefined) {


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



    (function (window, $) {
        /**
         * IM chat Send Message iframe editor
         * @author: nick
         * @email:
         * @createDate: 2014-1-1
         * @version 1.0
         **/

        window.sendMessageEditor = {
            // 获取iframe的window对象
            getWin: function () {
                return /*!/firefox/.test(AGENT)*/false ? this.iframe.contentWindow : window.frames[this.iframe.name];
                //return !/firefox/.test(AGENT) ? sendMessageEditor.iframe.contentWindow : window.frames[sendMessageEditor.iframe.name];
            },
            //获取iframe的document对象
            getDoc: function () {
                return !/firefox/.test($.jqEBMessenger.AGENT) ? this.getWin().document : (this.iframe.contentDocument || this.getWin().document);
            },
            init: function () {
                var doc = this.getDoc();

                //打开document对象编辑模式
                if (/msie/.test($.jqEBMessenger.AGENT)) {
                    doc.body.contentEditable = 'true';
                    $(doc.body).html("<div></div>");
                } else {
                    doc.designMode = "on";
                }
                text_area_log("开启编辑模式=" + doc.designMode);

                //设置默认样式
//        var htmlStr = [
//                       '<html>', 
//                       '<head><style type="text/css">body{border:0;margin:0;padding:3px;height:98%;cursor:text;background-color:white;font-size:14px;font-family:Courier,serif,monospace;}</style></head>',
//                       '<body jid="', callId, '"></body>',
//                       '</html>'].join("");
                //var headStr ='<style type="text/css">body{border:0;margin:0;padding:3px;height:98%;cursor:text;background-color:white;font-size:14px;font-family:Courier,serif,monospace;}</style>';
//doc.open();
//doc.write(htmlStr);
//doc.close();
                //$(doc).find("head").append(headStr);
//        $(doc).find("body").attr("jid", callId);
//        $(doc).find("body").append("good");

//        $(ir).removeAttr("onload");
//        text_area_log($(ir).attr("onload"));

            },
            getContent: function () {
                var doc = this.getDoc();
                //获取编辑器的body对象
                var body = doc.body || doc.documentElement;
                //获取编辑器的内容
                var content = body.innerHTML;
                //对内容进行处理，例如替换其中的某些特殊字符等等
                //Some code
                //返回内容
                return content;
            },

            //统一的执行命令方法
            execCmd: function (cmd, value, d) {
                var doc = d || this.getDoc();
                //doc对象的获取参照上面的代码
                //调用execCommand方法执行命令
                doc.execCommand(cmd, false, value === undefined ? null : value);
            },
            getStyleState: function (cmd) {
                var doc = this.getDoc();
                //doc对象的获取参考上面的对面
                //光标处是否是粗体
                var state = doc.queryCommandState(cmd);
                if (state) {
                    //改变按钮的样式
                }
                return state;
            },

            insertAtCursor: function (text, d, w) {
                var doc = d || this.getDoc();
                var win = w || this.getWin();
                //win对象的获取参考上面的代码
                if (/msie/.test($.jqEBMessenger.AGENT)) {
//            win.focus();
                    $.jqEBMessenger.UI.setCusorPos(win);
                    var r = doc.selection.createRange();
                    if (r) {
                        r.collapse(false);//false光标放在选中内容前,true光标放在选中内容后
                        r.pasteHTML(text);
                        r.select();
                        r.collapse(false);
                        $.jqEBMessenger.UI.saveCusorPos(win);
                    }
                } else if (/gecko/.test($.jqEBMessenger.AGENT) || /opera/.test($.jqEBMessenger.AGENT)) {
                    win.focus();
                    this.execCmd('InsertHTML', text, doc);
                } else if (/safari/.test($.jqEBMessenger.AGENT)) {
                    this.execCmd('InsertText', text, doc);
                }
            }
        };
    })(window, jQuery);


    /***
     * jquery local chat
     * @version v2.0
     * @createDate -- 2012-5-28
     * @author nick
     * @requires jQuery v1.8.0 or later, send.message.editor-1.0
     **/

    (function (window, $) {
        var jqEBM = $.jqEBMessenger;
        var ebUI = jqEBM.UI;
        var sendMessageEditor = window.sendMessageEditor;

        var _im = $.IM = {};
        _im.version = 2.0;
        var faceTimed;
        var messageTipTimed, tipCount = 0;
        var loadSendIframeTimes = 0;

        var loadorgTimed; //等待加载组织架构延时句柄
        var loadorgWaitTimes = 0; //等待加载组织架构次数

        _im.defaultOptions = {
            chat: "#chat",
            chatEl: function () {
                var $chat = _im.defaultOptions.chat;
                if ((typeof _im.defaultOptions.chat) == "string") {
                    $chat = $(_im.defaultOptions.chat);
                } else if ((typeof _im.defaultOptions.chat) == "object") {
                    if (!$chat.get(0)) {
                        $chat = $($chat);
                    }
                }
                return $chat;
            },
            sendMessageIFrame: function (callId) {
                return $("iframe[name='sendMessage" + callId + "']").get(0).contentWindow;
            },
            receiveMessageDoc: function (callId) {
                callId = callId || "";
                var docs = [];
                $.each($("iframe[name^='receiveMessage" + callId + "']"), function () {
                    docs.push($(this.contentWindow.document));
                });
                return docs;
            },
            setTitle: function (chatEl) {
                var userName = chatEl.attr("userName");
                chatEl.find(".title").html("和 " + userName + " 聊天对话中");
            },
            getReceiver: function (chatEl) {
                var receiver = chatEl.attr("receiver");
                if (~receiver.indexOf("@")) {
                    receiver = receiver.split("@")[0];
                }
                return receiver;
            },
            /***
             * 发送消息的格式模板
             * me = true 表示当前user是自己，否则就是对方
             **/
            receiveMessageTpl: function (userName, styleTpl, content, type) {
                // 设置当前发送日前
                var datetime = $.ebfn.dateFormat(new Date(), "hh:mm:ss");
                var result = ['<div class="revMsg_box">'];

                var img_l = '<div class="head_img img_l"><img src="images2/g1.jpg"></div>';
                var img_r = '<div class="head_img img_r"><img src="images2/g2.png"></div>';

                if (type == ebUI.MESSAGE_TYPE_ME) {
                    result.push(img_r);
                    result.push('<div class="talk_tail tail_r"><img src="images2/talk-r.gif"></div>');
                    result.push(['<div class="msg msg_r"><div class="content">', content , '</div><div class="date_time">', datetime, '</div></div>'].join(""));
                } else if (type == ebUI.MESSAGE_TYPE_OUTSIDE) {
                    result.push(img_l);
                    result.push('<div class="talk_tail tail_l"><img src="images2/talk-l.gif"></div>');
                    result.push(['<div class="msg msg_l"><div class="content">', content , '</div><div class="date_time">', datetime, '</div></div>'].join(""));
                } else if (type == ebUI.MESSAGE_TYPE_ATTACHMENT) {
                    result.push(['<div class="attachment"><div>', content, '</div></div>'].join(''));
                } else {
                    result.push(['<div class="sys_tips"><div>', content, '</div></div>'].join(''));
                }
                result.push('<div id="clearFloat" style="clear:both;"></div>');
                result.push('</div>');

                return result.join("");
            },
            // 工具类按钮触发事件返回html模板
            sendMessageStyle: {
                cssStyle: {
                    bold: "font-weight: bold;",
                    underline: "text-decoration: underline;",
                    italic: "font-style: oblique;"
                },
                setStyle: function (style, val) {
                    if (val) {
                        _im.defaultOptions.sendMessageStyle[style] = val;
                    } else {
                        var styleVal = _im.defaultOptions.sendMessageStyle[style];
                        if (styleVal === undefined || !styleVal) {
                            _im.defaultOptions.sendMessageStyle[style] = true;
                        } else {
                            _im.defaultOptions.sendMessageStyle[style] = false;
                        }
                    }
                },
                getStyleTpl: function () {
                    var tpl = "";
                    $.each(_im.defaultOptions.sendMessageStyle, function (style, item) {
                        if (item === true) {
                            tpl += _im.defaultOptions.sendMessageStyle.cssStyle[style];
                        } else if ((typeof item) === "string") {
                            tpl += style + ":" + item + ";";
                        }
                    });
                    return tpl;
                }
            },
            // 向接收消息iframe区域写消息
            writeReceiveMessage: function (callId, userName, content, type) {
                if (content) {
                    // 发送消息的样式
                    var styleTpl = _im.defaultOptions.sendMessageStyle.getStyleTpl();
                    var receiveMessageDoc = _im.defaultOptions.receiveMessageDoc(callId);
                    $.each(receiveMessageDoc, function () {
                        // 向接收信息区域写入发送的数据
                        this.find("body").append(_im.defaultOptions.receiveMessageTpl(userName, styleTpl, content, type));
                        text_area_log("send content==\n" + content);
                        // 滚动条滚到底部
                        this.scrollTop(this.height());
                    });
                }
            },
            // 发送消息
            sendHandler: function ($chatMain) {
                var callId = $chatMain.attr("id");
                if(!ebUI.talkReadyMap[callId]) {
                    $.ShowSysTips(callId, "<span style='color:red'>当前状态不能进行通话</span>");
                    return;
                }
                var doc = $chatMain.find("iframe[name^='sendMessage']").get(0).contentWindow.document;
                var content = $(doc.body).html();
                //alert(content);
                //处理掉全是换行标签的情况
                var trimContent = content.replace(/<br>/gi,'\n');
                if($.trim(trimContent).length === 0) {
                    return;
                }

                trimContent = trimContent.replace(/<div>\s*<\/div>|<div\s*\/>/gi, '\n');

                trimContent = $.trim(trimContent);
                //alert(trimContent);
                if (trimContent && trimContent.length > 0) {
                    $.jqEBMessenger.api.sendMessage(callId, trimContent,
                        function() {
                            // 接收区域写已发送的消息
                            _im.defaultOptions.writeReceiveMessage(callId, "自己", content, ebUI.MESSAGE_TYPE_ME);

                            // 清空发送区域
                            if (/msie/.test($.jqEBMessenger.AGENT)) {
                                $(doc.body).html("<div></div>");
                            } else {
                                $(doc.body).html("");
                            }
                        },
                        function(state) {
                            if(state == $.jqEBMessenger.errCodeMap.NOT_LOGON) {
                                ebUI.addClickLink(callId,
                                    "会话已经暂时结束。",
                                    "重新对话",
                                    "reloadLogon(this);"
                                );
                            } else {
                                alert("发送失败," + state.msg);
                            }
                        }
                    );
                }
            },
            faceImagePath: "images/emotions/",
            faceImageArray: [],//[{snap:xxx.bmp, gif:xxx.gif},{}]
            faceElTpl: function (i) {
                return [
                    "<img ",
//                    " server='",
//                    _im.defaultOptions.faceImageArray[i].server,
//                    "' resid='",
//                    _im.defaultOptions.faceImageArray[i].resid,
//                    "' appname='",
//                    _im.defaultOptions.faceImageArray[i].appname,
                    " src='",
                    _im.defaultOptions.faceImageArray[i].snap,
                    "' gif='",
                    _im.defaultOptions.faceImageArray[i].gif,
                    "'/>"
                ].join("");
            },
            // 创建表情html elements
            createFaceElement: function ($chat) {
                //是否已加载表情资源
//                if (jqEBM.clientInfo.loadorg_state == -1 && loadorgWaitTimes < 14) {//加载中
//                    loadorgTimed = window.setTimeout(function () {
//                        loadorgWaitTimes++;
//                        _im.defaultOptions.createFaceElement($chat);
//                    }, 500);
//                    return;
//                }

                var faces = [];
                var i = 1;
                for (; i <= _im.defaultOptions.faceImageArray.length; i++) {
                    faces.push(this.faceElTpl(i - 1));
                    if (i % 13 === 0) {
                        faces.push("<br/>");
                    }
                }
                //不足整行时补足整行
                var lastE = 13 - ((i % 13) === 0 ? 13 : (i % 13));
                for (i = 0; i <= lastE; i++) {
                    faces.push("<img src='images/blank.gif'/>");
                }

                $chat.find("#face").html(faces.join(""));
                this.faceHandler($chat);
            },
            // 插入表情
            faceHandler: function ($chat) {
                $chat.find("#face img").click(function () {
                    $chat.find("#face").hide(150);
                    var imgEL = [
                        "<img src='",
                        $(this).attr("gif"),
//                        "' appname='",
//                        $(this).attr("appname"),
//                        "' resid='",
//                        $(this).attr("resid"),
//                        "' server='",
//                        $(this).attr("server"),
                        "'/>"
                    ].join("");
                    var $chatMain = $(this).parents(".chat-main");
                    var win = $chatMain.find("iframe[name^='sendMessage']").get(0).contentWindow;
                    var doc = win.document;

                    sendMessageEditor.insertAtCursor(imgEL, doc, win);
                });
                // 表情隐藏
                $chat.find("#face, #face img").mouseover(function () {
                    window.clearTimeout(faceTimed);
                }).mouseout(function () {
                    window.clearTimeout(faceTimed);
                    faceTimed = window.setTimeout(function () {
                        $chat.find("#face").hide(150);
                    }, 2000);
                });
            },

            /**
             * 发送消息工具栏按钮事件方法
             **/
            toolBarHandler: function () {
                var $chat = $(this).parents(".chat-main");
                var targetCls = $(this).attr("class");
                if (targetCls == "face") {//表情
                    $chat.find("#face").toggle(150);
                } else if (targetCls == "attachment") {
                    $chat.find("#attachment").toggle();
                }
                else if (this.tagName == "DIV") {
                    _im.defaultOptions.sendMessageStyle.setStyle(targetCls);
                } else if (this.tagName == "SELECT") {
                    _im.defaultOptions.sendMessageStyle.setStyle($(this).attr("name"), $(this).val());
                    if ($(this).attr("name") == "color") {
                        $(this).css("background-color", $(this).val());
                    }
                }
                // 设置sendMessage iframe的style css
                _im.defaultOptions.writeSendStyle();

            },
            // 设置sendMessage iframe的style css
            writeSendStyle: function () {
                var styleTpl = _im.defaultOptions.sendMessageStyle.getStyleTpl();
                var styleEL = ['<style type="text/css">body{', styleTpl, '}</style>'].join("");
                $("body").find("iframe[name^='sendMessage']").each(function () {
                    var $head = $(this.contentWindow.document).find("head");
                    if ($head.find("style").size() > 1) {
                        $head.find("style:gt(0)").remove();
                    }
                    if (styleTpl) {
                        $head.append(styleEL);
                    }
                });
            },
            chatLayoutTemplate: function (callId, sender, receiver, userName, product, flag) {
                var display = "";
                if (flag) {
                    display = "style='display: none;'";
                }
                return [
                    '<div class="chat-main" id="', callId,
                    '" sender="', sender, '" receiver="', receiver, '" userName="', userName, '">',
                    '<div id="chat"><div class="radius">',
                    '<table>',
                    '<tr>',
                    '<td class="receive-message">',
                    '<iframe id="receiveMessage', callId, '" name="receiveMessage', callId, '" src="receiveMessagePage.html?v =', jqEBM.STATIC_VERSION, '" frameborder="0" width="100%" height="100%"></iframe>',
                    '</td>',
                    '<td rowspan="4" class="split-r split" ', display, '>&nbsp;</td>',
                    '<td rowspan="4" class="product-info" ', display, '>',
                    '<div class="logo"><img onclick="openEBHOMEWin()" src="images2/logo2.gif"></div>',
                    '<div class="product-name"><div>恩布互联</div></div>',
                    '<div class="product-description"><div><span>跨平台、跨应用的即时通信开放平台<br>联系电话：0755-27362216</span></div></div>',
                    '</td>',
                    '</tr>',
                    '<tr class="tool-bar">',
                    '<td>',
                    '<div class="face" TITLE="插入表情"></div>',
                    '<div class="attachment" TITLE="上传文件"></div>',
                    '<div class="history">消息记录</div>',
                    '</td>',
                    '</tr>',
                    '<tr class="send-message">',
                    '<td>',
                        '<iframe id="sendMessage' + callId + '" name="sendMessage', callId, '" width="100%" height="100px" frameborder="0" src="sendMessagePage.html?v=', jqEBM.STATIC_VERSION, '" onload="$.IM.defaultOptions.sendMessage_iframe_onload(this);"></iframe>',
                    '</td>',
                    '</tr>',
                    '<tr class="bottom-bar">',
                    '<td>',
                    //'<input type="button" value="关闭" id="close"/>&nbsp;',
                    '<div style="font-size: 12px;color: gray; text-align: right;">快捷键Ctrl+Enter</div><div id="send" onselectstart="return false;" class="send-btn btn solid blue" TITLE="快捷键Ctrl+Enter" >发送消息</div>',
                    '</td>',
                    '</tr>',
                    '</table></div>',
                    '<div id="face"></div>',
                    '<div id="attachment">',
                    '<div id="attachment_holder">',
                    '<input id="attachment_file" class="inline-block_cls" type="file" name="attachment_file" onchange="upfile.value=this.value;">',
                    '<input class="solid blue attachment_btn" type="button" value="浏览">',
                    '</div>',
                    '<input type="text" name="upfile" id="upfile">',
                    '<input class="solid blue attachment_btn" id="send_attachment" type="button" value="传送" >',
                    '<input class="solid blue attachment_btn" id="close_attachment" type="button" value="关闭" onclick="$(this).parent().hide(150);">',
                    '<img id="attachment_uploading" src="images/loading13.gif">',
                    '</div>',
                    '</div>',
                    '</div>'
                ].join("");
            },
            sendMessage_iframe_onload: function (ir) {
                text_area_log("sendMessage_iframe_onload iframe name=" + ir.name);

                if (loadSendIframeTimes !== 0) {
                    text_area_log("发生了超过一次的iframe加载事件，忽略处理");
                    return;
                }
                loadSendIframeTimes++;

                var chatEl = $(ir).parents(".chat-main");

                // 初始化sendMessageEditor相关信息
                sendMessageEditor.init();

                this.setTitle(chatEl);
                this.writeSendStyle();
                this.createFaceElement(chatEl);

                //Ctrl + Enter 事件 及 输入字符时取消闪烁事件
                $(ir).ctrlEnter("#send", ir.name, function (e) {
                    var cEl = this.parents(".chat-main");
                    _im.defaultOptions.sendHandler(cEl);
                });

                if (/msie/.test(jqEBM.AGENT)) {
                    //处理iframe内点击事件
                    $(ir.contentWindow.document).bind("click", function () {
                        ebUI.saveCusorPos(sendMessageEditor.iframe);
                    });
                }

                // 查看更多详情
                chatEl.find(".more").click(function () {
                    var $ul = $(this).parents("ul");
                    $ul.find(".more").toggle();
                    $ul.find(".info").toggle();
                    $ul.find(".pic").toggle();
                });
                // 收缩详情
                chatEl.find(".split").toggle(function () {
                    $(".product-info").hide();
                    $(this).parents(".radius").css("border-right-width", "0px");
                    $(this).toggleClass("split-l");
                    $(this).toggleClass("split-r");
                }, function () {
                    $(".product-info").show();
                    $(this).parents(".radius").css("border-right-width", "8px");
                    $(this).toggleClass("split-l");
                    $(this).toggleClass("split-r");
                });

                // 工具类绑定事件 settings.toolBarHandler
                chatEl.find(".tool-bar td").children().click(this.toolBarHandler);

                chatEl.find("#close").click(function () {
                    var $chatMain = $(this).parents(".chat-main");
                    $chatMain.hide(500);
                });


                //设置上传附件参数
                var call_id = chatEl.attr("id");
                var call_info = jqEBM.chatMap[call_id];

                var loadingImg = chatEl.find("#attachment_uploading");
                var sendAttachmentBtn = chatEl.find("#send_attachment");
                var upFileTxt = chatEl.find("#upfile");

                _im.defaultOptions.resetUploadAttachment = function () {
                    //设置上传控件启用状态
                    sendAttachmentBtn.attr("disabled", false);

                    //防止调用到iframe内部复制过去的file控件，所以要重新查找一次
                    var attachmentFileInput_old = chatEl.find("#attachment_file");
                    attachmentFileInput_old.css("display", "inline-block");
                    attachmentFileInput_old.css("_display", "inline");
                    upFileTxt.attr("readonly", false);

                    //移除批次标记
                    sendAttachmentBtn.removeAttr("batch_number");

                    //隐藏进度条
                    loadingImg.css("display", "none");
                    loadingImg.css("_display", "none");
                };

                chatEl.find("#send_attachment").click(function () {
                    if(!ebUI.talkReadyMap[call_id]) {
                        $.ShowSysTips(call_id, "<span style='color:red'>当前状态不能上传文件</span>");
                        return;
                    }

                    var attachmentFileInput = chatEl.find("#attachment_file");

                    if (attachmentFileInput.val() === "") {
                        $.ShowSysTips(call_id, "<span style='color:red;'>请先选择一个文件后再点击传送。</span>");
                        return;
                    }

                    if (sendAttachmentBtn.attr("batch_number") != null) {
                        $.ShowSysTips(call_id, "同一时间只允许上传一个文件。");
                        return;
                    }

                    //设置上传控件禁用状态
                    sendAttachmentBtn.attr("disabled", true);
                    attachmentFileInput.css("display", "none");
                    attachmentFileInput.css("_display", "none");
                    upFileTxt.attr("readonly", true);

                    //显示进度条
                    loadingImg.css("display", "inline-block");
                    loadingImg.css("_display", "inline");

                    //开始上传文件
                    var batch_number = jqEBM.api.sendfile('attachment_file', call_info.chat_id,
                        function(state, callId, fileName, mimeType, url) {
                            ebUI.onSendingFile(state, callId, fileName, mimeType, url);
                        },
                        function(state, callId, fileName) {
                            ebUI.onSentFile(state, callId, fileName);
                        });

                    sendAttachmentBtn.attr("batch_number", batch_number);

                });

                //绑定取消闪烁事件
                $(ir.contentWindow.document).click(function () {
                    _im.defaultOptions.cancelFlashTip();
                });

                //回调函数--初始化完毕
                if (sendMessageEditor.initFinishedHandle) {
                    setTimeout(function () {
                        sendMessageEditor.initFinishedHandle();
                    }, 1500);
                }

                text_area_log("sendMessage_iframe_onload 加载完毕");
            },
            initWebIM: function (callId, receiver, userName, initFinishedHandle) {
                var product = {
                    name: "小玩熊",
                    pic: "images/sample.bmp",
                    price: "198.00",
                    marketPrice: "899.90",
                    deliverOrgs: "EMS",
                    wareHouses: "A库",
                    skuAttrs: ""
                };
                var chatEl = $(_im.defaultOptions.chatLayoutTemplate(callId, _im.defaultOptions.sender, receiver, userName, product));

                //$("body").append(chatEl);
                chatEl.prependTo('body');
                sendMessageEditor.iframe = this.sendMessageIFrame(callId);
                sendMessageEditor.initFinishedHandle = initFinishedHandle;

                setTimeout(function () {
                    //消息输入框设置为焦点
                    sendMessageEditor.iframe.focus();
                }, 1000);
            },

            // 取消闪动提示
            cancelFlashTip: function () {
                window.clearTimeout(messageTipTimed);
                document.title = client_title;
                tipCount = 0;
            },

            // 消息提示
            messageTip: function () {
                if (tipCount % 2 === 0) {
                    //window.focus();
                    document.title = "您来了新消息，请查收！";
                } else {
                    document.title = client_title;
                }

                window.clearTimeout(messageTipTimed);
                messageTipTimed = window.setTimeout(_im.defaultOptions.messageTip, 1500);
                tipCount++;

            }
        };

        $.extend({
            /**
             * 界面初始化
             * @param opts 初始化参数
             * @param initFinishedHandle 完成时回调函数
             */
            WebIM: function (opts, initFinishedHandle) {
                opts = opts || {};
                // 覆盖默认配置
                _im.defaultOptions = $.extend(_im.defaultOptions, _im.defaultOptions, opts);
                var settings = $.extend({}, _im.defaultOptions, opts);
                settings.initWebIM(settings.callId, settings.receiver, settings.userName, initFinishedHandle);
            },
            //接收区域写接收的信息
            ShowReceiveMsg: function (callId, userName, content) {
                _im.defaultOptions.writeReceiveMessage(callId, userName, content, ebUI.MESSAGE_TYPE_OUTSIDE);
                _im.defaultOptions.messageTip();
            },
            ShowSysTips: function (callId, content) {
                _im.defaultOptions.writeReceiveMessage(callId, "系统", content, ebUI.MESSAGE_TYPE_SYSTIPS);
            },
            CancelFlashTip: function () {
                _im.defaultOptions.cancelFlashTip();
            }
        });

    })(window, jQuery);



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


})(jQuery, window);

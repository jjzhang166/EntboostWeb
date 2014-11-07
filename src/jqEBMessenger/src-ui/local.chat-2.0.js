define([
    "../libs/jquery/jquery-1.8.3.min"
    ], function(jQuery) {
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
});
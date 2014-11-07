define(["../libs/jquery/jquery-1.8.3.min"], function(jQuery) {

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
});
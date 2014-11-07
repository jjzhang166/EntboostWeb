define(["../libs/jquery/jquery-1.8.3.min"], function(jQuery) {
    /*
     *  entboost 全局工具函数库
     *  访问方法 $.ebfn.xxx()
     */
    (function($, window) {
        /**
         * 在日志区输出日志
         * @param text 内容
         */
        window.text_area_log = function (text) {
            console.info(text);
            if ($('#log_area').length > 0) {
                var logTextArea = $('#log_area')[0];
                logTextArea.value = logTextArea.value + text + "\n";
                //$('#log_area').append(text+"\n");
                logTextArea.scrollTop = logTextArea.scrollHeight;
            }
        };

        if (!$.ebfn)
            $.ebfn = {};

        $.extend( $.ebfn, {
                /**
                 * html反转义
                 * @param str
                 * @returns {String}
                 */
                htmlDecode: function (str) {
                    var s = "";
                    if (str.length === 0) return "";

                    s = str.replace(/&#38;/g, "&");
                    s = s.replace(/&lt;/g, "<");
                    s = s.replace(/&gt;/g, ">");
                    s = s.replace(/&nbsp;/g, " ");
                    s = s.replace(/&#39;/g, "\'");
                    s = s.replace(/&quot;/g, "\"");
                    s = s.replace(/<br>/g, "\n");
                    return s;
                },

                /**
                 * html转义
                 * @param str
                 * @returns {String}
                 */
                htmlEncode: function (str) {
                    var s = "";
                    if (str.length === 0) return "";

                    s = str.replace(/&/gm, "&#38;");
                    s = s.replace(/</gm, "&lt;");
                    s = s.replace(/>/gm, "&gt;");
                    s = s.replace(/\'/gm, "&#39;");
                    s = s.replace(/\"/gm, "&quot;");
                    s = s.replace(/[\n\r]+?/gm, "<br>");
                    return s;
                },

                //日期时间格式化
                dateFormat: function (dateVar, format) {
                    var o = {
                        "M+": dateVar.getMonth() + 1, //month
                        "d+": dateVar.getDate(), //day
                        "h+": dateVar.getHours(), //hour
                        "m+": dateVar.getMinutes(), //minute
                        "s+": dateVar.getSeconds(), //second
                        "q+": Math.floor((dateVar.getMonth() + 3) / 3), //quarter
                        "S": dateVar.getMilliseconds() //millisecond
                    };

                    if (/(y+)/.test(format)) {
                        format = format.replace(RegExp.$1, (dateVar.getFullYear() + "").substr(4 - RegExp.$1.length));
                    }

                    for (var k in o) {
                        if (new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                        }
                    }
                    return format;
                },

                //计算包含中英文字符字节长度函数
                stringByteLength: function (str) {
                    var cArr = str.match(/[^\x00-\xff]/ig);
                    return str.length + (cArr == null ? 0 : cArr.length);
                },

                clone: function (obj) {
                    var o;
                    if (typeof obj == "object") {
                        if (obj === null) {
                            o = null;
                        } else {
                            if (obj instanceof Array) {
                                o = [];
                                for (var i = 0, len = obj.length; i < len; i++) {
                                    o.push(this.clone(obj[i]));
                                }
                            } else {
                                o = {};
                                for (var j in obj) {
                                    o[j] = this.clone(obj[j]);
                                }
                           }
                        }
                    } else {
                       o = obj;
                    }
                    return o;
                 },

                /**
                 * 获取url中服务器名
                 * @param url
                 * @returns {*}
                 */
                getServerName: function (url) {
                    var domain = url.match('^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)');
                    return domain[1];
                },

                /**
                 * 获取url中参数值
                 * @param url
                 * @param name
                 * @returns {*}
                 */
                getQueryStringRegExp: function (url, name) {
                    var reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i");
                    if (reg.test(url))
                        return unescape(RegExp.$2.replace(/\+/g, " "));
                    return "";
                },

                /**
                 * 消除<div>标签，并在标签原位置前插入替代字符串
                 * @param htmlSrc {String} 源html字符串
                 * @param replaceValue {String} 替代字符串(不允许使用"<div>"标签)
                 * @returns {String}
                 */
                replaceDivTag: function (htmlSrc, replaceValue) {
                    if(!htmlSrc) return null;
                    //var regexp = /<div[ ]*[^<>]*\/>|<div[ ]*>[^<>]*?<\/div>/i;
                    var regexp = new RegExp("<div\\s*[^<>]*>([^<>]*?(<img\\s*[^<>]*?[\/]*>+[^<>]*(<\/img>)*)*?)*?</div>", "i");
                    var retHtml =[];
                    //alert($.toJSON(arry)+arry.length);

                    var index = -1;
                    var arrMactches = null;
                    var temp ="";
                    while(htmlSrc.length) {
                        index =htmlSrc.search(regexp);
                        arrMactches = htmlSrc.match(regexp);
                        if(index >=0) {
                            if(index!==0)
                                retHtml.push(htmlSrc.substring(0, index));

                            retHtml.push("\n");
                            temp = htmlSrc.substring(index, index + arrMactches[0].length);
                            temp = $(temp).html();
                            //alert("html="+temp);
                            retHtml.push(temp);

                            htmlSrc =htmlSrc.substring(index + arrMactches[0].length);
                        }
                        else {
                            retHtml.push(htmlSrc);
                            htmlSrc ="";
                        }
                    }
                    //alert(retHtml.join(""));
                    return retHtml.join("");
                },

                /**
                 * 使用<img>标签作为分界符, 拆分html信息为数组
                 * @param htmlData {string} html格式的内容
                 * @returns {Array} 值为字符串的数组,拆分后的多个字符串块
                 */
                html2ArraySplitByImgTag: function (htmlData) {
                    var re = /<img\s*[^<>]*?[\/]*>+[^<>]*?(<\/img>)*/i;
                    var ary =[];
                    while(htmlData.length) {
                        var index =htmlData.search(re);
                        var arrMactches = htmlData.match(re);
                        if(index >=0) {
                            if(index)
                                ary.push(htmlData.substring(0, index));

                            ary.push(htmlData.substring(index, index + arrMactches[0].length));

                            htmlData =htmlData.substring(index + arrMactches[0].length);
                        }
                        else {
                            ary.push(htmlData);
                            htmlData ="";
                        }
                    }

                    return ary;
                },

                /**
                 * 富文本数组包装为rich_info json格式字符串
                 * @param ary {Array} 值为字符串的数组,html2ArraySplitByImgTag()函数拆分后的多个字符串块
                 * @param appname {string} 资源服务名称
                 * @returns {string} rich_info json格式字符串
                 */
                richArray2Json: function (ary, appname) {
                    var rich_info =[];
                    rich_info.push('{');
                    for(var i=0;i <ary.length;i++) {
                        if(ary[i].indexOf('<img')>-1 || ary[i].indexOf('<IMG')>-1) {
                            var src =$(ary[i]).attr("src");
                            rich_info.push(['"res":"',
                               // $(ary[i]).attr("resid"),
                                this.getQueryStringRegExp(src, "resid"),
                                ';',
                                //$(ary[i]).attr("server"),
                                this.getServerName(src),
                                ';',
                                //$(ary[i]).attr("appname"),
                                appname,
                                '"'
                            ].join(""));
                        } else {
                            var content =ary[i];
                            var obj = $("<div></div>");
                            obj.html(content);
                            rich_info.push('"text":'+$.toJSON(obj.text()));
                        }

                        if(i<ary.length-1)
                            rich_info.push(",");
                    }
                    rich_info.push('}');

                    return rich_info.join("");
                }
            }
        );
    })(jQuery, window);
});
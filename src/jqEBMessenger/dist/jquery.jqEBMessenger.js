/*
 * jqEBMessenger
 * https://github.com/Administrator/jqEBMessenger
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */


;(function($, window, undefined) {


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

/*
 *  base64.js,v 2.12 2013/05/06 07:54:20
 *
 *  Licensed under the MIT license.
 *    http://opensource.org/licenses/mit-license
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */

    (function (global, window) {
        //
        // existing version for noConflict()
        var _Base64 = global.Base64;
        var version = "2.1.4";
        // if node.js, we use Buffer
        var buffer;
        if (typeof module !== 'undefined' && module.exports) {
            buffer = require('buffer').Buffer;
        }
        // constants
        var b64chars
            = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var b64tab = function (bin) {
            var t = {};
            for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
            return t;
        }(b64chars);
        var fromCharCode = String.fromCharCode;
        // encoder stuff
        var cb_utob = function (c) {
            var cc;
            if (c.length < 2) {
                cc = c.charCodeAt(0);
                return cc < 0x80 ? c
                    : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                    + fromCharCode(0x80 | (cc & 0x3f)))
                    : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                    + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                    + fromCharCode(0x80 | ( cc & 0x3f)));
            } else {
                cc = 0x10000
                    + (c.charCodeAt(0) - 0xD800) * 0x400
                    + (c.charCodeAt(1) - 0xDC00);
                return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                    + fromCharCode(0x80 | ( cc & 0x3f)));
            }
        };
        var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        var utob = function (u) {
            return u.replace(re_utob, cb_utob);
        };
        var cb_encode = function (ccc) {
            var padlen = [0, 2, 1][ccc.length % 3],
                ord = ccc.charCodeAt(0) << 16
                    | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                    | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
                chars = [
                    b64chars.charAt(ord >>> 18),
                    b64chars.charAt((ord >>> 12) & 63),
                        padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                        padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
                ];
            return chars.join('');
        };
        var btoa = global.btoa ? function (b) {
            return global.btoa(b);
        } : function (b) {
            return b.replace(/[\s\S]{1,3}/g, cb_encode);
        };
        var _encode = buffer
                ? function (u) {
                return (new buffer(u)).toString('base64')
            }
                : function (u) {
                return btoa(utob(u))
            }
            ;
        var encode = function (u, urisafe) {
            return !urisafe
                ? _encode(u)
                : _encode(u).replace(/[+\/]/g, function (m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
        };
        var encodeURI = function (u) {
            return encode(u, true)
        };
        // decoder stuff
        var re_btou = new RegExp([
            '[\xC0-\xDF][\x80-\xBF]',
            '[\xE0-\xEF][\x80-\xBF]{2}',
            '[\xF0-\xF7][\x80-\xBF]{3}'
        ].join('|'), 'g');
        var cb_btou = function (cccc) {
            switch (cccc.length) {
                case 4:
                    var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                            | ((0x3f & cccc.charCodeAt(1)) << 12)
                            | ((0x3f & cccc.charCodeAt(2)) << 6)
                            | (0x3f & cccc.charCodeAt(3)),
                        offset = cp - 0x10000;
                    return (fromCharCode((offset >>> 10) + 0xD800)
                        + fromCharCode((offset & 0x3FF) + 0xDC00));
                case 3:
                    return fromCharCode(
                            ((0x0f & cccc.charCodeAt(0)) << 12)
                            | ((0x3f & cccc.charCodeAt(1)) << 6)
                            | (0x3f & cccc.charCodeAt(2))
                    );
                default:
                    return  fromCharCode(
                            ((0x1f & cccc.charCodeAt(0)) << 6)
                            | (0x3f & cccc.charCodeAt(1))
                    );
            }
        };
        var btou = function (b) {
            return b.replace(re_btou, cb_btou);
        };
        var cb_decode = function (cccc) {
            var len = cccc.length,
                padlen = len % 4,
                n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
                    | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
                    | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0)
                    | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
                chars = [
                    fromCharCode(n >>> 16),
                    fromCharCode((n >>> 8) & 0xff),
                    fromCharCode(n & 0xff)
                ];
            chars.length -= [0, 0, 2, 1][padlen];
            return chars.join('');
        };
        var atob = global.atob ? function (a) {
            return global.atob(a);
        } : function (a) {
            return a.replace(/[\s\S]{1,4}/g, cb_decode);
        };
        var _decode = buffer
            ? function (a) {
            return (new buffer(a, 'base64')).toString()
        }
            : function (a) {
            return btou(atob(a))
        };
        var decode = function (a) {
            return _decode(
                a.replace(/[-_]/g, function (m0) {
                    return m0 == '-' ? '+' : '/'
                })
                    .replace(/[^A-Za-z0-9\+\/]/g, '')
            );
        };
        var noConflict = function () {
            var Base64 = global.Base64;
            global.Base64 = _Base64;
            return Base64;
        };
        // export Base64
        global.Base64 = {
            VERSION: version,
            atob: atob,
            btoa: btoa,
            fromBase64: decode,
            toBase64: encode,
            utob: utob,
            encode: encode,
            encodeURI: encodeURI,
            btou: btou,
            decode: decode,
            noConflict: noConflict
        };
        // if ES5 is available, make Base64.extendString() available
        if (typeof Object.defineProperty === 'function') {
            var noEnum = function (v) {
                return {value: v, enumerable: false, writable: true, configurable: true};
            };
            global.Base64.extendString = function () {
                Object.defineProperty(
                    String.prototype, 'fromBase64', noEnum(function () {
                        return decode(this)
                    }));
                Object.defineProperty(
                    String.prototype, 'toBase64', noEnum(function (urisafe) {
                        return encode(this, urisafe)
                    }));
                Object.defineProperty(
                    String.prototype, 'toBase64URI', noEnum(function () {
                        return encode(this, true)
                    }));
            };
        }
        // that's it!
    })(jQuery, window);



    (function ($, window) {
        //创建恩布互联的命名空间
        $.extend({
            jqEBMessenger: {
                options: {
                    IFRAME_DEBUG: false,    //显示iframe调试窗口
                    MAX_RETRY_TIMES: 5, //最大重试次数
                    HTTP_PREFIX: "http://", //http访问前缀
                    DOMAIN_URL: "test-lc.entboost.com", //主服务器URL
                    TIMEOUT: 8000, //访问超时时间 (毫秒)
                    MAX_RELOGON_TIMES: 20, //最大重登次数限制
                    MAX_RELOADCHAT_TIMES: 200 //最大会话重连次数限制
                }
            }
        });
        //创建一个外部使用的命名空间
        $.ebMsg = {};

        //暴露外部使用的配置文件
        $.ebMsg.options = $.jqEBMessenger.options;

        if(!$.jqEBMessenger.fn)
            $.jqEBMessenger.fn ={};

    })(jQuery, window);


    (function ($, window) {
        window.IfrMessenger = (function () {

            // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
            var prefix = "eb_messenger",
                supportPostMessage = 'postMessage' in window;

            // Target 类, 消息对象
            function Target(target, name) {
                var errMsg = '';
                if (arguments.length < 2) {
                    errMsg = 'target error - target and name are both requied';
                } else if (typeof target != 'object') {
                    errMsg = 'target error - target itself must be window object';
                } else if (typeof name != 'string') {
                    errMsg = 'target error - target name must be string type';
                }
                if (errMsg) {
                    throw new Error(errMsg);
                }
                this.target = target;
                this.name = name;
            }

            // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
            if (supportPostMessage) {
                // IE8+ 以及现代浏览器支持
                Target.prototype.send = function (msg) {
                    this.target.postMessage(prefix + msg, '*');
                };
            } else {
                // 兼容IE 6/7
                Target.prototype.send = function (msg) {
                    var targetFunc = window.navigator[prefix + this.name];
                    if (typeof targetFunc == 'function') {
                        targetFunc(prefix + msg, window);
                    } else {
                        throw new Error("target callback function is not defined");
                    }
                };
            }

            // 信使类
            function IfrMessenger(name) {
                this.targets = {};
                this.name = name;
                this.listenFunc = [];
                this.initListen();
            }

            // 添加一个消息对象
            IfrMessenger.prototype.addTarget = function (target, name) {
                var targetObj = new Target(target, name);
                this.targets[name] = targetObj;
            };

            // 初始化消息监听
            IfrMessenger.prototype.initListen = function () {
                var self = this;
                var generalCallback = function (msg) {
                    if (typeof msg == 'object' && msg.data) {
                        msg = msg.data;
                    }
                    // 剥离消息前缀
                    msg = msg.slice(prefix.length);
                    for (var i = 0; i < self.listenFunc.length; i++) {
                        self.listenFunc[i](msg);
                    }
                };

                if (supportPostMessage) {
                    if ('addEventListener' in document) {
                        window.addEventListener('message', generalCallback, false);
                    } else if ('attachEvent' in document) {
                        window.attachEvent('onmessage', generalCallback);
                    }
                } else {
                    // 兼容IE 6/7
                    window.navigator[prefix + this.name] = generalCallback;
                }
            };

            // 监听消息
            IfrMessenger.prototype.listen = function (callback) {
                this.listenFunc.push(callback);
            };
            //注销监听
            IfrMessenger.prototype.clear = function () {
                this.listenFunc = [];
            };
            // 广播消息
            IfrMessenger.prototype.send = function (msg) {
                var targets = this.targets,
                    target;
                for (target in targets) {
                    if (targets.hasOwnProperty(target)) {
                        targets[target].send(msg);
                    }
                }
            };

            return IfrMessenger;
        })();

    })(jQuery, window);



    (function($, window) {
        var jqEBM = $.jqEBMessenger;

        //客户端信息
        $.extend(jqEBM, { clientInfo: {
            user_type: '',
            logon_type: '',
            um_url: '',
            um_appname: '',
            my_account: '',
            my_uid: 0,
            my_um_online_key: '',
            acm_key: '',
            username: '',
            description: '',
            setting: '',
            default_member_code: '',

            //um在线状态
            line_state: 0,
            //加载组织架构状态：0=未加载，-1=加载中，1=加载完毕
//            loadorg_state: 0,
            //标记是否有给出重call的链接
//            recall_flag: false,


            //被另外登录踢下线
            tickoff: false,

            //重置
            reset: function () {
                this.user_type = '';
                this.logon_type = '';
                this.um_url = '';
                this.um_appname = '';
                //		this.my_account ='';
                //		this.my_uid =0;
                this.my_um_online_key = '';
                //		this.acm_key ='';
                this.username = '';
                this.description = '';
                this.setting = '';
                this.default_member_code = '';

                this.line_state = 0;
                //this.loadorg_state =0;

                this.tickoff = false;
                }
            }
        });

        //自增ID
        $.extend(jqEBM, {staticId :1});

        jqEBM.generateId = function() {
            jqEBM.staticId++;
            return jqEBM.staticId;
        };

        //跨域请求参数缓存
        jqEBM.hashMap = {};

        //api对照表
        jqEBM.apiMap = {
            "ebweblc.logonvisitor": 1,
            "ebweblc.logonaccount": 2,
            "ebwebum.online": 11,
            "ebwebum.offline": 12,
            "ebwebum.callaccount": 13,
            "ebwebum.hb": 14,
            "ebwebum.loadcontact": 15,
            "ebwebum.loadorg": 16,
            "ebwebum.loadinfo": 17,
            "ebwebum.hangup": 18,
            "ebwebcm.enter": 21,
            "ebwebcm.exit": 22,
            "ebwebcm.sendtext": 23,
            "ebwebcm.sendrich": 24,
            "ebwebcm.sendfile": 25,
            "ebwebcm.hb": 26
        };

        //uid与call_id关系表(只针对于非群组)
        jqEBM.uidCallidMap = {};

        //账号信息
        jqEBM.createAccountInfo = function (uid) {
                var accountInfo = {};
                accountInfo.uid = uid;
                accountInfo.from_account = "";
                accountInfo.mobile = "";
                accountInfo.fInfo = {
                    type: -1,
                    empCode: "",
                    name: "",
                    mobile: "",
                    telphone: "",
                    email: "",
                    title: "",
                    departmentName: "",
                    entpriseName: ""
                };
                return accountInfo;
        };

        //accountInfo对照表,uid是主键
        jqEBM.accountInfoMap = {};

        //会话信息
        jqEBM.createCallInfo = function () {
                var callInfo = {
                    call_id: 0,
                    accounts: {},
                    //[{uid:123, offline:true, incall:true, becalling:false}] incall等于true表示在会话中，becalling表示正在被呼叫(callaccount)
                    group_code: 0,
                    //state ='unknown';
                    cm_url: '',
                    cm_appname: '',
                    chat_id: 0,
                    chat_key: '',
                    hangup: false, //会话已被注销
                    create_time: new Date(),
                    call_key: null, //呼叫来源KEY，实现企业被呼叫限制

                    /**
                     * 取会话中第一个人员账号信息
                     */
                    firstAccount: function () {
                        for (var uid in callInfo.accounts) {
                            return callInfo.accounts[uid];
                        }
                    },

                    getUids: function () {
                        var uids =[];
                        for (var uid in callInfo.accounts) {
                            uids.push(uid);
                        }
                        return uids;
                    },

                    getAccounts: function () {
                        return callInfo.accounts;
                    }
                };
                return callInfo;
            };

        //会话对照表
        jqEBM.chatMap = {
            callInfoByChatId: function (chat_id) {
                if (!chat_id)
                    return null;
                var list = this.names();
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        var callInfo = this[list[i]];
                        if (callInfo.chat_id && callInfo.chat_id == chat_id)
                            return callInfo;
                    }
                }

                return null;
            },
            names: function () {
                var list = [];
                var i = 0;
                for (var key in this) {
                    if (key != 'names' && key != 'callInfoByChatId') {
                        list[i] = key;
                        i++;
                    }
                }
                return list;
            }
        };

        //um连接缓存表关键名
        jqEBM.UM_CONNECTMAP_KEY_PREFIX = "ebwebum.hb_";
            //cm连接缓存表关键名
        jqEBM.CM_CONNECTMAP_KEY_PREFIX = "ebwebcm.hb_";
        //连接缓存表
        jqEBM.connectMap = {
            increase: function (key) {//value增长1
                if (!this[key]) {
                    this[key] = 1;
                } else {
                    this[key]++;
                }
                //text_area_log("increase, [" + key + "]=" + this[key]);
            },
            reduce: function (key) {//value减少1
                if (this[key]) {
                    this[key]--;
                }
               // text_area_log("reduce, [" + key + "]=" + this[key]);
            }
        };

        //msg code对照表
        jqEBM.msgcodeMap = {
            "EB_WM_LOGON_SUCCESS": 267, //10B online成功
            "EB_WM_ONLINE_ANOTHER_UM": 270, //同账号在另外一个客户端登录UM
            "EB_WM_ONLINE_ANOTHER_CM": 4402,  //同账号在另外一个客户端登录CM
            "EB_WM_LOGOUT": 271,
            "EB_WM_CALL_INCOMING": 513,
            "EB_WM_CALL_ALERTING": 514,
            "EB_WM_CALL_BUSY": 515,
            "EB_WM_CALL_HANGUP": 516,
            "EB_WM_CALL_ERROR": 517,
            "EB_WM_CALL_CONNECTED": 518,
            "CR_WM_ENTER_ROOM": 4353,  //本端cm_enter返回事件
            "CR_WM_EXIT_ROOM": 4354,  //本端cm_exit返回事件
            "CR_WM_USER_ENTER_ROOM": 4355, //对方cm_enter返回事件
            "CR_WM_USER_EXIT_ROOM": 4356, //对方cm_exit返回事件
            "CR_WM_SEND_RICH": 4369, //发送富文本信息返回事件
            "CR_WM_RECEIVE_RICH":4370, //接收到富文本信息
            "CR_WM_SENDING_FILE": 4371, //发送离线文件到服务器消息
            "CR_WM_SENT_FILE": 4372, //对方接收文件成功
            "CR_WM_CANCEL_FILE": 4373 //对方拒绝或取消接收文件
        };

        //state code对照表
        jqEBM.statecodeMap = {
            "EB_STATE_OK": 0,
            "EB_STATE_TIMEOUT_ERROR": 5,
            "EB_STATE_USER_BUSY": 8,
            "EB_STATE_UNAUTH_ERROR": 11,
            "EB_STATE_PARAMETER_ERROR": 15,
            "EB_STATE_FILE_ALREADY_EXIST": 18,
            "EB_STATE_FILE_BIG_LONG": 19,
            "EB_STATE_ACCOUNT_NOT_EXIST": 20,
            "EB_STATE_NO_UM_SERVER": 60
        };

        //upload_attachment缓存
        jqEBM.uploadAttachmentMap = {};

        //callAccount 回调函数缓存
        jqEBM.callAccountHandleMap = {};

        //图片mime type对照表
        jqEBM.pictureMimeTypeMap = {
            "image/gif": 1,
            "image/jpeg": 1,
            "image/pjpeg": 1,
            "image/bmp": 1,
            "image/png": 1,
            "image/x-png": 1
        };

        //api版本号
        jqEBM.API_VERSION = "01";
        //静态资源版本号
        jqEBM.STATIC_VERSION = "2014060601";
        //跨域调用引擎回调前缀
        jqEBM.MESSAGE_CALLBACK_PREFIX = 'callback_';
        //聊天服务名称
        jqEBM.APPNAME_CM = "POPChatManager";

    })(jQuery, window);

/**
 * jQuery JSON plugin 2.4.0
 *
 * @author Brantley Harris, 2009-2011
 * @author Timo Tijhof, 2011-2014
 * @source This plugin is heavily influenced by MochiKit's serializeJSON, which is
 *         copyrighted 2005 by Bob Ippolito.
 * @source Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 *         website's http://www.json.org/json2.js, which proclaims:
 *         "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 *         I uphold.
 * @license MIT License <http://opensource.org/licenses/MIT>
 */
(function ($) {
	

	var escape = /["\\\x00-\x1f\x7f-\x9f]/g,
		meta = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"': '\\"',
			'\\': '\\\\'
		},
		hasOwn = Object.prototype.hasOwnProperty;

	/**
	 * jQuery.toJSON
	 * Converts the given argument into a JSON representation.
	 *
	 * @param o {Mixed} The json-serializable *thing* to be converted
	 *
	 * If an object has a toJSON prototype, that will be used to get the representation.
	 * Non-integer/string keys are skipped in the object, as are keys that point to a
	 * function.
	 *
	 */
	$.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function (o) {
		if (o === null) {
			return 'null';
		}

		var pairs, k, name, val,
			type = $.type(o);

		if (type === 'undefined') {
			return undefined;
		}

		// Also covers instantiated Number and Boolean objects,
		// which are typeof 'object' but thanks to $.type, we
		// catch them here. I don't know whether it is right
		// or wrong that instantiated primitives are not
		// exported to JSON as an {"object":..}.
		// We choose this path because that's what the browsers did.
		if (type === 'number' || type === 'boolean') {
			return String(o);
		}
		if (type === 'string') {
			return $.quoteString(o);
		}
		if (typeof o.toJSON === 'function') {
			return $.toJSON(o.toJSON());
		}
		if (type === 'date') {
			var month = o.getUTCMonth() + 1,
				day = o.getUTCDate(),
				year = o.getUTCFullYear(),
				hours = o.getUTCHours(),
				minutes = o.getUTCMinutes(),
				seconds = o.getUTCSeconds(),
				milli = o.getUTCMilliseconds();

			if (month < 10) {
				month = '0' + month;
			}
			if (day < 10) {
				day = '0' + day;
			}
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			if (milli < 100) {
				milli = '0' + milli;
			}
			if (milli < 10) {
				milli = '0' + milli;
			}
			return '"' + year + '-' + month + '-' + day + 'T' +
				hours + ':' + minutes + ':' + seconds +
				'.' + milli + 'Z"';
		}

		pairs = [];

		if ($.isArray(o)) {
			for (k = 0; k < o.length; k++) {
				pairs.push($.toJSON(o[k]) || 'null');
			}
			return '[' + pairs.join(',') + ']';
		}

		// Any other object (plain object, RegExp, ..)
		// Need to do typeof instead of $.type, because we also
		// want to catch non-plain objects.
		if (typeof o === 'object') {
			for (k in o) {
				// Only include own properties,
				// Filter out inherited prototypes
				if (hasOwn.call(o, k)) {
					// Keys must be numerical or string. Skip others
					type = typeof k;
					if (type === 'number') {
						name = '"' + k + '"';
					} else if (type === 'string') {
						name = $.quoteString(k);
					} else {
						continue;
					}
					type = typeof o[k];

					// Invalid values like these return undefined
					// from toJSON, however those object members
					// shouldn't be included in the JSON string at all.
					if (type !== 'function' && type !== 'undefined') {
						val = $.toJSON(o[k]);
						pairs.push(name + ':' + val);
					}
				}
			}
			return '{' + pairs.join(',') + '}';
		}
	};

	/**
	 * jQuery.evalJSON
	 * Evaluates a given json string.
	 *
	 * @param str {String}
	 */
	$.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (str) {
		/*jshint evil: true */
		return eval('(' + str + ')');
	};

	/**
	 * jQuery.secureEvalJSON
	 * Evals JSON in a way that is *more* secure.
	 *
	 * @param str {String}
	 */
	$.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (str) {
		var filtered =
			str
			.replace(/\\["\\\/bfnrtu]/g, '@')
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
			.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

		if (/^[\],:{}\s]*$/.test(filtered)) {
			/*jshint evil: true */
			return eval('(' + str + ')');
		}
		throw new SyntaxError('Error parsing JSON, source is not valid.');
	};

	/**
	 * jQuery.quoteString
	 * Returns a string-repr of a string, escaping quotes intelligently.
	 * Mostly a support function for toJSON.
	 * Examples:
	 * >>> jQuery.quoteString('apple')
	 * "apple"
	 *
	 * >>> jQuery.quoteString('"Where are we going?", she asked.')
	 * "\"Where are we going?\", she asked."
	 */
	$.quoteString = function (str) {
		if (str.match(escape)) {
			return '"' + str.replace(escape, function (a) {
				var c = meta[a];
				if (typeof c === 'string') {
					return c;
				}
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + str + '"';
	};

}(jQuery));


    /**
     * Created by nick on 2014/5/24.
     */
    (function ($, window) {
        var jqEBM =$.jqEBMessenger;

        //当前已重登次数
        jqEBM.current_relogon_times = 0;
        //当前会话已重连次数
        jqEBM.current_reloadchat_times = 0;
        //当前浏览器类型
        jqEBM.AGENT = window.navigator.userAgent.toLowerCase();

        //跨域接收器定义
        var ifrMessenger =window.ifrMessenger = new  window.IfrMessenger('parent');
        ifrMessenger.listen(function (jsonString) {
            var jsonMsg = $.evalJSON(jsonString);
            var req = jqEBM.hashMap[jsonMsg.tag.toString()];

//      if(req.api!=apiMap.get("ebwebum.loadorg")) {//loadorg返回信息信息太多，不详细打印
//          text_area_log("client server return=========\n"+jsonString);
//      } else {//打印loadorg简要信息
            text_area_log("client server return tag:"+jsonMsg.tag+", status:"+jsonMsg.status);
//      }

            if(jsonMsg.status =='success') {
                if(req.pv)
                    req.pv = $.Base64.decode(req.pv);
                if(!jsonMsg.data) {
                    text_area_log("服务器返回空数据，tag="+jsonMsg.tag+", url="+req.url+", req.pv:\n"+req.pv);
                }
                jqEBM.prc.processReceiveData(req, jsonMsg.data?$.Base64.decode(jsonMsg.data):null);
            }
            else {
                text_area_log("网络错误，"+$.toJSON(jsonMsg.xhr));
                jqEBM.prc.processNetworkError(req);
                var errorCallback =jqEBM.hashMap[jqEBM.MESSAGE_CALLBACK_PREFIX+jsonMsg.tag];
                if(errorCallback)
                    errorCallback($.jqEBMessenger.errCodeMap.NETWORK_ERROR);
            }

            delete jqEBM.hashMap[req.tag] ;
            delete jqEBM.hashMap[jqEBM.MESSAGE_CALLBACK_PREFIX + jsonMsg.tag];
        });

        /**
         * 发送跨域指令
         * @param api
         * @param url
         * @param parameter
         * @param parameterJson2kv
         * @param timeout
         * @param errorCallback
         * @returns {Boolean}
         */
        ifrMessenger.sendMessage =function(api, url, parameter, parameterJson2kv, timeout, errorCallback) {
            var tag = jqEBM.generateId();
            var jsonMsg ={
                api: api,
                url: url,
                tag: tag,
                timeout: timeout=='undefined'?jqEBM.options.TIMEOUT:timeout,
                submitType: 'POST',
                json2kv:(parameterJson2kv==null)?true:parameterJson2kv,
                //pv: $.parseJSON(BASE64.encoder(parameter))
                pv: parameter? $.Base64.encode(parameter):null
            };

            jqEBM.hashMap[tag] = jsonMsg;
            if(errorCallback) {
                jqEBM.hashMap[jqEBM.MESSAGE_CALLBACK_PREFIX + tag] = errorCallback;
            }

            text_area_log("send=========\n"+$.toJSON(jsonMsg));
            text_area_log("pv:\n"+parameter);
            var iframe_name =jqEBM.fn.domainURI(url);
            //text_area_log('iframe_name:'+iframe_name);
            ifrMessenger.targets[iframe_name].send($.toJSON(jsonMsg));
        };
    })(jQuery, window);


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


    /**
     * jquery EB CM相关功能函数
     * @version v1.0
     * @createDate -- 2014-2-28
     * @author nick
     * @requires jQuery v1.8 later
     **/
    (function ($, window) {
        var ifrMessenger = window.ifrMessenger;
        var jqEBM =$.jqEBMessenger;
        var EBCM =jqEBM.EBCM = {};
        var fn =jqEBM.fn;

        /**
         * 访问CM心跳动作
         * @param cm_url CM {string} http访问地址
         * @param chat_id {string} 聊天id
         */
        EBCM.ebwebcm_hb = function (cm_url, chat_id) {
            var key = jqEBM.CM_CONNECTMAP_KEY_PREFIX + fn.createRestUrl(cm_url, jqEBM.API_VERSION, "ebwebcm.hb");
            text_area_log("connectMap[" + key + "]=" + jqEBM.connectMap[key]);
            if (!jqEBM.connectMap[key] || jqEBM.connectMap[key] === 0) {//限制一个服务只有一个um长连接
                jqEBM.connectMap.increase(key);

                var parameter = {
                    chat_id: chat_id
                };
                ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.hb"]
                    , jqEBM.fn.createRestUrl(cm_url, jqEBM.API_VERSION, "ebwebcm.hb")
                    , $.toJSON(parameter)
                    , true
                    , 40000);//40秒超时
            } else {
                text_area_log(key + ",只允许一个长连接");
            }
        };

        /**
         * 发送富文本消息
         * @param call_id  {string} 会话编号
         * @param to_uid {int} 对方uid；(群组会话时)指定和某一人对话(注意这里并不表示私聊)，空值表示和全部人说话
         * @param isPrivate {boolean} 是否私聊
         * @param rich_info {string} json格式的富文本消息
         * @param successCallback {function} 发送成功回调函数
         * @param failureCallback {function} 发送失败回调函数
         * @returns {string} 执行状态
         */
        EBCM.ebwebcm_sendrich = function (callInfo, to_uid, isPrivate, rich_info, successCallback, failureCallback) {
            var parameterStr = [
                '{',
                '"chat_id":',
                callInfo.chat_id,
                ', "private":',
                isPrivate ? 1 : 0,
                ', "rich_info":',
                rich_info
            ].join("");
            if (to_uid) {
                parameterStr = parameterStr + ', "to_uid":' + to_uid;
            }

            parameterStr = parameterStr + "}";

            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.sendrich"]
                , jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.sendrich")
                , parameterStr
                , false
                , null
                , function(state, param) {
                    if(state==jqEBM.errCodeMap.OK) {
                       if(successCallback) successCallback();
                    } else {
                       if(failureCallback) failureCallback(state);
                    }
                });
        };

        /**
         * 进入聊天会话
         * @param call_id {string} 会话编号
         */
        EBCM.ebwebcm_enter = function (call_id) {
            //		text_area_log('ebwebcm_enter call_id='+call_id);
            if (!call_id) {
                text_area_log("ebwebcm_enter call_id is null");
                return;
            }

            //通过call_id在本地查找call_info信息
            var callInfo = jqEBM.chatMap[call_id];
            if (!callInfo) {
                text_area_log("ebwebcm_enter not found callInfo for call_id=" + call_id);
                return;
            }
            text_area_log('ebwebcm_enter==>callInfo:\n' + $.toJSON(callInfo));

            //填充参数值
            var parameter = {
                logon_type: jqEBM.clientInfo.logon_type,
                from_uid: jqEBM.clientInfo.my_uid,
//			account: jqEBM.clientInfo.my_account,
                chat_id: callInfo.chat_id,
                chat_key: callInfo.chat_key,
                call_id: callInfo.call_id,
                appname: callInfo.cm_appname
            };

            if (callInfo.group_code == "0") {//非群组/非对方会话才填入离线用户参数
                var account = callInfo.firstAccount();
                if (account.offline) {
                    parameter.off_uid = account.uid;
                }
            }

            if (callInfo.group_code) {
                parameter.group_code = callInfo.group_code;
            }

            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.enter"],
                jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.enter"),
                $.toJSON(parameter));
        };

        /**
         * 结束会话
         * @param call_id {int} 会话编号
         */
        EBCM.ebwebcm_exit = function (call_id) {
            if (!call_id) {
                text_area_log("ebwebcm_exit call_id is 0");
                return;
            }

            var callInfo = jqEBM.chatMap[call_id];

            if (!callInfo) {
                text_area_log('ebwebcm_exit, callInfo not found, call_id=' + call_id);
                return;
            }

            if (!callInfo.chat_id) {
                text_area_log('ebwebcm_exit, chat_id is 0, call_id=' + call_id);
                return;
            }

            var parameter = {
                chat_id: callInfo.chat_id
            };
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.exit"],
                jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.exit"),
                $.toJSON(parameter));
        };

        /**
         * 申请上传文件
         * @param chat_id
         * @param failureCallback
            */
        EBCM.ebwebcm_sendfile_apply = function (chat_id, failureCallback) {
            if (!chat_id) {
                text_area_log("ebwebcm_sendfile_apply chat_id is 0");
                return;
            }

            var callInfo = jqEBM.chatMap.callInfoByChatId(chat_id);

            if (!callInfo) {
                text_area_log('ebwebcm_sendfile_apply, callInfo not found, chat_id=' + chat_id);
                return;
            }

            var parameter = {
                chat_id: chat_id,
                apply: 1
            };
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.sendfile"],
                jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.sendfile"),
                $.toJSON(parameter),
                true,
                null,
                failureCallback);
        };


    })(jQuery, window);


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

/**
 * Created by nick on 2014/5/24.
 */



    /**
     * entboost messenger 内部功能函数
     */
    (function($, window) {
        var ifrMessenger = window.ifrMessenger;
        var jqEBM =$.jqEBMessenger;

        $.extend(jqEBM.fn, {
            /**
             * 截取域名并把点号换成下划线
             * @param url
             * @returns
             */
            domainURI: function(url) {
                //var durl=/http:\/\/([^\/]+)\//i;
                text_area_log("domainURI url=" + url);
                var domain = url.match('^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)');
                //text_area_log(domain);
                return domain[1].replace(/\./g, "_");
            },
            /**
             * 创建Rest Api 地址
             * @param serverUrl {string} 服务器地址
             * @param version {string} 版本号
             * @param apiName {string} Api名
             * @returns Rest api {string} URL地址
             */
            createRestUrl: function(serverUrl, version, apiName) {
                return [
                    serverUrl,
                    "/rest.",
                    "v",
                    version,
                    ".",
                    apiName
                ].join("");
            },
            /**
             * 执行iframe加载各不同域引擎页面
             * @param iframe1
             * @param domain_var
             * @param url
             * @param onloadCallback
             * @param timeoutHandler
             */
            execute_load_frame: function (iframe1, domain_var, url, onloadCallback, timeoutHandler) {
                this.iframeOnload(iframe1,
                    jqEBM.options.TIMEOUT, //timeout
                    function () { //sucess
                        //iframeMap.put(domain_var, iframe1);
                        $(iframe1).attr("state", "1");
                        ifrMessenger.addTarget(iframe1.contentWindow, domain_var);
                        text_area_log(domain_var + ' ==>iframe created.');
                        onloadCallback();
                    },
                    function () { //timeout
                        //$(iframe1).remove();
                        text_area_log("加载超时, " + url);
                        $(iframe1).attr("state", "0");
                        if (timeoutHandler)
                            timeoutHandler();
                });
                $(iframe1).attr("src", url);
            },
            //通过URL地址创建iframe,如存在则返回现成的
            create_iframe: function (url, onloadCallback, timeoutHandler) {
                var domain_var = this.domainURI(url);

                var iframe1 = $("#" + domain_var)[0];//iframeMap.get(domain_var);
                if (!iframe1) {
                    var iframe_str = [
                        "<iframe id='",
                        domain_var,
                        "' style='display:",
                        (jqEBM.options.IFRAME_DEBUG ? "block" : "none"),
                        ";width:800px;height:250px;'></iframe>"
                    ].join("");
                    $(iframe_str).prependTo('body');
                    iframe1 = $("#" + domain_var)[0];
                    this.execute_load_frame(iframe1, domain_var, url, onloadCallback, timeoutHandler);
                } else {
                    var state = $(iframe1).attr("state");
                    if (!state || state != "1") {//之前加载不成功
                        text_area_log("重新加载, " + url);
                        this.execute_load_frame(iframe1, domain_var, url, onloadCallback, timeoutHandler);
                    } else {
                        if (onloadCallback)
                            onloadCallback();
                    }
                }
            },
            //加载iframe，成功后调用约定回调函数
            //参数url: 访问地址
            //参数try_times: 第几次重试
            //参数callbackFun: 访问成功回调函数
            load_iframe: function (url, try_times, callbackFun) {
                text_area_log('try times=' + try_times + ', url:' + url);
                try_times++;
                this.create_iframe(url,
                    callbackFun,
                    function () {
                        text_area_log('load timeout url: ' + url);
                        if (try_times < jqEBM.options.MAX_RETRY_TIMES) //递归调用
                            jqEBM.fn.load_iframe(url, try_times, callbackFun);
                    });
            },
            //iframe加载完毕
            iframeOnload: function iframeOnload(iframe, timeout, onloadCallback, timeoutHandler) {
                var bTimeout =false;
                var kill = setTimeout(function(){
                    bTimeout =true;
                    timeoutHandler();
                }, timeout);
                if (iframe.attachEvent){
                    iframe.attachEvent("onload", function(){
                        if(bTimeout)
                            return;

                        clearTimeout(kill);
                        if(onloadCallback)
                            onloadCallback();
                    });
                } else {
                    iframe.onload = function() {
                        if(bTimeout)
                            return;

                        clearTimeout(kill);
                        if(onloadCallback)
                            onloadCallback();
                    };
                }
            }
        });
    })(jQuery, window);

/*!
 * jQuery Browser Plugin v0.0.6
 * https://github.com/gabceb/jquery-browser-plugin
 *
 * Original jquery-browser code Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * http://jquery.org/license
 *
 * Modifications Copyright 2013 Gabriel Cebrian
 * https://github.com/gabceb
 *
 * Released under the MIT license
 *
 * Date: 2013-07-29T17:23:27-07:00
 */

(function( jQuery, window, undefined ) {
  

  var matched, browser;

  jQuery.uaMatch = function( ua ) {
    ua = ua.toLowerCase();

  	var match = /(opr)[\/]([\w.]+)/.exec( ua ) ||
  		/(chrome)[ \/]([\w.]+)/.exec( ua ) ||
  		/(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
  		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
  		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
  		/(msie) ([\w.]+)/.exec( ua ) ||
  		ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
  		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
  		[];

  	var platform_match = /(ipad)/.exec( ua ) ||
  		/(iphone)/.exec( ua ) ||
  		/(android)/.exec( ua ) ||
  		/(windows phone)/.exec( ua ) ||
  		/(win)/.exec( ua ) ||
  		/(mac)/.exec( ua ) ||
  		/(linux)/.exec( ua ) ||
  		/(cros)/i.exec( ua ) ||
  		[];

  	return {
  		browser: match[ 3 ] || match[ 1 ] || "",
  		version: match[ 2 ] || "0",
  		platform: platform_match[ 0 ] || ""
  	};
  };

  matched = jQuery.uaMatch( window.navigator.userAgent );
  browser = {};

  if ( matched.browser ) {
  	browser[ matched.browser ] = true;
  	browser.version = matched.version;
  	browser.versionNumber = parseInt(matched.version, 10);
  }

  if ( matched.platform ) {
  	browser[ matched.platform ] = true;
  }

  // These are all considered mobile platforms, meaning they run a mobile browser
  if ( browser.android || browser.ipad || browser.iphone || browser[ "windows phone" ] ) {
  	browser.mobile = true;
  }

  // These are all considered desktop platforms, meaning they run a desktop browser
  if ( browser.cros || browser.mac || browser.linux || browser.win ) {
  	browser.desktop = true;
  }

  // Chrome, Opera 15+ and Safari are webkit based browsers
  if ( browser.chrome || browser.opr || browser.safari ) {
  	browser.webkit = true;
  }

  // IE11 has a new token so we will assign it msie to avoid breaking changes
  if ( browser.rv )
  {
  	var ie = "msie";

  	matched.browser = ie;
  	browser[ie] = true;
  }

  // Opera 15+ are identified as opr
  if ( browser.opr )
  {
  	var opera = "opera";

  	matched.browser = opera;
  	browser[opera] = true;
  }

  // Stock Android browsers are marked as Safari on Android.
  if ( browser.safari && browser.android )
  {
  	var android = "android";

  	matched.browser = android;
  	browser[android] = true;
  }

  // Assign the name and platform variable
  browser.name = matched.browser;
  browser.platform = matched.platform;


  jQuery.browser = browser;
})( jQuery, window );

    (function($, window) {
       var ajaxFU = $.ajaxFU = {};
       $.extend(ajaxFU, {
           createUploadIframe: function (id, uri) {
               //create frame
               var frameId = 'jUploadFrame' + id;

               var io = null;
               if (window.ActiveXObject) {
                   //fix ie9 and ie 10-------------
                   if ($.browser.version == "9.0" || $.browser.version == "10.0" || $.browser.version == "11.0") {
                       io = document.createElement('iframe');
                       io.id = frameId;
                       io.name = frameId;
                   } else if ($.browser.version == "6.0" || $.browser.version == "7.0" || $.browser.version == "8.0") {
                       io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');
                   }
               }
               else {
                   io = document.createElement('iframe');
                   io.id = frameId;
                   io.name = frameId;
               }

               if (typeof uri == 'boolean') {
                   io.src = 'javascript:false';
               }
               else if (typeof uri == 'string') {
                   io.src = uri;
               }

               io.style.position = 'absolute';
               io.style.top = '-1000px';
               io.style.left = '-1000px';

//            io.document.domain ="entboost.com";
//            alert(document.domain);
//            alert(io.document.domain);
//            alert(io.src);

               document.body.appendChild(io);

               return io;
           },
           createUploadForm: function (id, fileElementId, tag_name, tag_link, tag_sort, tag_status, tag_id) {
               //create form
               var formId = 'jUploadForm' + id;
               var fileId = 'jUploadFile' + id;
               //--
//        var tagNameId = 'tag_name' + id;  
//        var tagLinkId = 'tag_link' + id;  
//        var tagSortId = 'tag_sort' + id;  
//        var tagStatusId = 'tag_status' + id;  
//        var tagIdId = 'tag_id' + id;  
               //--end
               var form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
               var oldElement = $('#' + fileElementId);
               var newElement = $(oldElement).clone();
               //--
//        var tagNameElement = '<input type="text" name="tag_name" value="'+tag_name+'">';    
//        var tagLinkElement = '<input type="text" name="tag_link" value="'+tag_link+'">';  
//        var tagSortElement = '<input type="text" name="tag_sort" value="'+tag_sort+'">';  
//        var tagStatusElement = '<input type="text" name="tag_status" value="'+tag_status+'">';  
//        var tagIdElement = '<input type="text" name="tag_id" value="'+tag_id+'">';  
               //--end
               $(oldElement).attr('id', fileId);
               $(oldElement).before(newElement);
               $(oldElement).appendTo(form);
               //--
//        $(tagNameElement).appendTo(form);  
//        $(tagLinkElement).appendTo(form);  
//        $(tagSortElement).appendTo(form);  
//        $(tagStatusElement).appendTo(form);  
//        $(tagIdElement).appendTo(form);  
               //--end
               //set attributes
               $(form).css('position', 'absolute');
               $(form).css('top', '-1200px');
               $(form).css('left', '-1200px');
               $(form).appendTo('body');
               return form;
           },

           ajaxFileUpload: function (s) {
               // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
               s = $.extend({}, $.ajaxSettings, s);
               var id = new Date().getTime();
               ajaxFU.createUploadForm(id, s.fileElementId, s.tag_name, s.tag_link, s.tag_sort, s.tag_status, s.tag_id);
               ajaxFU.createUploadIframe(id, s.secureuri);
               var frameId = 'jUploadFrame' + id;
               var formId = 'jUploadForm' + id;
               // Watch for a new set of requests
               if (s.global && !($.active++)) {
                   $.event.trigger("ajaxStart");
               }
               var requestDone = false;
               // Create the request object
               var xml = {};
               if (s.global)
                   $.event.trigger("ajaxSend", [xml, s]);
               // Wait for a response to come back
               var uploadCallback = function (isTimeout) {
                   var io = document.getElementById(frameId);
                   var execontent = function () {
                       try {
                           if (io.contentWindow) {
                               xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                               xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
                           } else if (io.contentDocument) {
                               xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                               xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
                           }
                       } catch (e) {
                           ajaxFU.handleError(s, xml, null, e);
                       }
                       if (xml || isTimeout == "timeout") {
                           requestDone = true;
                           var status;
                           try {
                               status = isTimeout != "timeout" ? "success" : "error";
                               // Make sure that the request was successful or notmodified
                               if (status != "error") {
                                   // process the data (runs the xml through httpData regardless of callback)
                                   var data = ajaxFU.uploadHttpData(xml, s.dataType);
                                   // If a local callback was specified, fire it and pass it the data
                                   if (s.success) s.success(data, status);
                                   // Fire the global callback
                                   if (s.global) $.event.trigger("ajaxSuccess", [xml, s]);
                               } else ajaxFU.handleError(s, xml, status);
                           } catch (e) {
                               status = "error";
                               ajaxFU.handleError(s, xml, status, e);
                           }
                           // The request was completed
                           if (s.global) $.event.trigger("ajaxComplete", [xml, s]);
                           // Handle the global AJAX counter
                           if (s.global && !--$.active) $.event.trigger("ajaxStop");
                           // Process result
                           if (s.complete) s.complete(xml, status);
                           $(io).unbind();
                           setTimeout(function () {
                                   try {
                                       $(io).remove();
                                       $(form).remove();
                                   } catch (e) {
                                       ajaxFU.handleError(s, xml, null, e);
                                   }
                               },
                               100);
                           xml = null;
                       }
                   };
                   var crossdomain = !$.browser.msie || document.domain == location.hostname;
                   if (!crossdomain) {
                       io.src = "javascript:try{"
                           + "document.domain=window.location.hostname.split('.').reverse().slice(0,2).reverse().join('.');"
                           + "parent.document.getElementById('" + frameId + "').setAttribute('uploaded','uploaded');"
                           + "}catch(e){}";
                       var timer = window.setInterval(function () {
                           try {
                               if (io.getAttribute("uploaded") == "uploaded") {
                                   crossdomain = true;
                                   window.clearInterval(timer);
                                   execontent();
                               }
                           } catch (e) {
                           }
                       }, 1000);
                   } else {
                       execontent();
                   }
               };

               // Timeout checker
               if (s.timeout > 0) {
                   setTimeout(function () {
                       // Check to see if the request is still happening
                       if (!requestDone) uploadCallback("timeout");
                   }, s.timeout);
               }
               try {
                   //alert(document.domain);
                   // var io = $('#' + frameId);
                   var form = $('#' + formId);
                   $(form).attr('action', s.url);
                   $(form).attr('method', 'POST');
                   $(form).attr('target', frameId);
                   if (form.encoding) {
                       form.encoding = 'multipart/form-data';
                   }
                   else {
                       form.enctype = 'multipart/form-data';
                   }
                   $(form).submit();

               } catch (e) {
                   //alert(e);
                   ajaxFU.handleError(s, xml, null, e);
               }
               if (window.attachEvent) {
                   document.getElementById(frameId).attachEvent('onload', uploadCallback);
               }
               else {
                   document.getElementById(frameId).addEventListener('load', uploadCallback, false);
               }
               return {abort: function () {
               }};

           },

           uploadHttpData: function (r, type) {
               var data = !type;
               data = type == "xml" || data ? r.responseXML : r.responseText;
               // If the type is "script", eval it in global context
               if (type == "script")
                   $.globalEval(data);
               // Get the JavaScript object, if JSON is used.
               if (type == "json")
                   eval("data = " + data);
               // evaluate scripts within html
               if (type == "html")
                   $("<div>").html(data).evalScripts();
               //alert($('param', data).each(function(){alert($(this).attr('value'));}));
               return data;
           },

           // handleError 方法在jquery1.4.2之后移除了，此处重写改方法
           handleError: function (s, xhr, status, e) {
               // If a local callback was specified, fire it
               if (s.error) {
                   s.error.call(s.context || s, xhr, status, e);
               }

               // Fire the global callback
               if (s.global) {
                   (s.context ? $(s.context) : $.event).trigger("ajaxError", [xhr, s, e]);
               }
           }
       });
   })(jQuery, window);


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

/**
 * Created by nick on 2014/5/27.
 */


    /**
     * 事件回调类
     */
    (function ($, window) {
        var errCodeMap = $.ebMsg.errCodeMap = $.jqEBMessenger.errCodeMap = {

            getEntityByCode: function(code) {
               for(var name in this) {
                   if(this[name].code == code) {
                       return this[name];
                   }
               }
               return this["UNKNOWN"];
            },
            codeSeq:10000, //自定义code基数
            createEntity: function(msg) {
                return {
                    code: this.codeSeq++,
                    msg: msg
                };
            },

            NETWORK_ERROR: {code:-2, msg:"网络错误"},
            UNKNOWN: {code:-1, msg:"未知错误"},
            OK: {code:0, msg:"成功"},

            LOGON_FAILURE: {code:2, msg:"登录失败"},
            ONLINE_FAILURE: {code:3, msg:"设置在线失败"},
            OFFLINE_FAILURE: {code:4, msg:"下线失败"},
            TIMEOUT: {code:5, msg:"超时"},
            PARAMETER_ERROR: {code: 6, msg:"参数错误"},

            CALLACCOUNT_FAILURE: {code:11, msg:"呼叫对方失败"},
            CALLACCOUNT_NOT_EXIST: {code:12, msg:"被叫方不存在"},
            CALLACCOUNT_NO_RESPONSE: {code:13, msg:"对方没有应答"},
            CALLACCOUNT_REJECT: {code:14, msg:"对方拒绝通话"},

            CHAT_INVALID: {code:21, msg:"聊天会话失效，等待重新载入"},
            SESSION_INVALID: {code:22, msg:"当前用户会话失效，等待重登"},
            CALLID_INVALID: {code:23, msg:"填入的CallId不正确"},
            CALLID_NOT_EXIST: {code:24, msg:"CallId不存在"},
            NOBODY_IN_CALL: {code:25, msg:"会话中没有对话方"},
            CALL_NOT_READY: {code:26, msg:"会话没有准备好"},
            NOT_LOGON: {code:27, msg:"当前用户未登录"},

            CONTENT_TOO_LONG: {code: 30, msg:"内容过长"},
            SENDFILE_REQUEST_FAILURE: {code:31, msg:"请求发送文件失败"},
            UPLOAD_FILE_EMPTY: {code:32, msg:"没有指定上传文件"},
            UPLOAD_FILE_REJECT: {code:33, msg:"对方取消或拒绝接收文件"}

            //code=10000以上，自定义错误信息
        };

        $.ebMsg.eventHandle = $.jqEBMessenger.eventHandle =function() {
            function EventHandle() {
            }

            //表情资源加载完毕
            EventHandle.prototype.onLoadEmotions = function(emotions) {};
            //组织架构加载完毕
            EventHandle.prototype.onLoadEntArchitecture = function(entArchi) {};
            //个人群组加载完毕
            EventHandle.prototype.onLoadGroup = function(groups) {};
            //联系人加载完毕
            EventHandle.prototype.onLoadContact = function(contacts) {};

            //接收到信息
            EventHandle.prototype.onReceiveMessage = function (callInfo, accountInfo, richInfo) {};

            //聊天会话结束
            EventHandle.prototype.onTalkOver = function(callId) {};

            //服务器断线
            EventHandle.prototype.onDisconnect = function() {};

            //聊天会话ID变更
            EventHandle.prototype.onChangeCallId = function(existCallId, newCallId) {};

            //其它错误
            EventHandle.prototype.onError = function(error) {};

            return new EventHandle();
        }();

    })(jQuery, window);


    (function($, window) {
        var jqEBM = $.jqEBMessenger;
        if(!jqEBM.prc)
            jqEBM.prc ={};
        var processor = jqEBM.prc;
        var fn =jqEBM.fn;

        var clientInfo = jqEBM.clientInfo;
        var apiMap = jqEBM.apiMap;
        var chatMap = jqEBM.chatMap;
        var statecodeMap = jqEBM.statecodeMap;
        var msgcodeMap = jqEBM.msgcodeMap;
        var connectMap = jqEBM.connectMap;
        var uidCallidMap = jqEBM.uidCallidMap;
        var EBUM = jqEBM.EBUM;
        var EBCM = jqEBM.EBCM;
        var options = jqEBM.options;

        /**
         * 注册事件处理器
         * @param jqMsgEventHandle
         */
        jqEBM.registerEventHandle = function(jqMsgEventHandle) {
            this.eventHandle =jqMsgEventHandle;
        };

        processor.processNetworkError = function (req) {
            switch (req.api) {
                case apiMap["ebwebum.hb"]:
                    //当前心跳连接计数减少1
                    var um_key = options.UM_CONNECTMAP_KEY_PREFIX;
                    if (connectMap[um_key] && connectMap[um_key] > 0) {
                        connectMap.reduce(um_key);
                    }

                    if (clientInfo.line_state != String(0)) {
                        setTimeout("$.jqEBMessenger.EBUM.ebwebum_hb()", 2000);
                    }
                    break;
                case apiMap["ebwebcm.hb"]:
                    //当前心跳连接计数减少1
                    var cm_key = options.CM_CONNECTMAP_KEY_PREFIX + req.url;
                    if (connectMap[cm_key] && connectMap[cm_key] > 0) {
                        connectMap.reduce(cm_key);
                    }

                    if (req.pv) {
                        req.pv = $.Base64.decode(req.pv);
                        req.pv = $.evalJSON(req.pv);
                        var call_info = chatMap.callInfoByChatId(req.pv.chat_id);
                        if (call_info) {
                            setTimeout("$.jqEBMessenger.EBCM.ebwebcm_hb('" + call_info.cm_url + "','" + call_info.chat_id + "')", 2000);
                        }
                        else {
                            text_area_log("processNetworkError call_info not found for chat_id=" + req.pv.chat_id);
                            text_area_log("processNetworkError chatMap===\n" + $.toJSON(chatMap));
                        }
                    }
                    break;
            }
        };

        /**
         * 处理接收到的数据
         * @param req 请求参数
         * @param jsonString 结果数据
         */
        processor.processReceiveData = function (req, jsonString) {
            var jsonData = $.evalJSON(jsonString);
            if (req.api != apiMap["ebwebum.loadorg"])
                text_area_log("return pv:\n" + jsonString);
            else {
                text_area_log("loadorg 信息不打印");
            }

            var try_times = 0;//重试次数，必须定义变量
            var pv = null;
            var callInfo = null;
            var caKey = null;
            var callAccountHandle = null;
            var eventHandle = jqEBM.eventHandle;
            var errCodeMap = $.jqEBMessenger.errCodeMap;
            var callback =jqEBM.hashMap[jqEBM.MESSAGE_CALLBACK_PREFIX + req.tag];

            switch (req.api) {
                case apiMap["ebweblc.logonvisitor"]:
                    if (jsonData.code != statecodeMap["EB_STATE_OK"]) {
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.LOGON_FAILURE);

                        //处理code=60,待补充
                        break;
                    }
                    clientInfo.user_type = 'visitor';
                    clientInfo.logon_type = jsonData.logon_type;
                    clientInfo.um_url = options.HTTP_PREFIX + jsonData.url;
                    clientInfo.um_appname = jsonData.appname;
                    clientInfo.my_account = jsonData.account;
                    clientInfo.my_uid = jsonData.uid;
                    clientInfo.my_um_online_key = jsonData.online_key;
                    clientInfo.acm_key = jsonData.acm_key;
                    clientInfo.username = jsonData.username;
                    clientInfo.description = jsonData.description;
                    clientInfo.setting = jsonData.setting;
                    clientInfo.default_member_code = jsonData.default_member_code;

                    jqEBM.online(callback);
                    break;

                case apiMap["ebweblc.logonaccount"]:
                    if (jsonData.code != statecodeMap["EB_STATE_OK"]) {
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.LOGON_FAILURE);

                        //处理code=60,待补充
                        break;
                    }
                    clientInfo.user_type = 'normal';
                    clientInfo.logon_type = jsonData.logon_type;
                    clientInfo.um_url = options.HTTP_PREFIX + jsonData.url;
                    clientInfo.um_appname = jsonData.appname;
                    clientInfo.my_account = jsonData.account;
                    clientInfo.my_uid = jsonData.uid;
                    clientInfo.my_um_online_key = jsonData.online_key;
                    clientInfo.acm_key = jsonData.acm_key;
                    clientInfo.username = jsonData.username;
                    clientInfo.description = jsonData.description;
                    clientInfo.setting = jsonData.setting;
                    clientInfo.default_member_code = jsonData.default_member_code;

                    jqEBM.online(callback);
                    break;

                case apiMap["ebwebum.online"]:
                    if (jsonData.code != statecodeMap["EB_STATE_OK"]) {
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.ONLINE_FAILURE);
                        break;
                    }

                    pv = $.evalJSON(req.pv);

                    if (msgcodeMap['EB_WM_LOGON_SUCCESS'] == jsonData.msg) {
                        clientInfo.line_state = pv.line_state;

//                        if(callback)
//                            callback(errCodeMap.OK, clientInfo);

                        //加载组织架构
//                        if (clientInfo.loadorg_state == "0") {
//                            clientInfo.loadorg_state = -1;
                          EBUM.ebwebum_loadorg(callback);
//                        }

                        //um心跳
                        EBUM.ebwebum_hb();
                    }
                    break;

                case apiMap["ebwebum.offline"]:
                    if (jsonData.code != statecodeMap["EB_STATE_OK"]) {
                        text_area_log(jsonData.error);

                        if(callback)
                            callback(errCodeMap.OFFLINE_FAILURE);

                        break;
                    }

                    if (msgcodeMap['EB_WM_LOGOUT'] == jsonData.msg) {
                        text_area_log("下线成功");
                        clientInfo.line_state =0;
                        //重置属性
                        //clientInfo.reset();

                        if(callback)
                            callback(errCodeMap.OK);
                    }
                    break;

                case apiMap["ebwebum.callaccount"]:
                    if (jsonData.code == statecodeMap["EB_STATE_TIMEOUT_ERROR"]) {//timeout
                        //待定处理
                        //后台正常情况下不会出现
                        if(callback)
                            callback(errCodeMap.TIMEOUT);
                        break;
                    }

                    //对方用户账号不存在
                    if (jsonData.code == statecodeMap["EB_STATE_ACCOUNT_NOT_EXIST"]) {
                        if(callback)
                            callback(errCodeMap.CALLACCOUNT_NOT_EXIST);
                        break;
                    }

                    if (jsonData.code == statecodeMap["EB_STATE_PARAMETER_ERROR"]) {
                        if(callback)
                            callback(errCodeMap.PARAMETER_ERROR);
                        break;
                    }

                    if (!jsonData.call_info) {
                        text_area_log("系统返回call_info是空值");
                        if(callback)
                            callback(errCodeMap.createEntity("系统返回call_info是空值"));
                        break;
                    }

                    if (jsonData.error) {
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.CALLACCOUNT_FAILURE);
                        break;
                    }

                    //缓存当次回调函数

                    caKey = jsonData.call_info.call_id + "-" + jsonData.call_info.from_uid;
                    text_area_log("call account caKey = " + caKey);
                    jqEBM.callAccountHandleMap[caKey] = callback;
                    //对方正在被呼叫状态设置为否
                    jqEBM.updateAccountBecalling(jsonData.call_info.call_id, jsonData.call_info.from_uid, false);

                    if (msgcodeMap['EB_WM_CALL_ALERTING'] == jsonData.msg) {
                        this.processCallAlerting(req, jsonData);
                    }
                    break;

                case apiMap["ebwebum.loadcontact"]:

                    break;

                case apiMap["ebwebum.loadorg"]:
                    this.processLoadorg(jsonData);
     //               clientInfo.loadorg_state = 1;

                    //加载离线信息
                    EBUM.ebwebum_loadinfo(callback);

                    break;

                case apiMap["ebwebum.loadinfo"]:
                    this.processLoadinfo(req, jsonData);
                    if(callback)
                        callback(errCodeMap.OK, clientInfo);
                    break;

                case apiMap["ebwebum.hangup"]:
                    if (jsonData.error)
                        text_area_log(jsonData.error);
                    break;

                case apiMap["ebwebcm.enter"]://本客户端cm_enter
                    if (jsonData.code != statecodeMap["EB_STATE_OK"]) {
                        text_area_log(jsonData.error);
                        if(eventHandle)
                            eventHandle.onError(errCodeMap.createEntity("系统内部错误，cm_enter失败"));
                        break;
                    }

                    if (msgcodeMap['CR_WM_ENTER_ROOM'] == jsonData.msg) {
                        pv = $.evalJSON(req.pv);
                        callInfo = chatMap[pv.call_id];
                        EBCM.ebwebcm_hb(callInfo.cm_url, pv.chat_id);
                    }
                    break;

                case apiMap["ebwebcm.exit"]:
                    if (jsonData.code != statecodeMap["EB_STATE_OK"]) {
                        text_area_log(jsonData.error);
                        if(eventHandle)
                            eventHandle.onError(errCodeMap.createEntity("系统内部错误，cm_exit失败"));
                        break;
                    }

                    if (msgcodeMap['CR_WM_EXIT_ROOM'] == jsonData.msg) {
                        text_area_log("退出会话");
                        pv = $.evalJSON(req.pv);

                        callInfo = jqEBM.chatMap.callInfoByChatId(pv.chat_id);
                        this.processMyCMExit(callInfo.call_id);
                    }
                    break;

                case apiMap["ebwebcm.sendrich"]:
                    if (jsonData.error) {
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.createEntity(jsonData.error));
                    }

                    //chat_id error会话已失效
                    if (jsonData.code == statecodeMap["EB_STATE_UNAUTH_ERROR"]) {
                        text_area_log("ebwebcm.sendrich chat_id error, 即将尝试重新载入会话");
                        pv = $.evalJSON(req.pv);
                        callInfo = chatMap.callInfoByChatId(pv.chat_id);
                        jqEBM.reloadChat(callInfo.call_id, null, callInfo.call_key);

                        if(callback)
                            callback(errCodeMap.CHAT_INVALID);
                        break;
                    }

                    if (jsonData.code == statecodeMap["EB_STATE_OK"] && msgcodeMap["CR_WM_SEND_RICH"] == jsonData.msg) {
                        text_area_log('消息发送成功');
                        if(callback)
                            callback(errCodeMap.OK);
                    }
                    break;

                case apiMap["ebwebcm.sendfile"]://发送文件申请
                    if (jsonData.error) {
                        text_area_log(jsonData.error);
                        pv = $.evalJSON(req.pv);
                        callInfo = chatMap.callInfoByChatId(pv.chat_id);

                        if(callback)
                            callback(errCodeMap.SENDFILE_REQUEST_FAILURE);
                    }
                    break;

                case apiMap["ebwebum.hb"]:
                    //当前心跳连接计数减少1
                    var um_key = jqEBM.UM_CONNECTMAP_KEY_PREFIX;
                    text_area_log("processor connectMap[" + um_key + "]=" + connectMap[um_key]);
                    if (connectMap[um_key] && connectMap[um_key] > 0) {
                        connectMap.reduce(um_key);
                    }

                    //没有返回数据
                    if (!jsonData) {
                        text_area_log("um no return data");
                    }
//                    //有报错信息
//                    if (jsonData.error && jsonData.error != "timeout") {
//                        text_area_log("ebwebum.hb code=" + jsonData.code + ", error=" + jsonData.error);
//                        if(eventHandle)
//                            eventHandle.onError(errCodeMap.createEntity("um.hb error=" + jsonData.error));
//                    }

                    //sid uid error sessionid失效
                    if (jsonData.code == statecodeMap["EB_STATE_UNAUTH_ERROR"]) {
                        //用户session失效
                        text_area_log("sid uid error");
                        //jqEBM.reloadLogon();

                        if(eventHandle)
                            eventHandle.onDisconnect();
                        break;
                    }

                    //业务轮询结束返回，没有数据
                    if (jsonData.code == statecodeMap["EB_STATE_TIMEOUT_ERROR"]) {
                        //没有数据
                        if (jsonData.error == "timeout") {
                            text_area_log("um_hb 没有数据，长轮询断开");
                        }

                        //对方不应答
                        if (msgcodeMap['EB_WM_CALL_ERROR'] == jsonData.msg) {
                            text_area_log("um_hb 对方没有应答呼叫");
                            //$("#loading_message").append("<font color='red'>对方没有应答呼叫</font>");
                            //待补充
                            processor.processCallTimeout(req, jsonData);

                            caKey = jsonData.call_info.call_id + "-" + jsonData.call_info.from_uid;
                            text_area_log("umhb caKey = " + caKey);
                            callAccountHandle = jqEBM.callAccountHandleMap[caKey];
                            if(callAccountHandle)
                                callAccountHandle(errCodeMap.CALLACCOUNT_NO_RESPONSE);

                            delete jqEBM.callAccountHandleMap[caKey];
                        }
                    }

                    //call error 对方拒绝呼叫
                    if (jsonData.code == statecodeMap["EB_STATE_USER_BUSY"]) {
                        if (msgcodeMap['EB_WM_CALL_BUSY'] == jsonData.msg) {
                            text_area_log("对方拒绝呼叫");
                            //$("#loading_message").append("<font color='red'>对方拒绝呼叫</font>");
                            //待补充
                            processor.processCallReject(req, jsonData);

                            caKey = jsonData.call_info.call_id + "-" + jsonData.call_info.from_uid;
                            text_area_log("caKey = " + caKey);
                            callAccountHandle = jqEBM.callAccountHandleMap[caKey];
                            if(callAccountHandle)
                                callAccountHandle(errCodeMap.CALLACCOUNT_REJECT);

                            delete jqEBM.callAccountHandleMap[caKey];
                        }
                    }

                    //有业务数据
                    if (msgcodeMap['EB_WM_CALL_CONNECTED'] == jsonData.msg) {
                        //检查是否call_id已变更
                        var new_call_info = jsonData.call_info;
                        if (new_call_info.group_code == "0"  //只针对非群组会话
                            && new_call_info.oc_id == "0") {
                            var uid = new_call_info.from_uid;
                            var exist_call_id = uidCallidMap[uid];
                            text_area_log("EB_WM_CALL_CONNECTED exist_call_id=" + exist_call_id + ", new_call_id=" + new_call_info.call_id);
                            if (exist_call_id && exist_call_id != new_call_info.call_id) {//有变更
                                new_call_info.oc_id = exist_call_id;
                                text_area_log("call_id 已发生变更, 设置call_info.oc_id=" + new_call_info.oc_id);
                            }
                        }
                        processor.processCallConnected(req, jsonData);
                    }

                    //用户在另一客户端登录
                    if (msgcodeMap['EB_WM_ONLINE_ANOTHER_UM'] == jsonData.msg) {
                        processor.processOnlineAnother(req, jsonData);
                    }

                    //对方um主动挂断
                    if (msgcodeMap['EB_WM_CALL_HANGUP'] == jsonData.msg) {
                        var local_call_info = chatMap[jsonData.call_info.call_id];
                        if (jsonData.hangup == "0") {
                            jqEBM.reloadChat(jsonData.call_info.call_id, jsonData.call_info.from_uid, local_call_info.call_key);
                        } else if (jsonData.hangup == "1") {
                            local_call_info.hangup = true;
                            EBCM.ebwebcm_exit(jsonData.call_info.call_id);
                            EBUM.ebwebum_hangup(jsonData.call_info.call_id, false);
                        }
                    }

                    if (clientInfo.line_state != "0") {
                        EBUM.ebwebum_hb();
                    }
                    break;

                case apiMap["ebwebcm.hb"]:
                    //当前心跳连接计数减少1
                    var cm_key = jqEBM.CM_CONNECTMAP_KEY_PREFIX + req.url;
                    text_area_log("connectMap[" + cm_key + "]=" + connectMap[cm_key]);
                    if (connectMap[cm_key] && connectMap[cm_key] > 0) {
                        connectMap.reduce(cm_key);
                    }

                    //没有返回数据
                    if (!jsonData) {
                        text_area_log("cm no return data");
                    }
                    //有报错信息
                    if (jsonData.error) {
                        text_area_log("ebwebcm.hb code=" + jsonData.code + ", error=" + jsonData.error);
                    }

                    pv = $.evalJSON(req.pv);
                    callInfo = chatMap.callInfoByChatId(pv.chat_id);

                    //本地缓存找不到会话
                    if (!callInfo) {
                        text_area_log("processReceiveData ebwebcm.hb call_info not found for chat_id=" + pv.chat_id);
                        text_area_log("processReceiveData ebwebcm.hb chatMap===\n" + $.toJSON(chatMap));
                        break;
                    }

                    //chat_id error 会话失效
                    if (jsonData.code == statecodeMap["EB_STATE_UNAUTH_ERROR"]) {
                        //待定
                        //fire 聊天会话失效事件
                        text_area_log("ebwebcm.hb chat_id error, 即将尝试重新载入会话");
                        jqEBM.reloadChat(callInfo.call_id, null, callInfo.call_key);
                        break;
                    }

                    //业务轮询结束返回，没有数据
                    if (jsonData.code == statecodeMap["EB_STATE_TIMEOUT_ERROR"] && jsonData.error == "timeout") {
                        text_area_log("cm_hb 没有数据，长轮询断开");
                        EBCM.ebwebcm_hb(callInfo.cm_url, callInfo.chat_id);
                        break;
                    }

                    switch (parseInt(jsonData.msg, 10)) {
                        //对方离开会话
                        case msgcodeMap["CR_WM_USER_EXIT_ROOM"]:
                            text_area_log(pv.chat_id + ", exit room, uid:" + jsonData.from_uid);
                            text_area_log($.toJSON(callInfo));

                            this.processUserCMExit(req, jsonData);

                            if (jsonData.hangup == "0") {
                                //待定
                                //fire 对方离开会话事件
                                jqEBM.reloadChat(callInfo.call_id, jsonData.from_uid, callInfo.call_key);
                            }
                            break;

                        //用户在另一客户端登录
                        case msgcodeMap["EB_WM_ONLINE_ANOTHER_CM"]:
                            this.processOnlineAnother(req, jsonData);
                            break;

                        //对方进入会话事件
                        case msgcodeMap["CR_WM_USER_ENTER_ROOM"]:
                            text_area_log(pv.chat_id + ", enter room, uid:" + jsonData.from_uid);
                            this.processUserCMEnter(req, jsonData);

                            caKey = callInfo.call_id + "-" + jsonData.from_uid;
                            text_area_log("CR_WM_USER_ENTER_ROOM caKey = " + caKey);
                            callAccountHandle = jqEBM.callAccountHandleMap[caKey];
                            if(callAccountHandle)
                                callAccountHandle(errCodeMap.OK, {callInfo: callInfo, accountInfo: jqEBM.accountInfoMap[jsonData.from_uid]});

                            delete jqEBM.callAccountHandleMap[caKey];
                            break;

                        //长时间没有对话，被服务器主动注销会话
                        case msgcodeMap["CR_WM_EXIT_ROOM"]:
                            //fire 聊天会话长事件没有业务内容，服务器主动注销会话
                            if (jsonData.code = statecodeMap["EB_STATE_TIMEOUT_ERROR"]) {
                                text_area_log("长时间没有对话，被服务器主动注销会话");
                                //设置下线状态，防止下一个触发下一个um长连接
                                //clientInfo.line_state = 0;
//                                //下线
//                                EBUM.ebwebum_offline();
                                callInfo.hangup = true;
                                EBUM.ebwebum_hangup(callInfo.call_id, true);
                                this.processMyCMExit(callInfo.call_id);

                                return;//直接返回，不再触发cm_hb长连接
                            }
                            break;

                        //接收到消息
                        case msgcodeMap['CR_WM_RECEIVE_RICH']:
                            text_area_log("receive message, uid:" + jsonData.from_uid + ", from_account:" + jsonData.from_account + ", private=" + jsonData.private);
//                            var htmlStr = processor.processRichInfo(jsonData.rich_info);
//                            text_area_log(htmlStr);
                            if(eventHandle) {
                                eventHandle.onReceiveMessage(callInfo, jqEBM.accountInfoMap[jsonData.from_uid], jqEBM.processRichInfo(jsonData.rich_info));
                            }
                            break;

                        //文件离线成功
                        case msgcodeMap["CR_WM_SENDING_FILE"]:
                            this.processSendingFile(req, jsonData);
                            break;

                        //对方接收文件成功
                        case msgcodeMap["CR_WM_SENT_FILE"]:
                            this.processSentFile(req, jsonData);
                            break;

                        //对方接收文件成功
                        case msgcodeMap["CR_WM_CANCEL_FILE"]:
                            this.processCancelReceiveFile(req, jsonData);
                            break;

                    }

                    if (!jsonData.hangup || jsonData.hangup == "0") {//非挂断
                        EBCM.ebwebcm_hb(callInfo.cm_url, callInfo.chat_id);
                    }

                    break;

            }
        }
    })(jQuery, window);


/**
 * Created by nick on 2014/5/27.
 */

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


    })(jQuery, window);

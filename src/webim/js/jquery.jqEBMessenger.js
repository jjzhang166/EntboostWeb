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
            if (window.console) {
                console.info(text);
            }
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
                 * 线程进入睡眠
                 * @param second 睡眠的秒数
                 */
                sleep: function(second){
                    var now = new Date();
                    var exitTime = now.getTime() + second*1000;
                    while (true) {
                        now = new Date();
                        if (now.getTime() > exitTime){
                            break;
                        }

                    }
                },

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
                            //var src =$(ary[i]).attr("src");
                            rich_info.push(['"res":"',
                                $(ary[i]).attr("resid"),
                                //this.getQueryStringRegExp(src, "resid"),
                                ';',
                                $(ary[i]).attr("cmserver"),
                                //this.getServerName(src),
                                ';',
                                $(ary[i]).attr("appname"),
                                ';',
                                $(ary[i]).attr("desc"),
                                '"'
                            ].join(""));
                        } else {
                            var content =ary[i];
                            var obj = $("<div></div>");
                            obj.html(content);

                            rich_info.push('"text":'+ $.quoteString(obj.text()));
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
                    DOMAIN_URL: "entboost.entboost.com", //主服务器URL
                    TIMEOUT: 8000, //访问超时时间 (毫秒)
                    MAX_RELOGON_TIMES: 20, //最大重登次数限制
                    MAX_RELOADCHAT_TIMES: 200, //最大会话重连次数限制
                    APP_ID: null,
                    APP_OK: null,
                    CUS_ACCOUNT:"9009301111",
                    WEBIM_URL: "http://webim.entboost.com",
                    WEBIM_PLUGIN: "/server_plugin_webim"
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

        //联系人信息
        $.extend(jqEBM,{
            contacts:[],
            chat_type:{'single':'1','group':'2'}
        });
        //用户账号信息
        $.extend(jqEBM,{accountInfo:{
            accountInfoMap: {},
            addAccountInfo: function(accountInfo){
                this.accountInfoMap[accountInfo.account] = accountInfo;
            },
            removeAccountInfo: function(account){
                this.accountInfoMap[account] = null
            },
            getAccountInfo: function(account){
                return this.accountInfoMap[account];
            }

        }});
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

        $.extend(jqEBM, {cmhbAuthErrorTimes :0});
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
            "ebweblc.queryuser": 3,
            "ebwebum.userquery": 4,
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
            "ebwebcm.hb": 26,
            "ebwebum.callgroup":27,
            "ebwebcm.fileack": 28,
            "ebwebum.loadols": 29,
            "ebwebum.searchuser": 30,
            "ebwebum.sinfo":31,
            "ebweblc.querysysinfo":32

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
            },
            reset: function(key){
                if (this[key]) {
                    this[key] = 0;
                }
            }
        };

        //msg code对照表
        jqEBM.msgcodeMap = {
            "EB_WM_USER_STATE_CHA": 264,//群组成员状态事件
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
            "EB_WM_CONTACT_STATE_CHANG":792,//联系人在线状态
            "CR_WM_ENTER_ROOM": 4353,  //本端cm_enter返回事件
            "CR_WM_EXIT_ROOM": 4354,  //本端cm_exit返回事件
            "CR_WM_USER_ENTER_ROOM": 4355, //对方cm_enter返回事件
            "CR_WM_USER_EXIT_ROOM": 4356, //对方cm_exit返回事件
            "CR_WM_SEND_RICH": 4369, //发送富文本信息返回事件
            "CR_WM_RECEIVE_RICH":4370, //接收到富文本信息
            "CR_WM_SENDING_FILE": 4371, //发送离线文件到服务器消息
            "CR_WM_SENT_FILE": 4372, //对方接收文件成功
            "CR_WM_CANCEL_FILE": 4373, //对方拒绝或取消接收文件
            "CR_WM_RECEIVING_FILE": 4374,//对方发送在线文件
            "CR_WM_RECEIVED_FILE": 4375//已经收到一个文件
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
         *
         * @param app_id    app唯一标示
         * @param app_ok app在线key
         * @param logon_type 查询类型 2位登陆查询
         * @param account 要查询的账号
         * @param successCallback
         * @param failureCallback
         */
        EBLC.query_user = function(logon_type, account,successCallback,failureCallback){

            var parameter = {
                type:logon_type,
                account: account
            };



            ifrMessenger.sendMessage(jqEBM.apiMap["ebweblc.queryuser"],
                jqEBM.fn.createRestUrl(jqEBM.options.HTTP_PREFIX + jqEBM.options.DOMAIN_URL, jqEBM.API_VERSION, "ebweblc.queryuser"),
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
        }





        /**
         * 普通用户登录
         * @param account {string} 用户账号
         * @param password {string} 用户密码
         * @param password {string} 登陆类型
         * @param successCallback {function} 发送成功回调函数
         * @param failureCallback {function} 发送失败回调函数
         */
        EBLC.ebweblc_logonaccount = function(account, password, logon_type , successCallback, failureCallback) {
            var parameter ={
                uid: account,
                logon_type: logon_type

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

        /**
         *  查询服务器配置
         * @param successCallback 成功回调
         * @param failureCallback 失败回调
         */
        EBLC.ebweblc_querysysinfo = function(successCallback, failureCallback){

            ifrMessenger.sendMessage(jqEBM.apiMap["ebweblc.querysysinfo"],
                jqEBM.fn.createRestUrl(jqEBM.options.HTTP_PREFIX + jqEBM.options.DOMAIN_URL, jqEBM.API_VERSION, "ebweblc.querysysinfo"),
                $.toJSON({}),
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
        EBUM.ebwebum_loadcontact = function (successCallback, failureCallback) {
            var parameter = {
                uid: jqEBM.clientInfo.my_uid
            };
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.loadcontact"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.loadcontact"),
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
         * @param parameter {group_code:xxx,load_ent_dep:xxx,load_ent_dep:xxx,load_emp:xxx,load_image:xxx}
         * @param callback (function) 回调函数
         */
        EBUM.ebwebum_loadorg = function (parameter,successCallback,failureCallback) {

            if(!parameter){
                parameter = {};
            }
            parameter.uid = jqEBM.clientInfo.my_uid;



            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.loadorg"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.loadorg"),
                $.toJSON(parameter),
                true,
                40000, //40秒超时
                function(state, param) {
                    if(state == jqEBM.errCodeMap.OK) {
                        if (successCallback) successCallback(param);
                    } else {
                        if (failureCallback) failureCallback(state);
                    }
                });
        };

        EBUM.user_query = function(account,successCallback,failureCallback){
            var parameter = {
                uid: jqEBM.clientInfo.my_uid,
                query_account: account
            };



            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.userquery"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.userquery"),
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
        }

        /**
         * 呼叫群组或部门
         * @param gid
         * @param call_key
         * @param callback
         */
        EBUM.ebwebum_callgroup = function(gid, call_key , callback){
            var parameter = {
                group_code:gid,
                uid: jqEBM.clientInfo.my_uid
            };
            if(call_key){
                parameter.call_key = call_key;
            }


            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.callgroup"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.callgroup"),
                $.toJSON(parameter),
                true,
                null,
                callback);
        }

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
        EBUM.ebwebum_online = function (line_state, successCallback, failureCallback) {
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
                function(state, param) {

                    if(state == jqEBM.errCodeMap.OK) {
                        if (successCallback) successCallback(param);
                    } else {
                        if (failureCallback) failureCallback(state);
                    }
                });
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
        /**
         * 加载在线状态
         * @param gid 群组id
         *
         */
        EBUM.ebwebum_loadols = function(gid,successCallback,failureCallback){
            var parameter = {
                uid:jqEBM.clientInfo.my_uid,
                group_code:gid
            }
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.loadols"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.loadols"),
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
         * 搜索用户
         * @param search_key
         * @param successCallback
         * @param failureCallback
         */
        EBUM.ebwebum_searchuser = function(search_key, successCallback,failureCallback){
            var parameter = {
                uid: jqEBM.clientInfo.my_uid,
                "search-key":search_key

            }
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.searchuser"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.searchuser"),
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
         * 修改个人资料
         * @param successCallback
         * @param failureCallback
         */
        EBUM.ebwebum_sinfo = function(parameter,successCallback , failureCallback){
            parameter.uid = jqEBM.clientInfo.my_uid;

            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebum.sinfo"],
                jqEBM.fn.createRestUrl(jqEBM.clientInfo.um_url, jqEBM.API_VERSION, "ebwebum.sinfo"),
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
        }

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
         * @param from_uid {string} 用户id
         */
        EBCM.ebwebcm_hb = function (cm_url, from_uid) {
            var key = jqEBM.CM_CONNECTMAP_KEY_PREFIX + fn.createRestUrl(cm_url, jqEBM.API_VERSION, "ebwebcm.hb");
          
            text_area_log("connectMap[" + key + "]=" + jqEBM.connectMap[key]);
            text_area_log("jqEBM.connectMap:" + JSON.stringify(jqEBM.connectMap));

            if (!jqEBM.connectMap[key] || jqEBM.connectMap[key] === 0) {//限制一个服务只有一个um长连接

                jqEBM.connectMap.increase(key);

                var parameter = {
                    from_uid: from_uid
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
         * @param from_uid {int} 消息发送方uid
         * @param to_uid {int} 对方uid；(群组会话时)指定和某一人对话(注意这里并不表示私聊)，空值表示和全部人说话
         * @param isPrivate {boolean} 是否私聊
         * @param rich_info {string} json格式的富文本消息
         * @param successCallback {function} 发送成功回调函数
         * @param failureCallback {function} 发送失败回调函数
         * @returns {string} 执行状态
         */
        EBCM.ebwebcm_sendrich = function (callInfo, from_uid, to_uid, isPrivate, rich_info, successCallback, failureCallback) {
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
            if(from_uid){
                parameterStr = parameterStr + ', "from_uid":' + from_uid;
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
         * @param from_uid {int} 用户id 新增参数(2015-04-07)
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
                chat_id: callInfo.chat_id,
                from_uid: jqEBM.clientInfo.my_uid
            };
            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.exit"],
                jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.exit"),
                $.toJSON(parameter));
        };

        /**
         * 申请上传文件
         * @param from_uid 收件方uid (2015-04-08添加)
         * @param chat_id
         * @param failureCallback
            */
        EBCM.ebwebcm_sendfile_apply = function (from_uid,chat_id, failureCallback) {

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
                from_uid: from_uid,
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


        EBCM.ebwebcm_fileack = function(chat_id, msg_id, ack_type,successCallback, failureCallback){
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
                msg_id: msg_id,
                ack_type: ack_type,
                from_uid: jqEBM.clientInfo.my_uid
            };

            ifrMessenger.sendMessage(jqEBM.apiMap["ebwebcm.fileack"],
                jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.fileack"),
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

        }


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
                //var pv =$.evalJSON(req.pv);
                var callInfo =jqEBM.chatMap.callInfoByChatId(jsonData.chat_id);
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
            var cm_url = callConnect_info.url;
            if($.ebMsg.options.HTTP_PREFIX.indexOf("https:") != -1){//判断是否为https链接
                cm_url = callConnect_info.urls;
            }

            //创建或更新会话信息
            var call_info =jqEBM.mergeCallInfo(callConnect_info.call_id,
                    callConnect_info.group_code,
                    callConnect_info.from_uid,
                    callConnect_info.from_account,
                    callConnect_info.from_info,
                    jqEBM.options.HTTP_PREFIX + cm_url,
                    callConnect_info.appname,
                    callConnect_info.chat_id,
                    callConnect_info.chat_key,
                    callConnect_info.offline_user=='0'?'false':'true',
                    null);

            text_area_log('processCallConnected===' + call_info.cm_url);

            var try_times =0;//必须定义变量
            jqEBM.fn.load_iframe(call_info.cm_url+ jqEBM.options.WEBIM_PLUGIN +'/iframe_domain.html?fr_name=' + jqEBM.fn.domainURI(call_info.cm_url) + (jqEBM.options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION,
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
            //var pv =$.evalJSON(req.pv);
            var call_info =jqEBM.chatMap.callInfoByChatId(data.chat_id);

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
            //var pv =$.evalJSON(req.pv);
            var call_info = jqEBM.chatMap.callInfoByChatId(data.chat_id);
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
            //加载群组信息


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
            //var pv =$.evalJSON(req.pv);
            var call_info =jqEBM.chatMap.callInfoByChatId(data.chat_id);

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
//            var pv =$.evalJSON(req.pv);
            var call_info =jqEBM.chatMap.callInfoByChatId(data.chat_id);

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
//            var pv =$.evalJSON(req.pv);
            var call_info =jqEBM.chatMap.callInfoByChatId(data.chat_id);

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

                if(serverUrl.indexOf(("https:")) != -1){
                    var middle_url = serverUrl.replace(/https:/g,"");
                    if(middle_url.indexOf(":") == -1){
                        serverUrl += ":443";
                    }
                }
                if(serverUrl.indexOf(("http:")) != -1){
                    var middle_url = serverUrl.replace(/http:/g,"");
                    if(middle_url.indexOf(":") == -1){
                        serverUrl += ":80";
                    }
                }
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
                    jqEBM.EBUM.ebwebum_online(5, callback);
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
                    src = ((richInfo[i].url.indexOf("http")===0)?"":"http://") + richInfo[i].url + "/servlet.ebwebcm.res?file=" + richInfo[i].img;
                    entity = {
                        type: "screenshot",
                        content: src
                    };
                }
                else if(richInfo[i].resid) {//表情
                    src = [
                        "http://",
                        richInfo[i].url,
                        "/servlet.ebwebcm.res?resid=",
                        richInfo[i].resid
                    ].join("");
                    entity = {
                        type: "emotion",
                        content: src,
                        resid:richInfo[i].resid,
                        server:richInfo[i].cm_server,
                        desc:richInfo[i].desc
                    };
                }
                richInfoArray.push(entity);
            }
            return richInfoArray;
        };

        /**
         * 发送消息(图文混排)
         * @param
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

            jqEBM.EBCM.ebwebcm_sendrich(callInfo, jqEBM.clientInfo.my_uid , null, false, jsonRichInfo, successCallback, failureBack);
        };

        /**
         * ajax方式上传文件
         * @param batch_number 批次号
         * @param url
         * @param secureuri
         * @param fileElementId
         * @param chat_id
         * @param from_uid
         * @param success_handle
         * @param error_handle
         * @returns {Boolean}
         */
        jqEBM.ajaxFileUpload = function (batch_number, url, secureuri, fileElementId, chat_id, from_uid ,success_handle, error_handle) {

            var parameter = {
//			chat_id: chat_id,
//			batch_number: batch_number
            };

            $.ajaxFU.ajaxFileUpload({
                url: url + "?chat_id=" + chat_id  + "&from_uid=" + from_uid + "&batch_number=" + batch_number, //你处理上传文件的服务端
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
            QUERYUSER_FAILURE: {code:1, msg:"账号或密码错误"},
            LOGON_FAILURE: {code:2, msg:"账号或密码错误"},
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
            UPLOAD_FILE_REJECT: {code:33, msg:"对方取消或拒绝接收文件"},
            LOADCONTACT_FAILURE:{code:34, msg:"加载联系人失败"},
            //code=10000以上，自定义错误信息
            "ACK_FILE_FAILURE": {code:10000,msg:"文件ack错误"},
            "LOAD_OLS_FAILURE": {code:10001,msg:"用户状态加载失败!"},
            "SINFO_FAILURE": {code:10002,msg:"修改资料失败!"},
            "RESET_PWD_FAILURE": {code:10003, msg:"重置密码失败!"}
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

            //接收到文件
            EventHandle.prototype.onReceiveFile = function(callInfo, from_uid, file_info){};

            //发送文件事件
            EventHandle.prototype.onReceivingFile = function(callInfo, from_uid, file_info){};

            //用户在线状态变化通知状态
            EventHandle.prototype.onLineStateChange = function(stateInfo,type){};
            //聊天会话结束
            EventHandle.prototype.onTalkOver = function(callId) {};

            //服务器断线
            EventHandle.prototype.onDisconnect = function() {};

            //聊天会话ID变更
            EventHandle.prototype.onChangeCallId = function(existCallId, newCallId) {};

            EventHandle.prototype.onChatInvalid = function(callInfo){};

            //成功进入会话
            EventHandle.prototype.onEnterCall = function(callInfo){};


            //其它错误
            EventHandle.prototype.onError = function(error) {};

            //JSON数据错误
            EventHandle.prototype.onJsonDataError = function(){};



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
        var accountInfo = jqEBM.accountInfo;
        //var contacts = jqEBM.contacts;

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

                    var um_key = jqEBM.UM_CONNECTMAP_KEY_PREFIX;


                    if (connectMap[um_key] && connectMap[um_key] > 0) {
                        connectMap.reduce(um_key);
                    }

                    if (clientInfo.line_state != String(0)) {

                        setTimeout("$.jqEBMessenger.EBUM.ebwebum_hb()", 2000);
                    }
                    break;
                case apiMap["ebwebcm.hb"]:
                    //当前心跳连接计数减少1
                    var cm_key = jqEBM.CM_CONNECTMAP_KEY_PREFIX + fn.createRestUrl(req.url.split("/rest")[0], jqEBM.API_VERSION, "ebwebcm.hb");

                    if (connectMap[cm_key] && connectMap[cm_key] > 0) {
                        connectMap.reduce(cm_key);
                        //connectMap.reset(cm_key)
//                        jqEBM.connectMap[cm_key] = 0;
                    }

                    if (req.pv) {
                        req.pv = $.Base64.decode(req.pv);
                        req.pv = $.evalJSON(req.pv);

                        setTimeout("$.jqEBMessenger.EBCM.ebwebcm_hb('" + req.url.split('/rest')[0] + "','" + jqEBM.clientInfo.my_uid + "')", 2000);

                        text_area_log("processNetworkError,  ebwebcm.hb error for from_uid =" + req.pv.from_uid +",reconnect soon!");

//                        var call_info = chatMap.callInfoByChatId(req.pv.chat_id);
//                        if (call_info) {
//                            setTimeout("$.jqEBMessenger.EBCM.ebwebcm_hb('" + call_info.cm_url + "','" + jqEBM.clientInfo.my_uid + "')", 2000);
//                        }
//                        else {
//
//                            text_area_log("processNetworkError call_info not found for chat_id=" + req.pv.chat_id);
//                            text_area_log("processNetworkError chatMap===\n" + $.toJSON(chatMap));
//                        }
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

            var jsonData = JSON.parse(jsonString);

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
                case apiMap['ebweblc.queryuser']:

                    if(jsonData.code != statecodeMap["EB_STATE_OK"]){
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.QUERYUSER_FAILURE);

                        break;
                    }
                    accountInfo.addAccountInfo(jsonData);
                    callback(errCodeMap.OK, accountInfo.getAccountInfo(jsonData.account));
                    break;

                case apiMap["ebweblc.querysysinfo"]:
                    if(jsonData.code != statecodeMap["EB_STATE_OK"]){
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.QUERY_SYSTEM_INFO_FAILURE);

                        break;
                    }

                    callback(errCodeMap.OK, jsonData);
                    break;
                case apiMap["ebwebum.userquery"]:
                    if(jsonData.code != statecodeMap["EB_STATE_OK"]){
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.QUERYUSER_FAILURE);

                        break;
                    }
                    accountInfo.addAccountInfo(jsonData);
                    callback(errCodeMap.OK, jsonData);
                    break;
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
                    callback(errCodeMap.OK, clientInfo);

                    //jqEBM.online(callback);
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
                    if($.ebMsg.options.HTTP_PREFIX.indexOf("https:") != -1){
                        clientInfo.um_url = options.HTTP_PREFIX + jsonData.urls;
                    }
                    clientInfo.um_appname = jsonData.appname;
                    clientInfo.my_account = jsonData.account;
                    clientInfo.my_uid = jsonData.uid;
                    clientInfo.my_um_online_key = jsonData.online_key;
                    clientInfo.acm_key = jsonData.acm_key;
                    clientInfo.username = jsonData.username;
                    clientInfo.description = jsonData.description;
                    clientInfo.setting = jsonData.setting;
                    clientInfo.default_member_code = jsonData.default_member_code;

                    clientInfo.gender = jsonData.gender;
                    clientInfo.birthday = jsonData.birthday;
                    clientInfo.tel = jsonData.tel;
                    clientInfo.mobile = jsonData.mobile;
                    clientInfo.email = jsonData.email;
                    clientInfo.user_url = jsonData.user_url;
                    clientInfo.add = jsonData.add;
                    clientInfo.zipcode = jsonData.zipcode;
                    clientInfo.area1 = jsonData.area1;
                    clientInfo.area2 = jsonData.area2;
                    clientInfo.area3 = jsonData.area3;
                    clientInfo.area4 = jsonData.area4;
                    clientInfo.area1s = jsonData.area1s;
                    clientInfo.area2s = jsonData.area2s;
                    clientInfo.area3s = jsonData.area3s;
                    clientInfo.area4s = jsonData.area4s;

                    callback(errCodeMap.OK, clientInfo);

//                    jqEBM.online(null);

                    break;
                case apiMap["ebweblc.resetpwd"]:

                    if (jsonData.code != statecodeMap["EB_STATE_OK"]) {
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.RESET_PWD_FAILURE);


                        break;
                    }

                    callback(errCodeMap.OK, jsonData);
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
                        callback(errCodeMap.OK, jsonData);
//                        EBUM.ebwebum_loadorg(callback);
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
                case apiMap["ebwebum.callgroup"]:
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

                    if (msgcodeMap['EB_WM_CALL_CONNECTED'] == jsonData.msg) {
                        this.processCallAlerting(req, jsonData);

                        processor.processCallConnected(req, jsonData);
                        break;

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



                    if(jsonData.code != statecodeMap["EB_STATE_OK"]){
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.LOADCONTACT_FAILURE);

                        break;
                    }

                    $.jqEBMessenger.contacts = jsonData['contacts'];

                    callback(errCodeMap.OK, $.jqEBMessenger.contacts);
                    break;

                case apiMap["ebwebum.loadorg"]:
//                    this.processLoadorg(jsonData);
     //               clientInfo.loadorg_state = 1;
                    if(jsonData.code != statecodeMap["EB_STATE_OK"]){
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.QUERYUSER_FAILURE);

                        break;
                    }

                    callback(errCodeMap.OK, jsonData);



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
                case apiMap["ebwebcm.fileack"]:
                    if(!jsonData){
                        break;
                    }
                    if (jsonData.code != statecodeMap["EB_STATE_OK"]) {
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.ACK_FILE_FAILURE);


                        break;
                    }
                    callback(errCodeMap.OK, clientInfo);
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

                        EBCM.ebwebcm_hb(callInfo.cm_url, pv.from_uid);

                        eventHandle.onEnterCall(callInfo,null);

                    }
                    break;


                case apiMap["ebwebum.loadols"]:

                    if (jsonData.code != statecodeMap["EB_STATE_OK"]) {
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.LOAD_OLS_FAILURE);


                        break;
                    }

                    callback(errCodeMap.OK, jsonData);


                    break;
                case apiMap["ebwebum.sinfo"]:

                    if (jsonData.code != statecodeMap["EB_STATE_OK"]) {
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.SINFO_FAILURE);


                        break;
                    }

                    callback(errCodeMap.OK, jsonData);
                    break;
                case apiMap["ebwebum.searchuser"]:

                    if (jsonData.code != statecodeMap["EB_STATE_OK"]) {
                        text_area_log(jsonData.error);
                        if(callback)
                            callback(errCodeMap.LOAD_OLS_FAILURE);


                        break;
                    }

                    callback(errCodeMap.OK, jsonData);


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
                        var key = jqEBM.CM_CONNECTMAP_KEY_PREFIX + fn.createRestUrl(req.url.split("/rest")[0], jqEBM.API_VERSION, "ebwebcm.hb");
                        jqEBM.connectMap[key] = 100;
                        break;
                    }

                    //群组成员在线状态变更事件
                    if(msgcodeMap['EB_WM_USER_STATE_CHA'] == jsonData.msg){

                        eventHandle.onLineStateChange(jsonData,'1');

                    }
                    //联系人在线状态变更
                    if(msgcodeMap['EB_WM_CONTACT_STATE_CHANG'] == jsonData.msg){
                        eventHandle.onLineStateChange(jsonData,'2');

                    }

                    //对方um主动挂断
                    if (msgcodeMap['EB_WM_CALL_HANGUP'] == jsonData.msg) {
                        var local_call_info = chatMap[jsonData.call_info.call_id];
                        if(local_call_info){
                            if (jsonData.hangup == "0") {
                                jqEBM.reloadChat(jsonData.call_info.call_id, jsonData.call_info.from_uid, local_call_info.call_key);
                            } else if (jsonData.hangup == "1") {
                                local_call_info.hangup = true;
                                EBCM.ebwebcm_exit(jsonData.call_info.call_id);
                                EBUM.ebwebum_hangup(jsonData.call_info.call_id, false);
                            }
                        }

                    }

                    if (clientInfo.line_state != "0") {
                        EBUM.ebwebum_hb();
                    }
                    break;

                case apiMap["ebwebcm.hb"]:


                    //if(jqEBM.cmhbAuthErrorTimes >= 5){
                    //
                    //    break;
                    //}


                    //当前心跳连接计数减少1

                    var cm_key = jqEBM.CM_CONNECTMAP_KEY_PREFIX + fn.createRestUrl(req.url.split("/rest")[0], jqEBM.API_VERSION, "ebwebcm.hb");


                    text_area_log("connectMap[" + cm_key + "]=" + connectMap[cm_key]);
                    if (connectMap[cm_key] && connectMap[cm_key] > 0) {

                        connectMap.reduce(cm_key);

                    }
                    //没有返回数据
                    if (!jsonData) {
                        text_area_log("cm no return data");
                        EBCM.ebwebcm_hb(req.url.split("/rest")[0] , jqEBM.clientInfo.my_uid);
                        break;
                    }
                    //有报错信息
                    if (jsonData.error) {
                        text_area_log("ebwebcm.hb code=" + jsonData.code + ", error=" + jsonData.error);

                    }

//                    pv = $.evalJSON(req.pv);

                    callInfo = chatMap.callInfoByChatId(jsonData.chat_id);

                    //本地缓存找不到会话
                    if (!callInfo) {
                        if (jsonData.code == statecodeMap["EB_STATE_UNAUTH_ERROR"]) {
                            break;
                        }

                        text_area_log("processReceiveData ebwebcm.hb call_info not found for chat_id=" + jsonData.chat_id);
                        text_area_log("processReceiveData ebwebcm.hb chatMap===\n" + $.toJSON(chatMap));
                        EBCM.ebwebcm_hb(req.url.split("/rest")[0] , jqEBM.clientInfo.my_uid);



                        break;
                    }else{
                        //chat_id error 会话失效
                        if (jsonData.code == statecodeMap["EB_STATE_UNAUTH_ERROR"]) {
                            //jqEBM.cmhbAuthErrorTimes = jqEBM.cmhbAuthErrorTimes + 1;
                            //待定
                            //fire 聊天会话失效事件
                            text_area_log("ebwebcm.hb chat_id error, 即将尝试重新载入会话");
                            jqEBM.reloadChat(callInfo.call_id, null, callInfo.call_key);
                            EBCM.ebwebcm_hb(callInfo.cm_url, jqEBM.clientInfo.my_uid);

                            break;
                        }

                        //业务轮询结束返回，没有数据
                        if (jsonData.code == statecodeMap["EB_STATE_TIMEOUT_ERROR"] && jsonData.error == "timeout") {
                            text_area_log("cm_hb 没有数据，长轮询断开");

                            EBCM.ebwebcm_hb(callInfo.cm_url, jqEBM.clientInfo.my_uid);
                            break;
                        }

                        switch (parseInt(jsonData.msg, 10)) {
                            //对方离开会话
                            case msgcodeMap["CR_WM_USER_EXIT_ROOM"]:
                                text_area_log(jsonData.chat_id + ", exit room, uid:" + jsonData.from_uid);
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

                                text_area_log(jsonData.chat_id + ", enter room, uid:" + jsonData.from_uid);
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
                                eventHandle.onChatInvalid(callInfo);//会话事件
                                //fire 聊天会话长事件没有业务内容，服务器主动注销会话
                                if (jsonData.code = statecodeMap["EB_STATE_TIMEOUT_ERROR"]) {

                                    text_area_log("长时间没有对话，被服务器主动注销会话");
                                    //设置下线状态，防止下一个触发下一个um长连接
                                    //clientInfo.line_state = 0;
//                                //下线
//                                EBUM.ebwebum_offline();
                                    callInfo.hangup = false;
                                    //EBUM.ebwebum_hangup(callInfo.call_id, true);
                                    this.processMyCMExit(callInfo.call_id);

                                    //return;//直接返回，不再触发cm_hb长连接
                                }
                                //EBCM.ebwebcm_hb(req.url.split("/rest")[0] , jqEBM.clientInfo.my_uid);
                                break;

                            //接收到消息
                            case msgcodeMap['CR_WM_RECEIVE_RICH']:
                                text_area_log("receive message, uid:" + jsonData.from_uid + ", from_account:" + jsonData.from_account + ", private=" + jsonData.private);
//                            var htmlStr = processor.processRichInfo(jsonData.rich_info);
//                            text_area_log(htmlStr);
                                if(eventHandle) {
                                    if(callInfo.group_code == '0'){

                                        eventHandle.onReceiveMessage(callInfo, jqEBM.accountInfoMap[jsonData.from_uid], jqEBM.processRichInfo(jsonData.rich_info));

                                    }else{
                                        eventHandle.onReceiveMessage(callInfo, jsonData.from_uid , jqEBM.processRichInfo(jsonData.rich_info));

                                    }
                                }
                                break;

                            //收到一个文件
                            case msgcodeMap["CR_WM_RECEIVED_FILE"]:

                                text_area_log("receive file, uid:" + jsonData.from_uid + ", from_account:" + jsonData.from_account + ", private=" + jsonData.private);
                                if(eventHandle) {
                                    eventHandle.onReceiveFile(callInfo, jsonData.from_uid, jsonData.file_info);
                                }
                                break;
                            //对方发送文件，绝句或者接收
                            case msgcodeMap["CR_WM_RECEIVING_FILE"]:
                                text_area_log("receiving file, uid:" + jsonData.from_uid + ", from_account:" + jsonData.from_account + ", private=" + jsonData.private);
                                if(eventHandle) {
                                    eventHandle.onReceivingFile(callInfo, jsonData.from_uid, jsonData.file_info);
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
                            EBCM.ebwebcm_hb(callInfo.cm_url, jqEBM.clientInfo.my_uid);
                        }
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
        * 退出cm
        * @param uid 用户id
        * @param chatid 会话id
        * @param successCallback
        * @param failureCallback
        */
       api.ebcm_exit = function(chatid, successCallback,failureCallback){
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           var url =options.HTTP_PREFIX + options.DOMAIN_URL + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
               + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION;
           fn.load_iframe(url,
               try_times,
               //用户登录
               function () {
                   jqEBM.EBCM.ebwebcm_exit(chatid , successCallback,failureCallback);
               });

       }
       /**
        * 加载组织架构 表情 公司信息
        * @param parameter {group_code:xxx,load_ent_dep:xxx,load_ent_dep:xxx,load_emp:xxx,load_image:xxx}
        * @param successCallback
        * @param failureCallback
        */
       api.loadorg = function(parameter,successCallback,failureCallback){
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           var url =options.HTTP_PREFIX + options.DOMAIN_URL + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
               + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION;
           fn.load_iframe(url,
               try_times,
               //用户登录
               function () {
                   jqEBM.EBUM.ebwebum_loadorg(parameter,successCallback,failureCallback);
               });
       }

       /**
        * 通过账号查询用户信息
        *
        */
       api.queryUser = function(logon_type, account,successCallback,failureCallback){
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           var url =options.HTTP_PREFIX + options.DOMAIN_URL + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
               + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION;
           fn.load_iframe(url,
               try_times,
               //用户登录
               function () {
                   jqEBM.EBLC.query_user(logon_type, account,successCallback,failureCallback);
               });
       }

       /**
        * 查询用户名片信息
        * @param account 需要查询的用户的账号或者uid
        * @param successCallback 查询成功的回调
        * @param failureCallback 查询失败的回调
        */
       api.userQuery = function(account, successCallback, failureCallback){

           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           var url =(jqEBM.clientInfo.um_url + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
               + jqEBM.clientInfo.um_url) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION;
           fn.load_iframe(url,
               try_times,
               //用户登录
               function () {
                   jqEBM.EBUM.user_query(account,successCallback,failureCallback);
               });
       }


       api.loadcontact = function(successCallback,failureCallback){
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           var url =options.HTTP_PREFIX + options.DOMAIN_URL + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
               + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION;
           fn.load_iframe(url,
               try_times,
               //用户登录
               function () {
                   jqEBM.EBUM.ebwebum_loadcontact(successCallback,failureCallback);
               });
       }


       /**
        * 以游客身份登录验证
        * @param successCallback(clientInfo) {function} 发送成功回调函数
        * @param failureCallback(error) {function} 发送失败回调函数
        */
       api.logonVisitor = function (successCallback, failureCallback) {
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           var url =options.HTTP_PREFIX + options.DOMAIN_URL + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
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
       api.logonAccount = function (account, password, logon_type, successCallback, failureCallback) {
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           fn.load_iframe(options.HTTP_PREFIX + options.DOMAIN_URL + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
                   + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION,
               try_times,
               //用户登录
               function () {
                   jqEBM.EBLC.ebweblc_logonaccount(account, password, logon_type, successCallback, failureCallback);
               });
       };

       /**
        * 登记上线
        * @param successCallback
        * @param failureCallback
        */
       api.online = function(successCallback, failureCallback){
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           fn.load_iframe(jqEBM.clientInfo.um_url + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
                   + fn.domainURI(jqEBM.clientInfo.um_url) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION,
               try_times,
               //登记上线
               function () {
                   jqEBM.EBUM.ebwebum_online(5,successCallback, failureCallback);
               });

       }
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
        * 呼叫群或部门
        * @param gid 群组或部门id
        * @param call_key 呼叫来源KEY，实现企业被呼叫限制
        * @param successCallback successCallback(callInfo, accountInfo) 发送成功回调函数
        * @param failureCallback failureCallback(error) 失败回调函数
        */
       api.callGroup = function(gid, callKey, successCallback, failureCallback){


           jqEBM.EBUM.ebwebum_callgroup(gid, callKey, function(state, param) {
               if (state == jqEBM.errCodeMap.OK) {

                   if (successCallback) successCallback(param.callInfo, param.accountInfo);
               } else {
                   if (failureCallback) failureCallback(state);
               }
           });

//           var try_times = 0;//必须定义变量
//           //载入跨域执行页面
//           fn.load_iframe(options.HTTP_PREFIX + options.DOMAIN_URL + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
//                   + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION,
//               try_times,
//
//               function () {
//                   jqEBM.EBUM.ebwebum_callgroup(gid, call_key ,successCallback, failureCallback);
//               });

       }
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
       api.sendfile = function(fileElementId, chatId ,sendingCallback, sentCallback) {
           var batch_number = Math.floor(Math.random() * 10000000);
           var fileName =$("#"+fileElementId).val();
           text_area_log("fileName = " + fileName);
           var batchObj = {
               fileName: fileName,
               sendingCallback: sendingCallback,
               sentCallback: sentCallback
           };
           jqEBM.uploadAttachmentMap[batch_number] = batchObj;
           var from_uid = $.jqEBMessenger.clientInfo.my_uid;
           jqEBM.EBCM.ebwebcm_sendfile_apply(from_uid,chatId, function(error) {
               sendingCallback(error);
               delete jqEBM.uploadAttachmentMap[batch_number];
           });

           //jqEBM.uploadAttachmentMap[batch_number] = fileName;

           var callInfo =jqEBM.chatMap.callInfoByChatId(chatId);

           jqEBM.ajaxFileUpload(batch_number,
               jqEBM.fn.createRestUrl(callInfo.cm_url, jqEBM.API_VERSION, "ebwebcm.sendfile"),
               false, fileElementId, chatId, from_uid , null, null);

           return batch_number;
       };
       api.fileack = function(chat_id, msg_id, ack_type,successCallback, failureCallback){
           jqEBM.EBCM.ebwebcm_fileack(chat_id, msg_id, ack_type,successCallback, failureCallback)
       };

       /**
        * 加载群组在线状态
        * @param gid
        * @param successCallback
        * @param failureCallback
        */
       api.loadols = function (gid, successCallback, failureCallback) {
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           fn.load_iframe(options.HTTP_PREFIX + options.DOMAIN_URL + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
               + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION,
               try_times,

               function () {
                   jqEBM.EBUM.ebwebum_loadols(gid, successCallback, failureCallback);
               });
       };

       api.searchuser = function(search_key,successCallback, failureCallback){
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           fn.load_iframe(options.HTTP_PREFIX + options.DOMAIN_URL + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
               + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION,
               try_times,

               function () {
                   jqEBM.EBUM.ebwebum_searchuser(search_key, successCallback, failureCallback);
               });
       };
       /**
        * 修改个人资料
        * @param successCallback
        * @param failureCallback
        */
       api.sinfo = function(parameter,successCallback, failureCallback){
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           fn.load_iframe(options.HTTP_PREFIX + options.DOMAIN_URL + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
               + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION,
               try_times,

               function () {
                   jqEBM.EBUM.ebwebum_sinfo(parameter,successCallback, failureCallback);
               });
       };

       /**
        * 查询服务器配置
        * @param successCallback
        * @param failureCallback
        */
       api.querysysinfo = function(successCallback, failureCallback){
           var try_times = 0;//必须定义变量
           //载入跨域执行页面
           fn.load_iframe(options.HTTP_PREFIX + options.DOMAIN_URL + options.WEBIM_PLUGIN + "/iframe_domain.html?fr_name="
               + fn.domainURI(options.HTTP_PREFIX + options.DOMAIN_URL) + (options.IFRAME_DEBUG?"&debug=true":"") + "&v=" + jqEBM.STATIC_VERSION,
               try_times,

               function () {
                   jqEBM.EBLC.ebweblc_querysysinfo(successCallback, failureCallback);
               });
       };
       //导出外部调用的api
       $.extend($.ebMsg, jqEBM.api);

   })(jQuery, window);


    /*
     *  entboost MD5函数库
     *  访问方法 $.ebfn.xxx()
     */
    (function($, window) {


        var rotateLeft = function(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        var addUnsigned = function(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        var F = function(x, y, z) {
            return (x & y) | ((~ x) & z);
        }

        var G = function(x, y, z) {
            return (x & z) | (y & (~ z));
        }

        var H = function(x, y, z) {
            return (x ^ y ^ z);
        }

        var I = function(x, y, z) {
            return (y ^ (x | (~ z)));
        }

        var FF = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var GG = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var HH = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var II = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var convertToWordArray = function(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWordsTempOne = lMessageLength + 8;
            var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
            var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        var wordToHex = function(lValue) {
            var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValueTemp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
            }
            return WordToHexValue;
        };

        var uTF8Encode = function(string) {
            string = string.replace(/\x0d\x0a/g, "\x0a");
            var output = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    output += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    output += String.fromCharCode((c >> 6) | 192);
                    output += String.fromCharCode((c & 63) | 128);
                } else {
                    output += String.fromCharCode((c >> 12) | 224);
                    output += String.fromCharCode(((c >> 6) & 63) | 128);
                    output += String.fromCharCode((c & 63) | 128);
                }
            }
            return output;
        };

        $.extend({
            md5: function(string) {
                var x = Array();
                var k, AA, BB, CC, DD, a, b, c, d;
                var S11=7, S12=12, S13=17, S14=22;
                var S21=5, S22=9 , S23=14, S24=20;
                var S31=4, S32=11, S33=16, S34=23;
                var S41=6, S42=10, S43=15, S44=21;
                string = uTF8Encode(string);
                x = convertToWordArray(string);
                a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
                for (k = 0; k < x.length; k += 16) {
                    AA = a; BB = b; CC = c; DD = d;
                    a = FF(a, b, c, d, x[k+0],  S11, 0xD76AA478);
                    d = FF(d, a, b, c, x[k+1],  S12, 0xE8C7B756);
                    c = FF(c, d, a, b, x[k+2],  S13, 0x242070DB);
                    b = FF(b, c, d, a, x[k+3],  S14, 0xC1BDCEEE);
                    a = FF(a, b, c, d, x[k+4],  S11, 0xF57C0FAF);
                    d = FF(d, a, b, c, x[k+5],  S12, 0x4787C62A);
                    c = FF(c, d, a, b, x[k+6],  S13, 0xA8304613);
                    b = FF(b, c, d, a, x[k+7],  S14, 0xFD469501);
                    a = FF(a, b, c, d, x[k+8],  S11, 0x698098D8);
                    d = FF(d, a, b, c, x[k+9],  S12, 0x8B44F7AF);
                    c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
                    b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
                    a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
                    d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
                    c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
                    b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
                    a = GG(a, b, c, d, x[k+1],  S21, 0xF61E2562);
                    d = GG(d, a, b, c, x[k+6],  S22, 0xC040B340);
                    c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
                    b = GG(b, c, d, a, x[k+0],  S24, 0xE9B6C7AA);
                    a = GG(a, b, c, d, x[k+5],  S21, 0xD62F105D);
                    d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
                    c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
                    b = GG(b, c, d, a, x[k+4],  S24, 0xE7D3FBC8);
                    a = GG(a, b, c, d, x[k+9],  S21, 0x21E1CDE6);
                    d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
                    c = GG(c, d, a, b, x[k+3],  S23, 0xF4D50D87);
                    b = GG(b, c, d, a, x[k+8],  S24, 0x455A14ED);
                    a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
                    d = GG(d, a, b, c, x[k+2],  S22, 0xFCEFA3F8);
                    c = GG(c, d, a, b, x[k+7],  S23, 0x676F02D9);
                    b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
                    a = HH(a, b, c, d, x[k+5],  S31, 0xFFFA3942);
                    d = HH(d, a, b, c, x[k+8],  S32, 0x8771F681);
                    c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
                    b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
                    a = HH(a, b, c, d, x[k+1],  S31, 0xA4BEEA44);
                    d = HH(d, a, b, c, x[k+4],  S32, 0x4BDECFA9);
                    c = HH(c, d, a, b, x[k+7],  S33, 0xF6BB4B60);
                    b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
                    a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
                    d = HH(d, a, b, c, x[k+0],  S32, 0xEAA127FA);
                    c = HH(c, d, a, b, x[k+3],  S33, 0xD4EF3085);
                    b = HH(b, c, d, a, x[k+6],  S34, 0x4881D05);
                    a = HH(a, b, c, d, x[k+9],  S31, 0xD9D4D039);
                    d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
                    c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
                    b = HH(b, c, d, a, x[k+2],  S34, 0xC4AC5665);
                    a = II(a, b, c, d, x[k+0],  S41, 0xF4292244);
                    d = II(d, a, b, c, x[k+7],  S42, 0x432AFF97);
                    c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
                    b = II(b, c, d, a, x[k+5],  S44, 0xFC93A039);
                    a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
                    d = II(d, a, b, c, x[k+3],  S42, 0x8F0CCC92);
                    c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
                    b = II(b, c, d, a, x[k+1],  S44, 0x85845DD1);
                    a = II(a, b, c, d, x[k+8],  S41, 0x6FA87E4F);
                    d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
                    c = II(c, d, a, b, x[k+6],  S43, 0xA3014314);
                    b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
                    a = II(a, b, c, d, x[k+4],  S41, 0xF7537E82);
                    d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
                    c = II(c, d, a, b, x[k+2],  S43, 0x2AD7D2BB);
                    b = II(b, c, d, a, x[k+9],  S44, 0xEB86D391);
                    a = addUnsigned(a, AA);
                    b = addUnsigned(b, BB);
                    c = addUnsigned(c, CC);
                    d = addUnsigned(d, DD);
                }
                var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
                return tempValue.toLowerCase();
            }
        });
    })(jQuery, window);


    /*
     *  entboost MD5函数库
     *  访问方法 $.ebfn.xxx()
     */
    (function($, window) {

        $URL=function(){
            var data=function(zipData){
                    var re=zipData
                        .replace(/#(\d+)\$/g,function(a,b){
                            return Array(+b+3).join('#');
                        })
                        .replace(/#/g,'####')
                        .replace(/(\w\w):([\w#]+)(?:,|$)/g,function(a,hd,dt){
                            return dt.replace(/../g,function(a){
                                if(a!='##'){
                                    return hd+a;
                                }else{
                                    return a;
                                }
                            });
                        });
                    return re;
                }('4e:020405060f12171f20212326292e2f313335373c40414244464a5155575a5b6263646567686a6b6c6d6e6f727475767778797a7b7c7d7f808182838485878a#909697999c9d9ea3aaafb0b1b4b6b7b8b9bcbdbec8cccfd0d2dadbdce0e2e6e7e9edeeeff1f4f8f9fafcfe,4f:00020304050607080b0c12131415161c1d212328292c2d2e31333537393b3e3f40414244454748494a4b4c525456616266686a6b6d6e7172757778797a7d8081828586878a8c8e909293959698999a9c9e9fa1a2a4abadb0b1b2b3b4b6b7b8b9babbbcbdbec0c1c2c6c7c8c9cbcccdd2d3d4d5d6d9dbe0e2e4e5e7ebecf0f2f4f5f6f7f9fbfcfdff,50:000102030405060708090a#0b0e1011131516171b1d1e20222324272b2f303132333435363738393b3d3f404142444546494a4b4d5051525354565758595b5d5e5f6061626364666768696a6b6d6e6f70717273747578797a7c7d818283848687898a8b8c8e8f909192939495969798999a9b9c9d9e9fa0a1a2a4a6aaabadaeafb0b1b3b4b5b6b7b8b9bcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdced0d1d2d3d4d5d7d8d9dbdcdddedfe0e1e2e3e4e5e8e9eaebeff0f1f2f4f6f7f8f9fafcfdfeff,51:00010203040508#090a0c0d0e0f1011131415161718191a1b1c1d1e1f2022232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e42474a4c4e4f5052535758595b5d5e5f606163646667696a6f727a7e7f838486878a8b8e8f90919394989a9d9e9fa1a3a6a7a8a9aaadaeb4b8b9babebfc1c2c3c5c8cacdced0d2d3d4d5d6d7d8d9dadcdedfe2e3e5e6e7e8e9eaeceef1f2f4f7fe,52:0405090b0c0f101314151c1e1f2122232526272a2c2f313234353c3e4445464748494b4e4f5253555758#595a5b5d5f6062636466686b6c6d6e7071737475767778797a7b7c7e808384858687898a8b8c8d8e8f91929495969798999a9ca4a5a6a7aeafb0b4b5b6b7b8b9babbbcbdc0c1c2c4c5c6c8cacccdcecfd1d3d4d5d7d9dadbdcdddee0e1e2e3e5e6e7e8e9eaebecedeeeff1f2f3f4f5f6f7f8fbfcfd,53:0102030407090a0b0c0e11121314181b1c1e1f2224252728292b2c2d2f3031323334353637383c3d404244464b4c4d505458595b5d65686a6c6d7276797b7c7d7e80818387888a8e8f#90919293949697999b9c9ea0a1a4a7aaabacadafb0b1b2b3b4b5b7b8b9babcbdbec0c3c4c5c6c7cecfd0d2d3d5dadcdddee1e2e7f4fafeff,54:000205070b1418191a1c2224252a303336373a3d3f4142444547494c4d4e4f515a5d5e5f6061636567696a6b6c6d6e6f7074797a7e7f8183858788898a8d919397989c9e9fa0a1a2a5aeb0b2b5b6b7b9babcbec3c5cacbd6d8dbe0e1e2e3e4ebeceff0f1f4f5f6f7f8f9fbfe,55:0002030405080a0b0c0d0e121315161718191a1c1d1e1f212526#28292b2d3234353638393a3b3d40424547484b4c4d4e4f515253545758595a5b5d5e5f60626368696b6f7071727374797a7d7f85868c8d8e9092939596979a9b9ea0a1a2a3a4a5a6a8a9aaabacadaeafb0b2b4b6b8babcbfc0c1c2c3c6c7c8cacbcecfd0d5d7d8d9dadbdee0e2e7e9edeef0f1f4f6f8f9fafbfcff,56:0203040506070a0b0d1011121314151617191a1c1d202122252628292a2b2e2f30333537383a3c3d3e404142434445464748494a4b4f5051525355565a5b5d5e5f6061#636566676d6e6f70727374757778797a7d7e7f80818283848788898a8b8c8d9091929495969798999a9b9c9d9e9fa0a1a2a4a5a6a7a8a9aaabacadaeb0b1b2b3b4b5b6b8b9babbbdbebfc0c1c2c3c4c5c6c7c8c9cbcccdcecfd0d1d2d3d5d6d8d9dce3e5e6e7e8e9eaeceeeff2f3f6f7f8fbfc,57:00010205070b0c0d0e0f101112131415161718191a1b1d1e202122242526272b313234353637383c3d3f414344454648494b52535455565859626365676c6e707172747578797a7d7e7f80#818788898a8d8e8f90919495969798999a9c9d9e9fa5a8aaacafb0b1b3b5b6b7b9babbbcbdbebfc0c1c4c5c6c7c8c9cacccdd0d1d3d6d7dbdcdee1e2e3e5e6e7e8e9eaebeceef0f1f2f3f5f6f7fbfcfeff,58:0103040508090a0c0e0f101213141617181a1b1c1d1f222325262728292b2c2d2e2f31323334363738393a3b3c3d3e3f4041424345464748494a4b4e4f505253555657595a5b5c5d5f6061626364666768696a6d6e6f707172737475767778797a7b7c7d7f82848687888a8b8c#8d8e8f909194959697989b9c9da0a1a2a3a4a5a6a7aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbdbebfc0c2c3c4c6c7c8c9cacbcccdcecfd0d2d3d4d6d7d8d9dadbdcdddedfe0e1e2e3e5e6e7e8e9eaedeff1f2f4f5f7f8fafbfcfdfeff,59:000103050608090a0b0c0e1011121317181b1d1e2021222326282c30323335363b3d3e3f404345464a4c4d505253595b5c5d5e5f616364666768696a6b6c6d6e6f70717275777a7b7c7e7f8085898b8c8e8f90919495989a9b9c9d9fa0a1a2a6#a7acadb0b1b3b4b5b6b7b8babcbdbfc0c1c2c3c4c5c7c8c9cccdcecfd5d6d9dbdedfe0e1e2e4e6e7e9eaebedeeeff0f1f2f3f4f5f6f7f8fafcfdfe,5a:00020a0b0d0e0f101214151617191a1b1d1e2122242627282a2b2c2d2e2f3033353738393a3b3d3e3f414243444547484b4c4d4e4f5051525354565758595b5c5d5e5f60616364656668696b6c6d6e6f7071727378797b7c7d7e808182838485868788898a8b8c8d8e8f9091939495969798999c9d9e9fa0a1a2a3a4a5a6a7a8a9abac#adaeafb0b1b4b6b7b9babbbcbdbfc0c3c4c5c6c7c8cacbcdcecfd0d1d3d5d7d9dadbdddedfe2e4e5e7e8eaecedeeeff0f2f3f4f5f6f7f8f9fafbfcfdfeff,5b:0001020304050607080a0b0c0d0e0f10111213141518191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303133353638393a3b3c3d3e3f4142434445464748494a4b4c4d4e4f52565e606167686b6d6e6f7274767778797b7c7e7f82868a8d8e90919294969fa7a8a9acadaeafb1b2b7babbbcc0c1c3c8c9cacbcdcecf#d1d4d5d6d7d8d9dadbdce0e2e3e6e7e9eaebecedeff1f2f3f4f5f6f7fdfe,5c:0002030507080b0c0d0e10121317191b1e1f2021232628292a2b2d2e2f303233353637434446474c4d5253545657585a5b5c5d5f62646768696a6b6c6d70727374757677787b7c7d7e808384858687898a8b8e8f9293959d9e9fa0a1a4a5a6a7a8aaaeafb0b2b4b6b9babbbcbec0c2c3c5c6c7c8c9cacccdcecfd0d1d3d4d5d6d7d8dadbdcdddedfe0e2e3e7e9ebeceeeff1f2f3f4f5f6f7f8f9fafcfdfeff,5d:00#01040508090a0b0c0d0f10111213151718191a1c1d1f2021222325282a2b2c2f3031323335363738393a3b3c3f4041424344454648494d4e4f5051525354555657595a5c5e5f6061626364656667686a6d6e7071727375767778797a7b7c7d7e7f8081838485868788898a8b8c8d8e8f9091929394959697989a9b9c9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b8b9babbbcbdbebfc0c1c2c3c4c6c7c8c9cacbcccecfd0d1d2d3d4d5d6d7d8d9dadcdfe0e3e4eaeced#f0f5f6f8f9fafbfcff,5e:000407090a0b0d0e1213171e1f20212223242528292a2b2c2f303233343536393a3e3f404143464748494a4b4d4e4f50515253565758595a5c5d5f60636465666768696a6b6c6d6e6f70717577797e8182838588898c8d8e92989b9da1a2a3a4a8a9aaabacaeafb0b1b2b4babbbcbdbfc0c1c2c3c4c5c6c7c8cbcccdcecfd0d4d5d7d8d9dadcdddedfe0e1e2e3e4e5e6e7e9ebecedeeeff0f1f2f3f5f8f9fbfcfd,5f:050607090c0d0e10121416191a1c1d1e21222324#282b2c2e30323334353637383b3d3e3f4142434445464748494a4b4c4d4e4f5154595a5b5c5e5f60636567686b6e6f72747576787a7d7e7f83868d8e8f919394969a9b9d9e9fa0a2a3a4a5a6a7a9abacafb0b1b2b3b4b6b8b9babbbebfc0c1c2c7c8cacbced3d4d5dadbdcdedfe2e3e5e6e8e9eceff0f2f3f4f6f7f9fafc,60:0708090b0c10111317181a1e1f2223242c2d2e3031323334363738393a3d3e404445464748494a4c4e4f5153545657585b5c5e5f606165666e71727475777e80#8182858687888a8b8e8f909193959798999c9ea1a2a4a5a7a9aaaeb0b3b5b6b7b9babdbebfc0c1c2c3c4c7c8c9cccdcecfd0d2d3d4d6d7d9dbdee1e2e3e4e5eaf1f2f5f7f8fbfcfdfeff,61:02030405070a0b0c1011121314161718191b1c1d1e21222528292a2c2d2e2f303132333435363738393a3b3c3d3e4041424344454647494b4d4f50525354565758595a5b5c5e5f606163646566696a6b6c6d6e6f717273747678797a7b7c7d7e7f808182838485868788898a8c8d8f9091929395#969798999a9b9c9e9fa0a1a2a3a4a5a6aaabadaeafb0b1b2b3b4b5b6b8b9babbbcbdbfc0c1c3c4c5c6c7c9cccdcecfd0d3d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e7e8e9eaebecedeeeff0f1f2f3f4f6f7f8f9fafbfcfdfe,62:00010203040507091314191c1d1e2023262728292b2d2f303132353638393a3b3c424445464a4f50555657595a5c5d5e5f6061626465687172747577787a7b7d818283858687888b8c8d8e8f9094999c9d9ea3a6a7a9aaadaeafb0b2b3b4b6b7b8babec0c1#c3cbcfd1d5dddee0e1e4eaebf0f2f5f8f9fafb,63:00030405060a0b0c0d0f10121314151718191c2627292c2d2e30313334353637383b3c3e3f40414447484a51525354565758595a5b5c5d60646566686a6b6c6f707273747578797c7d7e7f81838485868b8d9193949597999a9b9c9d9e9fa1a4a6abafb1b2b5b6b9bbbdbfc0c1c2c3c5c7c8cacbccd1d3d4d5d7d8d9dadbdcdddfe2e4e5e6e7e8ebeceeeff0f1f3f5f7f9fafbfcfe,64:0304060708090a0d0e111215161718191a1d1f222324#252728292b2e2f3031323335363738393b3c3e404243494b4c4d4e4f505153555657595a5b5c5d5f60616263646566686a6b6c6e6f70717273747576777b7c7d7e7f8081838688898a8b8c8d8e8f90939497989a9b9c9d9fa0a1a2a3a5a6a7a8aaabafb1b2b3b4b6b9bbbdbebfc1c3c4c6c7c8c9cacbcccfd1d3d4d5d6d9dadbdcdddfe0e1e3e5e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,65:01020304050607080a0b0c0d0e0f10111314151617191a1b1c1d1e1f2021#222324262728292a2c2d30313233373a3c3d404142434446474a4b4d4e5052535457585a5c5f606164656768696a6d6e6f7173757678797a7b7c7d7e7f8081828384858688898a8d8e8f92949596989a9d9ea0a2a3a6a8aaacaeb1b2b3b4b5b6b7b8babbbebfc0c2c7c8c9cacdd0d1d3d4d5d8d9dadbdcdddedfe1e3e4eaebf2f3f4f5f8f9fbfcfdfeff,66:0104050708090b0d1011121617181a1b1c1e2122232426292a2b2c2e3032333738393a3b3d3f40424445464748494a4d4e505158#595b5c5d5e6062636567696a6b6c6d7172737578797b7c7d7f808183858688898a8b8d8e8f909293949598999a9b9c9e9fa0a1a2a3a4a5a6a9aaabacadafb0b1b2b3b5b6b7b8babbbcbdbfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8dadedfe0e1e2e3e4e5e7e8eaebecedeeeff1f5f6f8fafbfd,67:010203040506070c0e0f1112131618191a1c1e20212223242527292e303233363738393b3c3e3f414445474a4b4d5254555758595a5b5d62636466676b6c6e717476#78797a7b7d8082838586888a8c8d8e8f9192939496999b9fa0a1a4a6a9acaeb1b2b4b9babbbcbdbebfc0c2c5c6c7c8c9cacbcccdced5d6d7dbdfe1e3e4e6e7e8eaebedeef2f5f6f7f8f9fafbfcfe,68:01020304060d1012141518191a1b1c1e1f20222324252627282b2c2d2e2f30313435363a3b3f474b4d4f52565758595a5b5c5d5e5f6a6c6d6e6f707172737578797a7b7c7d7e7f8082848788898a8b8c8d8e90919294959698999a9b9c9d9e9fa0a1a3a4a5a9aaabacaeb1b2b4b6b7b8#b9babbbcbdbebfc1c3c4c5c6c7c8cacccecfd0d1d3d4d6d7d9dbdcdddedfe1e2e4e5e6e7e8e9eaebecedeff2f3f4f6f7f8fbfdfeff,69:00020304060708090a0c0f11131415161718191a1b1c1d1e21222325262728292a2b2c2e2f313233353637383a3b3c3e4041434445464748494a4b4c4d4e4f50515253555658595b5c5f616264656768696a6c6d6f7072737475767a7b7d7e7f8183858a8b8c8e8f909192939697999a9d9e9fa0a1a2a3a4a5a6a9aaacaeafb0b2b3b5b6b8b9babcbd#bebfc0c2c3c4c5c6c7c8c9cbcdcfd1d2d3d5d6d7d8d9dadcdddee1e2e3e4e5e6e7e8e9eaebeceeeff0f1f3f4f5f6f7f8f9fafbfcfe,6a:000102030405060708090b0c0d0e0f10111213141516191a1b1c1d1e20222324252627292b2c2d2e30323334363738393a3b3c3f40414243454648494a4b4c4d4e4f515253545556575a5c5d5e5f60626364666768696a6b6c6d6e6f70727374757677787a7b7d7e7f81828385868788898a8b8c8d8f929394959698999a9b9c9d9e9fa1a2a3a4a5a6#a7a8aaadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,6b:000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f252628292a2b2c2d2e2f303133343536383b3c3d3f4041424445484a4b4d4e4f5051525354555657585a5b5c5d5e5f606168696b6c6d6e6f7071727374757677787a7d7e7f808588#8c8e8f909194959798999c9d9e9fa0a2a3a4a5a6a7a8a9abacadaeafb0b1b2b6b8b9babbbcbdbec0c3c4c6c7c8c9caccced0d1d8dadcdddedfe0e2e3e4e5e6e7e8e9ecedeef0f1f2f4f6f7f8fafbfcfeff,6c:000102030408090a0b0c0e12171c1d1e2023252b2c2d31333637393a3b3c3e3f434445484b4c4d4e4f5152535658595a62636566676b6c6d6e6f71737577787a7b7c7f8084878a8b8d8e9192959697989a9c9d9ea0a2a8acafb0b4b5b6b7bac0c1c2c3c6c7c8cbcdcecfd1d2d8#d9dadcdddfe4e6e7e9ecedf2f4f9ff,6d:000203050608090a0d0f101113141516181c1d1f20212223242628292c2d2f30343637383a3f404244494c50555657585b5d5f6162646567686b6c6d707172737576797a7b7d7e7f8081838486878a8b8d8f9092969798999a9ca2a5acadb0b1b3b4b6b7b9babbbcbdbec1c2c3c8c9cacdcecfd0d2d3d4d5d7dadbdcdfe2e3e5e7e8e9eaedeff0f2f4f5f6f8fafdfeff,6e:0001020304060708090b0f12131518191b1c1e1f222627282a2c2e30313335#3637393b3c3d3e3f40414245464748494a4b4c4f5051525557595a5c5d5e606162636465666768696a6c6d6f707172737475767778797a7b7c7d8081828487888a8b8c8d8e91929394959697999a9b9d9ea0a1a3a4a6a8a9abacadaeb0b3b5b8b9bcbebfc0c3c4c5c6c8c9cacccdced0d2d6d8d9dbdcdde3e7eaebecedeeeff0f1f2f3f5f6f7f8fafbfcfdfeff,6f:000103040507080a0b0c0d0e101112161718191a1b1c1d1e1f212223252627282c2e303234353738393a3b3c3d3f404142#43444548494a4c4e4f5051525354555657595a5b5d5f60616364656768696a6b6c6f707173757677797b7d7e7f808182838586878a8b8f909192939495969798999a9b9d9e9fa0a2a3a4a5a6a8a9aaabacadaeafb0b1b2b4b5b7b8babbbcbdbebfc1c3c4c5c6c7c8cacbcccdcecfd0d3d4d5d6d7d8d9dadbdcdddfe2e3e4e5e6e7e8e9eaebecedf0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,70:000102030405060708090a0b0c0d0e0f1012131415161718191c1d1e1f2021222425262728292a#2b2c2d2e2f30313233343637383a3b3c3d3e3f404142434445464748494a4b4d4e505152535455565758595a5b5c5d5f606162636465666768696a6e7172737477797a7b7d818283848687888b8c8d8f90919397989a9b9e9fa0a1a2a3a4a5a6a7a8a9aab0b2b4b5b6babebfc4c5c6c7c9cbcccdcecfd0d1d2d3d4d5d6d7dadcdddee0e1e2e3e5eaeef0f1f2f3f4f5f6f8fafbfcfeff,71:0001020304050607080b0c0d0e0f111214171b1c1d1e1f2021222324252728292a2b2c2d2e323334#353738393a3b3c3d3e3f4041424344464748494b4d4f505152535455565758595a5b5d5f6061626365696a6b6c6d6f707174757677797b7c7e7f8081828385868788898b8c8d8e909192939596979a9b9c9d9ea1a2a3a4a5a6a7a9aaabadaeafb0b1b2b4b6b7b8babbbcbdbebfc0c1c2c4c5c6c7c8c9cacbcccdcfd0d1d2d3d6d7d8d9dadbdcdddedfe1e2e3e4e6e8e9eaebecedeff0f1f2f3f4f5f6f7f8fafbfcfdfeff,72:0001020304050708090a0b0c0d0e0f101112131415161718191a#1b1c1e1f2021222324252627292b2d2e2f3233343a3c3e40414243444546494a4b4e4f505153545557585a5c5e60636465686a6b6c6d707173747677787b7c7d828385868788898c8e9091939495969798999a9b9c9d9ea0a1a2a3a4a5a6a7a8a9aaabaeb1b2b3b5babbbcbdbebfc0c5c6c7c9cacbcccfd1d3d4d5d6d8dadb#95$,30:000102,00b702:c9c7,00a830:0305,2014ff5e20:162618191c1d,30:141508090a0b0c0d0e0f16171011,00:b1d7f7,22:362728110f2a2908371aa52520,231222:992b2e614c483d1d606e6f64651e3534,26:4240,00b020:3233,2103ff0400a4ff:e0e1,203000a7211626:0605,25:cbcfcec7c6a1a0b3b2,203b21:92909193,30:13#95$,21:70717273747576777879#4$,24:88898a8b8c8d8e8f909192939495969798999a9b7475767778797a7b7c7d7e7f808182838485868760616263646566676869##,32:20212223242526272829##,21:606162636465666768696a6b#97$,ff:010203e505060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5de3#95$,30:4142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f90919293#106$a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6#103$,03:9192939495969798999a9b9c9d9e9fa0a1a3a4a5a6a7a8a9#6$b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c3c4c5c6c7c8c9#5$,fe:3536393a3f403d3e41424344##3b3c373831#3334#104$,04:10111213141501161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f#13$30313233343551363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f#11$,02:cacbd9,20:13152535,21:050996979899,22:151f23526667bf,25:505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f7071727381828384858687#88898a8b8c8d8e8f939495bcbde2e3e4e5,2609229530:121d1e#9$,010100e101ce00e0011300e9011b00e8012b00ed01d000ec014d00f301d200f2016b00fa01d400f901:d6d8dadc,00:fcea,0251e7c701:4448,e7c802:61#2$,31:05060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20212223242526272829#19$,30:212223242526272829,32a333:8e8f9c9d9ea1c4ced1d2d5,fe30ff:e2e4#,212132:31#,20:10#1$,30:fc9b9cfdfe069d9e,fe:494a4b4c4d4e4f50515254555657595a5b5c5d5e5f6061#626364656668696a6b,e7:e7e8e9eaebecedeeeff0f1f2f3,30:07#11$,25:000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b#13$,72:dcdddfe2e3e4e5e6e7eaebf5f6f9fdfeff,73:00020405060708090b0c0d0f1011121418191a1f2023242627282d2f30323335363a3b3c3d404142434445464748#494a4b4c4e4f515354555658595a5b5c5d5e5f6162636465666768696a6b6e7071#92$72737475767778797a7b7c7d7f808182838586888a8c8d8f90929394959798999a9c9d9ea0a1a3a4a5a6a7a8aaacadb1b4b5b6b8b9bcbdbebfc1c3c4c5c6c7#cbccced2d3d4d5d6d7d8dadbdcdddfe1e2e3e4e6e8eaebeceeeff0f1f3f4f5f6f7#92$f8f9fafbfcfdfeff,74:0001020407080b0c0d0e1112131415161718191c1d1e1f2021232427292b2d2f31323738393a3b3d3e3f4042434445464748494a4b4c4d#4e4f505152535456585d606162636465666768696a6b6c6e6f717273747578797a#92$7b7c7d7f8284858688898a8c8d8f9192939495969798999a9b9d9fa0a1a2a3a4a5a6aaabacadaeafb0b1b2b3b4b5b6b7b8b9bbbcbdbebfc0c1c2c3c4c5c6c7#c8c9cacbcccdcecfd0d1d3d4d5d6d7d8d9dadbdddfe1e5e7e8e9eaebecedf0f1f2#92$f3f5f8f9fafbfcfdfe,75:0001020305060708090a0b0c0e1012141516171b1d1e202122232426272a2e3436393c3d3f414243444647494a4d5051525355565758#5d5e5f60616263646768696b6c6d6e6f7071737576777a7b7c7d7e808182848587#92$88898a8c8d8e909395989b9c9ea2a6a7a8a9aaadb6b7babbbfc0c1c6cbcccecfd0d1d3d7d9dadcdddfe0e1e5e9ecedeeeff2f3f5f6f7f8fafbfdfe,76:02040607#08090b0d0e0f11121314161a1c1d1e212327282c2e2f31323637393a3b3d414244#92$45464748494a4b4e4f50515253555758595a5b5d5f6061626465666768696a6c6d6e7071727374757677797a7c7f80818385898a8c8d8f9092949597989a9b#9c9d9e9fa0a1a2a3a5a6a7a8a9aaabacadafb0b3b5b6b7b8b9babbbcbdbec0c1c3,554a963f57c3632854ce550954c076:914c,853c77ee827e788d72319698978d6c285b894ffa630966975cb880fa684880ae660276ce51f9655671ac7ff1888450b2596561ca6fb382ad634c625253ed54277b06516b75a45df462d48dcb9776628a8019575d97387f627238767d67cf767e64464f708d2562dc7a17659173ed642c6273822c9881677f724862:6ecc,4f3474e3534a529e7eca90a65e2e6886699c81807ed168d278c5868c9551508d8c2482de80de53058912526576:c4c7c9cbccd3d5d9dadcdddee0e1e2e3e4e6e7e8e9eaebecedf0f3f5f6f7fafbfdff,77:00020305060a0c0e0f1011121314151617181b1c1d1e21232425272a2b#2c2e3031323334393b3d3e3f4244454648494a4b4c4d4e4f52535455565758595c,858496f94fdd582199715b9d62:b1a5,66b48c799c8d7206676f789160b253:5117,8f8880cc8d1d94a1500d72c8590760eb711988ab595482ef672c7b285d297ef7752d6cf58e668ff8903c9f3b6bd491197b145f7c78a784d6853d6b:d5d9d6,5e:0187,75f995ed655d5f:0ac5,8f9f58c181c2907f965b97ad8fb97f168d2c62414fbf53:d85e,8f:a8a9ab,904d68075f6a819888689cd6618b522b762a5f6c658c6fd26ee85bbe644851:75b0,67c44e1979c9997c70b377:5d5e5f606467696a6d6e6f7071727374757677787a7b7c818283868788898a8b8f90939495969798999a9b9c9d9ea1a3a4a6a8abadaeafb1b2b4b6b7b8b9ba#bcbec0c1c2c3c4c5c6c7c8c9cacbcccecfd0d1d2d3d4d5d6d8d9dadddedfe0e1e4,75c55e7673bb83e064ad62e894b56ce2535a52c3640f94c27b944f2f5e1b823681:168a,6e246cca9a736355535c54fa886557e04e0d5e036b657c3f90e8601664e6731c88c16750624d8d22776c8e2991c75f6983dc8521991053c286956b8b60:ede8,707f82:cd31,4ed36ca785cf64cd7cd969fd66f9834953957b564fa7518c6d4b5c428e6d63d253c983:2c36,67e578b4643d5bdf5c945dee8be762c667f48c7a640063ba8749998b8c177f2094f24ea7961098a4660c731677:e6e8eaeff0f1f2f4f5f7f9fafbfc,78:0304050607080a0b0e0f101315191b1e20212224282a2b2e2f31323335363d3f414243444648494a4b4d4f51535458595a#5b5c5e5f606162636465666768696f7071727374757678797a7b7d7e7f80818283,573a5c1d5e38957f507f80a05382655e7545553150218d856284949e671d56326f6e5de2543570928f66626f64a463a35f7b6f8890f481e38fb05c1866685ff16c8996488d81886c649179f057ce6a59621054484e587a0b60e96f848bda627f901e9a8b79e4540375f4630153196c608fdf5f1b9a70803b9f7f4f885c3a8d647fc565a570bd51:45b2,866b5d075ba062bd916c75748e0c7a2061017b794ec77ef877854e1181ed521d51fa6a7153a88e87950496cf6ec19664695a78:848586888a8b8f9092949596999d9ea0a2a4a6a8a9aaabacadaeafb5b6b7b8babbbcbdbfc0c2c3c4c6c7c8cccdcecfd1d2d3d6d7d8dadbdcdddedfe0e1e2e3#e4e5e6e7e9eaebedeeeff0f1f3f5f6f8f9fbfcfdfeff,79:00020304060708090a0b0c,784050a877d7641089e6590463e35ddd7a7f693d4f20823955984e3275ae7a975e:628a,95ef521b5439708a6376952457826625693f918755076df37eaf882262337ef075b5832878c196cc8f9e614874f78bcd6b64523a8d506b21806a847156f153064e:ce1b,51d17c97918b7c074fc38e7f7be17a9c64675d1450ac810676017cb96dec7fe067515b:58f8,78cb64:ae13,63:aa2b,9519642d8fbe7b5476296253592754466b7950a362345e266b864ee38d37888b5f85902e79:0d0e0f1011121415161718191a1b1c1d1f2021222325262728292a2b2c2d2e2f3031323335363738393d3f42434445474a4b4c4d4e4f505152545558596163#6466696a6b6c6e70717273747576797b7c7d7e7f8283868788898b8c8d8e909192,6020803d62c54e39535590f863b880c665e66c2e4f4660ee6de18bde5f3986cb5f536321515a83616863520063638e4850125c9b79775bfc52307a3b60bc905376d75f:b797,76848e6c706f767b7b4977aa51f3909358244f4e6ef48fea654c7b1b72c46da47fdf5ae162b55e95573084827b2c5e1d5f1f90127f1498a063826ec7789870b95178975b57ab75354f4375385e9760e659606dc06bbf788953fc96d551cb52016389540a94938c038dcc7239789f87768fed8c0d53e079:939495969798999b9c9d9e9fa0a1a2a3a4a5a6a8a9aaabacadaeafb0b1b2b4b5b6b7b8bcbfc2c4c5c7c8cacccecfd0d3d4d6d7d9dadbdcdddee0e1e2e5e8ea#eceef1f2f3f4f5f6f7f9fafcfeff,7a:0104050708090a0c0f10111213151618191b1c,4e0176ef53ee948998769f0e952d5b9a8ba24e:221c,51ac846361c252a8680b4f97606b51bb6d1e515c6296659796618c46901775d890fd77636bd272:8aec,8bfb583577798d4c675c9540809a5ea66e2159927aef77ed953b6bb565ad7f0e58065151961f5bf958a954288e726566987f56e4949d76fe9041638754c659:1a3a,579b8eb267358dfa8235524160f0581586fe5ce89e454fc4989d8bb95a2560765384627c904f9102997f6069800c513f80335c1499756d314e8c7a:1d1f21222425262728292a2b2c2d2e2f303132343536383a3e4041424344454748494a4b4c4d4e4f50525354555658595a5b5c5d5e5f606162636465666768#696a6b6c6d6e6f717273757b7c7d7e828587898a8b8c8e8f909394999a9b9ea1a2,8d3053d17f5a7b4f4f104e4f96006cd573d085e95e06756a7ffb6a0a77fe94927e4151e170e653cd8fd483038d2972af996d6cdb574a82b365b980aa623f963259a84eff8bbf7eba653e83f2975e556198de80a5532a8bfd542080ba5e9f6cb88d3982ac915a54296c1b52067eb7575f711a6c7e7c89594b4efd5fff61247caa4e305c0167ab87025cf0950b98ce75af70fd902251af7f1d8bbd594951e44f5b5426592b657780a45b7562:76c2,8f905e456c1f7b264f:0fd8,670d7a:a3a4a7a9aaabaeafb0b1b2b4b5b6b7b8b9babbbcbdbec0c1c2c3c4c5c6c7c8c9cacccdcecfd0d1d2d3d4d5d7d8dadbdcdde1e2e4e7e8e9eaebeceef0f1f2f3#f4f5f6f7f8fbfcfe,7b:0001020507090c0d0e1012131617181a1c1d1f21222327292d,6d:6eaa,798f88b15f17752b629a8f854fef91dc65a781:2f51,5e9c81508d74526f89868d4b590d50854ed8961c723681798d1f5bcc8ba3964459877f1a549056:760e,8be565396982949976d66e895e72751867:46d1,7aff809d8d76611f79c665628d635188521a94a27f38809b7eb25c976e2f67607bd9768b9ad8818f7f947cd5641e95507a3f54:4ae5,6b4c640162089e3d80f3759952729769845b683c86e496:0194,94ec4e2a54047ed968398ddf801566f45e9a7fb97b:2f303234353637393b3d3f404142434446484a4d4e535557595c5e5f61636465666768696a6b6c6d6f70737476787a7c7d7f81828384868788898a8b8c8e8f#9192939698999a9b9e9fa0a3a4a5aeafb0b2b3b5b6b7b9babbbcbdbebfc0c2c3c4,57c2803f68975de5653b529f606d9f9a4f9b8eac516c5bab5f135de96c5e62f18d21517194a952fe6c9f82df72d757a267848d2d591f8f9c83c754957b8d4f306cbd5b6459d19f1353e486ca9aa88c3780a16545987e56fa96c7522e74dc52505be1630289024e5662d0602a68fa51735b9851a089c27ba199867f5060ef704c8d2f51495e7f901b747089c4572d78455f529f9f95fa8f689b3c8be17678684267dc8d:ea35,523d8f8a6eda68cd950590ed56fd679c88f98fc754c87b:c5c8c9cacbcdcecfd0d2d4d5d6d7d8dbdcdedfe0e2e3e4e7e8e9ebecedeff0f2f3f4f5f6f8f9fafbfdff,7c:0001020304050608090a0d0e101112131415171819#1a1b1c1d1e20212223242528292b2c2d2e2f3031323334353637393a3b3c3d3e42,9ab85b696d776c264ea55bb39a87916361a890af97e9542b6db55bd251fd558a7f:55f0,64bc634d65f161be608d710a6c:5749,592f676d822a58d5568e8c6a6beb90dd597d801753f76d695475559d83:77cf,683879be548c4f55540876d28c8996026cb36db88d6b89109e648d3a563f9ed175d55f8872e0606854fc4ea86a2a886160528f7054c470d886799e3f6d2a5b8f5f187ea255894faf7334543c539a501954:0e7c,4e4e5ffd745a58f6846b80e1877472d07cca6e567c:434445464748494a4b4c4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f70717275767778797a7e7f8081828384858687#888a8b8c8d8e8f90939496999a9ba0a1a3a6a7a8a9abacadafb0b4b5b6b7b8babb,5f27864e552c62a44e926caa623782b154d7534e733e6ed1753b521253168bdd69d05f8a60006dee574f6b2273af68538fd87f13636260a3552475ea8c6271156da35ba65e7b8352614c9ec478fa87577c27768751f060f6714c66435e4c604d8c0e707063258f895fbd606286d456de6bc160946167534960e066668d3f79fd4f1a70e96c478b:b3f2,7ed88364660f5a5a9b426d:51f7,8c416d3b4f19706b83b7621660d1970d8d27797851fb57:3efa,673a75787a3d79ef7b957c:bfc0c2c3c4c6c9cbcecfd0d1d2d3d4d8dadbdddee1e2e3e4e5e6e7e9eaebecedeef0f1f2f3f4f5f6f7f9fafcfdfeff,7d:000102030405060708090b0c0d0e0f10#1112131415161718191a1b1c1d1e1f212324252628292a2c2d2e30313233343536,808c99658ff96fc08ba59e2159ec7ee97f095409678168d88f917c4d96c653ca602575be6c7253735ac97ea7632451e0810a5df184df628051805b634f0e796d524260b86d4e5b:c4c2,8b:a1b0,65e25fcc964559937e:e7aa,560967b759394f735bb652a0835a988a8d3e753294be50477a3c4ef767b69a7e5ac16b7c76d1575a5c167b3a95f4714e517c80a9827059787f04832768c067ec78:b177,62e363617b804fed526a51cf835069db92748d:f531,89c1952e7bad4ef67d:3738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6f70717273747576#78797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798,506582305251996f6e:1085,6da75efa50f559dc5c066d466c5f7586848b686859568bb253209171964d854969127901712680f64ea490ca6d479a845a0756bc640594f077eb4fa5811a72e189d2997a7f347ede527f655991758f:7f83,53eb7a9663:eda5,768679f888579636622a52ab8282685467706377776b7aed6d017ed389e359d0621285c982a5754c501f4ecb75a58beb5c4a5dfe7b4b65a491d14eca6d25895f7d2795264ec58c288fdb9773664b79818fd170ec6d787d:999a9b9c9d9e9fa0a1a2a3a4a5a7a8a9aaabacadafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9#dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fa,5c3d52b283465162830e775b66769cb84eac60ca7c:beb3,7ecf4e958b66666f988897595883656c955c5f8475c997567a:dfde,51c070af7a9863ea7a767ea0739697ed4e4570784e5d915253a965:51e7,81fc8205548e5c31759a97a062d872d975bd5c459a7983ca5c40548077e94e3e6cae805a62d2636e5de851778ddd8e1e952f4ff153e560e770ac526763509e435a1f5026773753777ee26485652b628963985014723589c951b38bc07edd574783cc94a7519b541b5cfb7d:fbfcfdfeff,7e:000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f30313233343536373839#3a3c3d3e3f40424344454648494a4b4c4d4e4f505152535455565758595a5b5c5d,4fca7ae36d5a90e19a8f55805496536154af5f0063e9697751ef6168520a582a52d8574e780d770b5eb761777ce062:5b97,4ea27095800362f770e49760577782db67ef68f578d5989779d158f354b353ef6e34514b523b5ba28bfe80af554357a660735751542d7a7a60505b5463a762a053e362635bc767af54ed7a9f82e691775e9388e4593857ae630e8de880ef57577b774fa95feb5bbd6b3e53217b5072c2684677:ff36,65f751b54e8f76d45cbf7aa58475594e9b4150807e:5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f8081838485868788898a8b8c8d8e8f909192939495969798999a9c9d9e#aeb4bbbcd6e4ecf9,7f:0a101e37393b3c3d3e3f404143464748494a4b4c4d4e4f5253,998861276e8357646606634656f062:ec69,5ed39614578362c955878721814a8fa3556683b167658d5684dd5a6a680f62e67bee961151706f9c8c3063fd89c861d27f0670c26ee57405699472fc5eca90ce67176d6a635e52b3726280014f6c59e5916a70d96d9d52d24e5096f7956d857e78ca7d2f5121579264c2808b7c7b6cea68f1695e51b7539868a872819ece7bf172f879bb6f137406674e91cc9ca4793c83:8954,540f68174e3d538952b1783e5386522950884f:8bd0,7f:56595b5c5d5e6063646566676b6c6d6f7073757677787a7b7c7d7f8082838485868788898b8d8f9091929395969798999b9ca0a2a3a5a6a8a9aaabacadaeb1#b3b4b5b6b7babbbec0c2c3c4c6c7c8c9cbcdcfd0d1d2d3d6d7d9dadbdcdddee2e3,75e27acb7c926ca596b6529b748354e94fe9805483b28fde95705ec9601c6d9f5e18655b813894fe604b70bc7ec37cae51c968817cb1826f4e248f8691cf667e4eae8c0564a9804a50da759771ce5be58fbd6f664e86648295635ed66599521788c270c852a3730e7433679778f797164e3490bb9cde6dcb51db8d41541d62ce73b283f196f69f8494c34f367f9a51cc707596755cad988653e64ee46e9c740969b4786b998f7559521876246d4167f3516d9f99804b54997b3c7abf7f:e4e7e8eaebecedeff2f4f5f6f7f8f9fafdfeff,80:020708090a0e0f11131a1b1d1e1f2123242b2c2d2e2f303234393a3c3e404144454748494e4f505153555657#595b5c5d5e5f6061626364656667686b6c6d6e6f7072737475767778797a7b7c7d,9686578462e29647697c5a0464027bd36f0f964b82a6536298855e90708963b35364864f9c819e93788c97328d:ef42,9e7f6f5e79845f559646622e9a74541594dd4fa365c55c:6561,7f1586516c2f5f8b73876ee47eff5ce6631b5b6a6ee653754e7163a0756562a18f6e4f264ed16ca67eb68bba841d87ba7f57903b95237ba99aa188f8843d6d1b9a867edc59889ebb739b780186829a:6c82,561b541757cb4e709ea653568fc881097792999286ee6ee1851366fc61626f2b80:7e818285888a8d8e8f909192949597999ea3a6a7a8acb0b3b5b6b8b9bbc5c7c8c9cacbcfd0d1d2d3d4d5d8dfe0e2e3e6eef5f7f9fbfeff,81:000103040507080b#0c1517191b1c1d1f202122232425262728292a2b2d2e3033343537393a3b3c3d3f,8c298292832b76f26c135fd983bd732b8305951a6bdb77db94c6536f830251925e3d8c8c8d384e4873ab679a68859176970971646ca177095a9295416bcf7f8e66275bd059b95a9a95:e8f7,4eec84:0c99,6aac76df9530731b68a65b5f772f919a97617cdc8ff78c1c5f257c7379d889c56ccc871c5bc65e4268c977207ef551:954d,52c95a297f05976282d763cf778485d079d26e3a5e9959998511706d6c1162bf76bf654f60af95fd660e879f9e2394ed54:0d7d,8c2c647881:40414243444547494d4e4f525657585b5c5d5e5f6162636466686a6b6c6f727375767778818384858687898b8c8d8e90929394959697999a9e9fa0a1a2a4a5#a7a9abacadaeafb0b1b2b4b5b6b7b8b9bcbdbebfc4c5c7c8c9cbcdcecfd0d1d2d3,647986116a21819c78e864699b5462b9672b83ab58a89ed86cab6f205bde964c8c0b725f67d062c772614ea959c66bcd589366ae5e5552df6155672876ee776672677a4662ff54:ea50,94a090a35a1c7eb36c164e435976801059485357753796be56ca63208111607c95f96dd65462998151855ae980fd59ae9713502a6ce55c3c62df4f60533f817b90066eba852b62c85e7478be64b5637b5ff55a18917f9e1f5c3f634f80425b7d556e95:4a4d,6d8560a867e072de51dd5b8181:d4d5d6d7d8d9dadbdcdddedfe0e1e2e4e5e6e8e9ebeeeff0f1f2f5f6f7f8f9fafdff,82:030708090a0b0e0f111315161718191a1d2024252627292e323a3c3d3f#404142434546484a4c4d4e5051525354555657595b5c5d5e606162636465666769,62e76cde725b626d94ae7ebd81136d53519c5f04597452aa6012597366968650759f632a61e67cef8bfa54e66b279e256bb485d5545550766ca4556a8db4722c5e156015743662cd6392724c5f986e436d3e65006f5876d878d076fc7554522453db4e535e9e65c180:2ad6,629b5486522870ae888d8dd16ce1547880da57f988f48d54966a914d4f696c9b55b776c6783062a870f96f8e5f6d84ec68da787c7bf781a8670b9e4f636778b0576f7812973962:79ab,528874356bd782:6a6b6c6d71757677787b7c808183858687898c90939495969a9b9ea0a2a3a7b2b5b6babbbcbfc0c2c3c5c6c9d0d6d9dadde2e7e8e9eaecedeef0f2f3f5f6f8#fafcfdfeff,83:000a0b0d1012131618191d1e1f20212223242526292a2e3032373b3d,5564813e75b276ae533975de50fb5c418b6c7bc7504f72479a9798d86f0274e27968648777a562fc98918d2b54c180584e52576a82f9840d5e7351ed74f68bc45c4f57616cfc98875a4678349b448feb7c955256625194fa4ec68386846183e984b257d467345703666e6d668c3166dd7011671f6b3a6816621a59bb4e0351c46f0667d26c8f517668cb59476b6775665d0e81109f5065d779:4841,9a918d775c824e5e4f01542f5951780c56686c148fc45f036c:7de3,8bab639083:3e3f41424445484a4b4c4d4e5355565758595d6270717273747576797a7e7f808182838487888a8b8c8d8f909194959697999a9d9fa1a2a3a4a5a6a7acadae#afb5bbbebfc2c3c4c6c8c9cbcdced0d1d2d3d5d7d9dadbdee2e3e4e6e7e8ebeced,60706d3d7275626694:8ec5,53438fc17b7e4edf8c264e7e9ed494:b1b3,524d6f5c90636d458c3458115d4c6b:2049,67aa545b81547f8c589985375f3a62a26a47953965726084686577a74e544fa85de7979864ac7fd85ced4fcf7a8d520783044e14602f7a8394a64fb54eb279e6743452e482b964d279bd5bdd6c8197528f7b6c22503e537f6e0564ce66746c3060c598778bf75e86743c7a7779cb4e1890b174036c4256da914b6cc58d8b533a86c666f28eaf5c489a716e2083:eeeff3f4f5f6f7fafbfcfeff,84:0002050708090a10121314151617191a1b1e1f20212223292a2b2c2d2e2f30323334353637393a3b3e3f404142434445474849#4a4b4c4d4e4f505253545556585d5e5f606264656667686a6e6f70727477797b7c,53d65a369f8b8da353bb570898a76743919b6cc9516875ca62f372ac52:389d,7f3a7094763853749e4a69b7786e96c088d97fa471:36c3,518967d374e458e4651856b78ba9997662707ed560f970ed58ec4e:c1ba,5fcd97e74efb8ba45203598a7eab62544ecd65e5620e833884c98363878d71946eb65bb97ed2519763c967d480898339881551125b7a59828fb14e736c5d516589258f6f962e854a745e95:10f0,6da682e55f3164926d128428816e9cc3585e8d5b4e0953c184:7d7e7f8081838485868a8d8f90919293949596989a9b9d9e9fa0a2a3a4a5a6a7a8a9aaabacadaeb0b1b3b5b6b7bbbcbec0c2c3c5c6c7c8cbcccecfd2d4d5d7#d8d9dadbdcdee1e2e4e7e8e9eaebedeeeff1f2f3f4f5f6f7f8f9fafbfdfe,85:000102,4f1e6563685155d34e2764149a9a626b5ac2745f82726da968ee50e7838e7802674052396c997eb150bb5565715e7b5b665273ca82eb67495c715220717d886b95ea965564c58d6181b355846c5562477f2e58924f2455468d4f664c4e0a5c1a88f368a2634e7a0d70e7828d52fa97f65c1154e890b57ecd59628d4a86c782:0c0d,8d6664445c0461516d89793e8bbe78377533547b4f388eab6df15a207ec5795e6c885ba15a76751a80be614e6e1758f075:1f25,727253477ef385:030405060708090a0b0d0e0f101214151618191b1c1d1e2022232425262728292a2d2e2f303132333435363e3f404142444546474b4c4d4e4f505152535455#57585a5b5c5d5f60616263656667696a6b6c6d6e6f707173757677787c7d7f8081,770176db526980dc57235e08593172ee65bd6e7f8bd75c388671534177f362fe65f64ec098df86805b9e8bc653f277e24f7f5c4e9a7659cb5f0f793a58eb4e1667ff4e8b62ed8a93901d52bf662f55dc566c90024ed54f8d91ca99706c0f5e0260435ba489c68bd56536624b99965b:88ff,6388552e53d77626517d852c67a268b36b8a62928f9353d482126dd1758f4e668d4e5b70719f85af66:91d9,7f7287009ecd9f205c5e672f8ff06811675f620d7ad658855eb665706f3185:82838688898a8b8c8d8e909192939495969798999a9d9e9fa0a1a2a3a5a6a7a9abacadb1b2b3b4b5b6b8babbbcbdbebfc0c2c3c4c5c6c7c8cacbcccdced1d2#d4d6d7d8d9dadbdddedfe0e1e2e3e5e6e7e8eaebecedeeeff0f1f2f3f4f5f6f7f8,60555237800d6454887075295e05681362f4971c53cc723d8c016c3477617a0e542e77ac987a821c8bf47855671470c165af64955636601d79c153f84e1d6b7b80865bfa55e356db4f:3a3c,99725df3677e80386002988290015b8b8b:bcf5,641c825864de55fd82cf91654fd77d20901f7c9f50f358516eaf5bbf8bc980839178849c7b97867d96:8b8f,7ee59ad3788e5c817a57904296a7795f5b59635f7b0b84d168ad55067f2974107d2295016240584c4ed65b835979585485:f9fafcfdfe,86:0001020304060708090a0b0c0d0e0f10121314151718191a1b1c1d1e1f20212223242526282a2b2c2d2e2f3031323334353637393a3b3d3e3f40#4142434445464748494a4b4c525355565758595b5c5d5f6061636465666768696a,736d631e8e:4b0f,80ce82d462ac53f06cf0915e592a60016c70574d644a8d2a762b6ee9575b6a8075f06f6d8c:2d08,57666bef889278b363a253f970ad6c645858642a580268e0819b55107cd650188eba6dcc8d9f70eb638f6d9b6ed47ee68404684390036dd896768ba85957727985e4817e75bc8a8a68af52548e22951163d098988e44557c4f5366ff568f60d56d9552435c4959296dfb586b75:301c,606c82148146631167618fe2773a8d:f334,94c15e165385542c70c386:6d6f7072737475767778838485868788898e8f90919294969798999a9b9e9fa0a1a2a5a6abadaeb2b3b7b8b9bbbcbdbebfc1c2c3c5c8cccdd2d3d5d6d7dadc#dde0e1e2e3e5e6e7e8eaebeceff5f6f7fafbfcfdff,87:010405060b0c0e0f10111416,6c405ef7505c4ead5ead633a8247901a6850916e77b3540c94dc5f647ae5687663457b527edf75db507762955934900f51f879c37a8156fe5f9290146d825c60571f541051546e4d56e263a89893817f8715892a9000541e5c6f81c062:d658,81319e3596409a:6e7c,692d59a562d3553e631654c786d96d3c5a0374e6889c6b6a59168c4c5f2f6e7e73a9987d4e3870f75b8c7897633d665a769660cb5b9b5a494e0781556c6a738b4ea167897f515f8065fa671b5fd859845a0187:191b1d1f20242627282a2b2c2d2f303233353638393a3c3d404142434445464a4b4d4f505152545556585a5b5c5d5e5f6162666768696a6b6c6d6f71727375#7778797a7f8081848687898a8c8e8f90919294959698999a9b9c9d9ea0a1a2a3a4,5dcd5fae537197e68fdd684556f4552f60df4e3a6f4d7ef482c7840e59d44f:1f2a,5c3e7eac672a851a5473754f80c355829b4f4f4d6e2d8c135c096170536b761f6e29868a658795fb7eb9543b7a337d0a95ee55e17fc174ee631d87176da17a9d621165a1536763e16c835deb545c94a84e4c6c618bec5c4b65e0829c68a754:3e34,6b:cb66,4e9463425348821e4f:0dae,575e620a96fe6664726952:ffa1,609f8bef661471996790897f785277fd6670563b54389521727a87:a5a6a7a9aaaeb0b1b2b4b6b7b8b9bbbcbebfc1c2c3c4c5c7c8c9cccdcecfd0d4d5d6d7d8d9dadcdddedfe1e2e3e4e6e7e8e9ebecedeff0f1f2f3f4f5f6f7f8#fafbfcfdff,88:0001020405060708090b0c0d0e0f101112141718191a1c1d1e1f2023,7a00606f5e0c6089819d591560dc718470ef6eaa6c5072806a8488ad5e2d4e605ab3559c94e36d177cfb9699620f7ec6778e867e5323971e8f9666875ce14fa072ed4e0b53a6590f54136380952851484ed99c9c7ea454b88d248854823795f26d8e5f265acc663e966973:b02e,53bf817a99857fa15baa96:7750,7ebf76f853a2957699997bb189446e584e617fd479658be660f354cd4eab98795df76a6150cf54118c618427785d9704524a54ee56a395006d885bb56dc6665388:2425262728292a2b2c2d2e2f30313334353637383a3b3d3e3f414243464748494a4b4e4f505152535556585a5b5c5d5e5f6066676a6d6f717374757678797a#7b7c80838687898a8c8e8f90919394959798999a9b9d9e9fa0a1a3a5a6a7a8a9aa,5c0f5b5d6821809655787b11654869544e9b6b47874e978b534f631f643a90aa659c80c18c10519968b0537887f961c86c:c4fb,8c225c5185aa82af950c6b238f9b65b05f:fbc3,4fe18845661f8165732960fa51745211578b5f6290a2884c91925e78674f602759d351:44f6,80f853086c7996c4718a4f:11ee,7f9e673d55c5950879c088967ee3589f620c9700865a5618987b5f908bb884c4915753d965ed5e8f755c60647d6e5a7f7e:eaed,8f6955a75ba360ac65cb738488:acaeafb0b2b3b4b5b6b8b9babbbdbebfc0c3c4c7c8cacbcccdcfd0d1d3d6d7dadbdcdddee0e1e6e7e9eaebecedeeeff2f5f6f7fafbfdff,89:0001030405060708#090b0c0d0e0f1114151617181c1d1e1f20222324262728292c2d2e2f3132333537,9009766377297eda9774859b5b667a7496ea884052cb718f5faa65ec8be25bfb9a6f5de16b896c5b8b:adaf,900a8fc5538b62bc9e:262d,54404e2b82bd7259869c5d1688596daf96c554d14e9a8bb6710954bd960970df6df976d04e25781487125ca95ef68a00989c960e708e6cbf594463a9773c884d6f148273583071d5538c781a96c155015f6671305bb48c1a9a8c6b83592e9e2f79e76768626c4f6f75a17f8a6d0b96336c274ef075d2517b68376f3e908081705996747689:38393a3b3c3d3e3f40424345464748494a4b4c4d4e4f505152535455565758595a5b5c5d6061626364656768696a6b6c6d6e6f707172737475767778797a7c#7d7e808284858788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1,64475c2790657a918c2359da54ac8200836f898180006930564e8036723791ce51b64e5f987563964e1a53f666f3814b591c6db24e0058f9533b63d694f14f:9d0a,886398905937905779fb4eea80f075916c825b9c59e85f5d69058681501a5df24e5977e34ee5827a6291661390915c794ebf5f7981c69038808475ab4ea688d4610f6bc55fc64e4976ca6ea28b:e3ae,8c0a8bd15f027f:fccc,7ece83:356b,56e06bb797f3963459fb541f94f66deb5bc5996e5c395f15969089:a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c3cdd3d4d5d7d8d9dbdddfe0e1e2e4e7e8e9eaecedeef0f1f2f4f5f6f7f8f9fa#fbfcfdfeff,8a:01020304050608090a0b0c0d0e0f101112131415161718191a1b1c1d,537082f16a315a749e705e947f2883b984:2425,836787478fce8d6276c85f719896786c662054df62e54f6381c375c85eb896cd8e0a86f9548f6cf36d8c6c38607f52c775285e7d4f1860a05fe75c24753190ae94c072b96cb96e389149670953:cbf3,4f5191c98bf153c85e7c8fc26de44e8e76c26986865e611a82064f:59de,903e9c7c61096e:1d14,96854e885a3196e84e0e5c7f79b95b878bed7fbd738957df828b90c15401904755bb5cea5fa161086b3272f180b28a:891e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3f4041424344454647494a4b4c4d4e4f505152535455565758595a5b5c5d5e#5f606162636465666768696a6b6c6d6e6f7071727374757677787a7b7c7d7e7f80,6d745bd388d598848c6b9a6d9e336e0a51:a443,57a38881539f63f48f9556ed54585706733f6e907f188fdc82d1613f6028966266f07ea68d:8ac3,94a55cb37ca4670860a6960580184e9190e75300966851418fd08574915d665597f55b55531d78386742683d54c9707e5bb08f7d518d572854b1651266828d:5e43,810f846c906d7cdf51ff85fb67a365e96fa186a48e81566a90207682707671e58d2362e952196cfd8d3c600e589e618e66fe8d60624e55b36e23672d8f678a:81828384858687888b8c8d8e8f9091929495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2#c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3,94e195f87728680569a8548b4e4d70b88bc86458658b5b857a84503a5be877bb6be18a797c986cbe76cf65a98f975d2d5c5586386808536062187ad96e5b7efd6a1f7ae05f706f335f20638c6da867564e085e108d264ed780c07634969c62db662d627e6cbc8d7571677f695146808753ec906e629854f286f08f998005951785178fd96d5973cd659f771f7504782781fb8d1e94884fa6679575b98bca9707632f9547963584b8632377415f8172f04e896014657462ef6b63653f8a:e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,8b:0001020304050608090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20212223#24252728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445,5e2775c790d18bc1829d679d652f5431871877e580a281026c414e4b7ec7804c76f4690d6b966267503c4f84574063076b628dbe53ea65e87eb85fd763:1ab7,81:f3f4,7f6e5e1c5cd95236667a79e97a1a8d28709975d46ede6cbb7a924e2d76c55fe0949f88777ec879cd80bf91cd4ef24f17821f54685dde6d328bcc7ca58f7480985e1a549276b15b99663c9aa473e0682a86db6731732a8b:f8db,90107af970db716e62c477a956314e3b845767f152a986c08d2e94f87b518b:464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f6061626364656768696a6b6d6e6f707172737475767778797a7b7c7d7e7f80818283848586#8788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9facb1bbc7d0ea,8c:091e,4f4f6ce8795d9a7b6293722a62fd4e1378168f6c64b08d5a7bc668695e8488c55986649e58ee72b6690e95258ffd8d5857607f008c0651c6634962d95353684c74228301914c55447740707c6d4a517954a88d4459ff6ecb6dc45b5c7d2b4ed47c7d6ed35b5081ea6e0d5b579b0368d58e2a5b977efc603b7eb590b98d70594f63cd79df8db3535265cf79568bc5963b7ec494bb7e825634918967007f6a5c0a907566285de64f5067de505a4f5c57505e:a7#3$,8c:38393a3b3c3d3e3f4042434445484a4b4d4e4f5051525354565758595b5c5d5e5f60636465666768696c6d6e6f707172747576777b7c7d7e7f808183848687#888b8d8e8f90919293959697999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacad,4e:8d0c,51404e105eff53454e:15981e,9b325b6c56694e2879ba4e3f53154e47592d723b536e6c1056df80e499976bd3777e9f174e:369f,9f104e:5c6993,82885b5b556c560f4ec453:8d9da3a5ae,97658d5d53:1af5262e3e,8d5c53:6663,52:02080e2d333f404c5e615c,84af52:7d82819093,51827f544e:bbc3c9c2e8e1ebde,4f1b4ef34f:2264,4ef54f:2527092b5e67,65384f:5a5d,8c:aeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebec#edeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,8d:000102030405060708090a0b0c0d,4f:5f57323d76749189838f7e7baa7cac94e6e8eac5dae3dcd1dff8,50:294c,4ff350:2c0f2e2d,4ffe50:1c0c25287e4355484e6c7ba5a7a9bad6,510650:edece6ee,51:070b,4edd6c3d4f:5865ce,9fa06c467c74516e5dfd9ec999985181591452f9530d8a07531051eb591951554ea051564eb388:6ea4,4eb5811488d279805b3488037fb851:abb1bdbc,8d:0e0f101112131415161718191a1b1c205152575f6568696a6c6e6f717278797a7b7c7d7e7f808283868788898c8d8e8f90929395969798999a9b9c9d9ea0a1#a2a4a5a6a7a8a9aaabacadaeafb0b2b6b7b9bbbdc0c1c2c5c7c8c9cacdd0d2d3d4,51:c796a2a5,8b:a0a6a7aab4b5b7c2c3cbcfced2d3d4d6d8d9dcdfe0e4e8e9eef0f3f6f9fcff,8c:000204070c0f1112141516191b181d1f202125272a2b2e2f32333536,53:697a,96:1d2221312a3d3c4249545f676c7274888d97b0,90:979b9d99aca1b4b3b6ba,8d:d5d8d9dce0e1e2e5e6e7e9edeef0f1f2f4f6fcfeff,8e:00010203040607080b0d0e1011121315161718191a1b1c202124252627282b2d303233343637383b3c3e#3f4345464c4d4e4f505354555657585a5b5c5d5e5f60616263646567686a6b6e71,90:b8b0cfc5bed0c4c7d3e6e2dcd7dbebeffe,91:04221e23312f394346,520d594252:a2acadbe,54ff52:d0d6f0,53df71ee77cd5ef451:f5fc,9b2f53b65f01755a5def57:4ca9a1,58:7ebcc5d1,57:292c2a33392e2f5c3b4269856b867c7b686d7673ada48cb2cfa7b493a0d5d8dad9d2b8f4eff8e4dd,8e:73757778797a7b7d7e808283848688898a8b8c8d8e91929395969798999a9b9d9fa0a1a2a3a4a5a6a7a8a9aaadaeb0b1b3b4b5b6b7b8b9bbbcbdbebfc0c1c2#c3c4c5c6c7c8c9cacbcccdcfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4,58:0b0d,57:fded,58:001e194420656c81899a80,99a89f1961ff82:797d7f8f8aa8848e919799abb8beb0c8cae398b7aecbccc1a9b4a1aa9fc4cea4e1,830982:f7e4,83:0f07,82:dcf4d2d8,830c82:fbd3,83:111a061415,82:e0d5,83:1c515b5c08923c34319b5e2f4f47435f4017602d3a336665,8e:e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,8f:000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20212223#2425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f4041424344,83:681b696c6a6d6eb078b3b4a0aa939c857cb6a97db87b989ea8babcc1,840183:e5d8,580784:180b,83:ddfdd6,84:1c381106,83:d4df,84:0f03,83:f8f9eac5c0,842683:f0e1,84:5c515a597387887a89783c4669768c8e316dc1cdd0e6bdd3cabfbae0a1b9b497e5e3,850c750d853884f085:391f3a,8f:45464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f6061626364656a808c929da0a1a2a4a5a6a7aaacadaeafb2b3b4b5b7b8babbbcbfc0c3c6#c9cacbcccdcfd2d6d7dae0e1e3e7eceff1f2f4f5f6fafbfcfeff,90:07080c0e131518,85:563b,84:fffc,85:594868645e7a,77a285:43727ba4a8878f79ae9c85b9b7b0d3c1dcff,86:270529163c,5efe5f0859:3c41,803759:555a58,530f5c:22252c34,62:4c6a9fbbcadad7ee,632262f663:394b43adf6717a8eb46dac8a69aebcf2f8e0ffc4dece,645263:c6be,64:45410b1b200c26215e846d96,90:191c2324252728292a2b2c303132333437393a3d3f4043454648494a4b4c4e545556595a5c5d5e5f6061646667696a6b6c6f70717273767778797a7b7c7e81#84858687898a8c8d8e8f90929496989a9c9e9fa0a4a5a7a8a9abadb2b7bcbdbfc0,64:7ab7b899bac0d0d7e4e2,65:09252e,5f:0bd2,75195f1153:5ff1fde9e8fb,54:1216064b5253545643215759233282947771649a9b8476669dd0adc2b4d2a7a6d3d472a3d5bbbfccd9dadca9aaa4ddcfde,551b54e7552054fd551454f355:22230f11272a678fb5496d41553f503c,90:c2c3c6c8c9cbcccdd2d4d5d6d8d9dadedfe0e3e4e5e9eaeceef0f1f2f3f5f6f7f9fafbfcff,91:00010305060708090a0b0c0d0e0f1011121314151617181a1b1c#1d1f20212425262728292a2b2c2d2e30323334353637383a3b3c3d3e3f40414244,55:375675767733305c8bd283b1b988819f7ed6917bdfbdbe9499eaf7c9,561f55:d1ebecd4e6ddc4efe5f2f3cccde8f5e4,8f9456:1e080c012423,55fe56:00272d5839572c4d62595c4c548664716b7b7c8593afd4d7dde1f5ebf9ff,57:040a091c,5e:0f191411313b3c,91:454748515354555658595b5c5f606667686b6d737a7b7c808182838486888a8e8f939495969798999c9d9e9fa0a1a4a5a6a7a8a9abacb0b1b2b3b6b7b8b9bb#bcbdbebfc0c1c2c3c4c5c6c8cbd0d2d3d4d5d6d7d8d9dadbdddedfe0e1e2e3e4e5,5e:3744545b5e61,5c:8c7a8d9096889899919a9cb5a2bdacabb1a3c1b7c4d2e4cbe5,5d:020327262e241e061b583e343d6c5b6f5d6b4b4a697482999d,8c735d:b7c5,5f:73778287898c95999ca8adb5bc,88625f6172:adb0b4b7b8c3c1cecdd2e8efe9f2f4f7,730172f3730372fa91:e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,92:000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f2021222324#25262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445,72fb73:1713210a1e1d152239252c3831504d57606c6f7e,821b592598e759:2402,99:636768696a6b6c74777d8084878a8d9091939495,5e:80918b96a5a0b9b5beb3,8d535e:d2d1dbe8ea,81ba5f:c4c9d6cf,60035fee60045f:e1e4fe,60:0506,5f:eaedf8,60:1935261b0f0d292b0a3f2178797b7a42,92:464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f7071727375767778797a7b7c7d7e7f808182838485#868788898a8b8c8d8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7,60:6a7d969aad9d83928c9becbbb1ddd8c6dab4,61:20261523,60f461:000e2b4a75ac94a7b7d4f5,5fdd96b395:e9ebf1f3f5f6fcfe,96:030406080a0b0c0d0f12151617191a,4e2c723f62156c:35545c4aa38590948c6869747686a9d0d4adf7f8f1d7b2e0d6faebeeb1d3effe,92:a8a9aaabacadafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8#e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,93:00010203040506070809,6d:39270c43480704190e2b4d2e351a4f525433916f9ea05e93945c607c63,6e1a6d:c7c5de,6e0e6d:bfe0,6e116d:e6ddd9,6e166dab6e0c6dae6e:2b6e4e6bb25f865354322544dfb198e0,6f2d6e:e2a5a7bdbbb7d7b4cf8fc29f,6f:6246472415,6ef96f:2f364b742a0929898d8c78727c7ad1,93:0a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3f40414243444546474849#4a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696b,6f:c9a7b9b6c2e1eedee0ef,70:1a231b39354f5e,5b:80849593a5b8,752f9a9e64345b:e4ee,89305bf08e478b078f:b6d3d5e5eee4e9e6f3e8,90:05040b26110d162135362d2f445152506858625b,66b990:747d8288838b,5f:50575658,5c3b54ab5c:5059,5b715c:6366,7fbc5f:2a292d,82745f3c9b3b5c6e59:81838da9aaa3,93:6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaab#acadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cbcccd,59:97caab9ea4d2b2afd7be,5a:0506,59dd5a0859:e3d8f9,5a:0c09323411231340674a553c6275,80ec5a:aa9b777abeebb2d2d4b8e0e3f1d6e6d8dc,5b:091716323740,5c:151c,5b:5a6573515362,9a:7577787a7f7d808185888a90929396989b9c9d9fa0a2a3a5a7,7e:9fa1a3a5a8a9,93:cecfd0d1d2d3d4d5d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,94:000102030405060708090a0b0c0d#0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e,7e:adb0bec0c1c2c9cbccd0d4d7dbe0e1e8ebeeeff1f2,7f0d7e:f6fafbfe,7f:01020307080b0c0f111217191c1b1f212223242526272a2b2c2d2f3031323335,5e7a757f5ddb753e909573:8e91aea29fcfc2d1b7b3c0c9c8e5d9,987c740a73:e9e7debaf2,74:0f2a5b262528302e2c,94:2f303132333435363738393a3b3c3d3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6c6d6e6f#707172737475767778797a7b7c7d7e7f8081828384919698c7cfd3d4dae6fb,95:1c20,74:1b1a415c575559776d7e9c8e8081878b9ea8a990a7d2ba,97:eaebec,67:4c535e4869a5876a7398a775a89ead8b777cf0,680967d8680a67:e9b0,680c67:d9b5dab3dd,680067:c3b8e2,680e67:c1fd,68:323360614e624464831d55664167403e4a4929b58f7477936bc2,696e68fc69:1f20,68f995:27333d43484b555a606e74757778797a7b7c7d7e808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aa#abacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacb,692468f069:0b0157,68e369:10713960425d846b80987834cc8788ce896663799ba7bbabadd4b1c1cadf95e08dff,6a2f69ed6a:171865,69f26a:443ea0505b358e793d28587c9190a997ab,73:3752,6b:8182878492938d9a9ba1aa,8f:6b6d71727375767877797a7c7e818284878b,95:cccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7ecff,96:0713181b1e20232425262728292b2c2d2f303738393a3e41434a4e4f5152535657#58595a5c5d5e606365666b6d6e6f70717378797a7b7c7d7e7f808182838487898a,8f:8d8e8f989a,8ece62:0b171b1f222125242c,81e774:eff4ff,75:0f1113,65:34eeeff0,66:0a19,677266:031500,708566:f71d34313635,800666:5f54414f56615777848ca79dbedbdce6e9,8d:3233363b3d4045464849474d5559,89:c7cacbcccecfd0d1,72:6e9f5d666f7e7f848b8d8f92,63:0832b0,96:8c8e91929395969a9b9d9e9fa0a1a2a3a4a5a6a8a9aaabacadaeafb1b2b4b5b7b8babbbfc2c3c8cacbd0d1d3d4d6d7d8d9dadbdcdddedfe1e2e3e4e5e6e7eb#ecedeef0f1f2f4f5f8fafbfcfdff,97:0203050a0b0c10111214151718191a1b1d1f20,64:3fd8,80046b:eaf3fdf5f9,6c:0507060d1518191a2129242a32,65:35556b,72:4d525630,8662521680:9f9c93bc,670a80:bdb1abadb4b7e7e8e9eadbc2c4d9cdd7,671080:ddebf1f4ed,81:0d0e,80:f2fc,671581128c5a81:361e2c1832484c5374595a7160697c7d6d67,584d5ab581:888291,6ed581:a3aacc,672681:cabb,97:2122232425262728292b2c2e2f3133343536373a3b3c3d3f404142434445464748494a4b4c4d4e4f5051545557585a5c5d5f63646667686a6b6c6d6e6f7071#72757778797a7b7d7e7f8081828384868788898a8c8e8f9093959697999a9b9c9d,81:c1a6,6b:243739434659,98:d1d2d3d5d9da,6bb35f406bc289f365909f5165:93bcc6c4c3ccced2d6,70:809c969dbbc0b7abb1e8ca,71:1013162f31735c6845724a787a98b3b5a8a0e0d4e7f9,72:1d28,706c71:1866b9,62:3e3d434849,79:3b4046495b5c535a6257606f677a858a9aa7b3,5f:d1d0,97:9e9fa1a2a4a5a6a7a8a9aaacaeb0b1b3b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3#e4e5e8eeeff0f1f2f4f7f8f9fafbfcfdfeff,98:000102030405060708090a0b0c0d0e,60:3c5d5a67415963ab,61:060d5da99dcbd1,620680:807f,6c:93f6,6dfc77:f6f8,78:0009171811,65ab78:2d1c1d393a3b1f3c252c23294e6d56572650474c6a9b939a879ca1a3b2b9a5d4d9c9ecf2,790578f479:13241e34,9f9b9e:f9fbfc,76f177:040d,76f977:07081a22192d263538505147435a68,98:0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d#4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e,77:62657f8d7d808c919fa0b0b5bd,75:3a404e4b485b727983,7f:58615f,8a487f:68747179817e,76:cde5,883294:8586878b8a8c8d8f909497959a9b9ca3a4abaaadacafb0b2b4b6b7b8b9babcbdbfc4c8c9cacbcccdced0d1d2d5d6d7d9d8dbdedfe0e2e4e5e7e8ea,98:6f70717273748b8e929599a3a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcfd0d4d6d7dbdcdde0e1e2e3e4#e5e6e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,99:0001020304050607,94:e9ebeeeff3f4f5f7f9fcfdff,95:03020607090a0d0e0f1213141516181b1d1e1f222a2b292c3132343637383c3e3f4235444546494c4e4f525354565758595b5e5f5d61626465666768696a6b6c6f7172733a,77:e7ec,96c979:d5ede3eb,7a065d477a:03021e14,99:08090a0b0c0e0f1112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2f303132333435363738393a3b3c3d3e3f40414243444546474849#4a4b4c4d4e4f50515253565758595a5b5c5d5e5f60616264667378797b7e828389,7a:393751,9ecf99a57a7076:888e9399a4,74:dee0,752c9e:202228292a2b2c3231363837393a3e414244464748494b4c4e5155575a5b5c5e63666768696a6b6c716d73,75:929496a09daca3b3b4b8c4b1b0c3c2d6cde3e8e6e4ebe7,760375:f1fcff,76:1000050c170a25181519,99:8c8e9a9b9c9d9e9fa0a1a2a3a4a6a7a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8#d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9,76:1b3c2220402d303f35433e334d5e545c566b6f,7fca7a:e6787980868895a6a0aca8adb3,88:6469727d7f82a2c6b7bcc9e2cee3e5f1,891a88:fce8fef0,89:2119131b0a342b3641667b,758b80e576:b2b4,77dc80:1214161c20222526272928310b3543464d526971,898398:788083,99:fafbfcfdfeff,9a:000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738#393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f50515253545556575859,98:898c8d8f949a9b9e9fa1a2a5a6,86:4d546c6e7f7a7c7ba88d8bac9da7a3aa93a9b6c4b5ceb0bab1afc9cfb4e9f1f2edf3d0,871386:def4dfd8d1,87:0307,86f887:080a0d09233b1e252e1a3e48343129373f82227d7e7b60704c6e8b53637c64596593afa8d2,9a:5a5b5c5d5e5f606162636465666768696a6b7283898d8e949599a6a9aaabacadaeafb2b3b4b5b9bbbdbebfc3c4c6c7c8c9cacdcecfd0d2d4d5d6d7d9dadbdc#dddee0e2e3e4e5e7e8e9eaeceef0f1f2f3f4f5f6f7f8fafcfdfeff,9b:000102040506,87:c68885ad9783abe5acb5b3cbd3bdd1c0cadbeae0ee,88:1613,87fe88:0a1b21393c,7f:36424445,82107a:fafd,7b:080304150a2b0f47382a192e31202524333e1e585a45754c5d606e7b62727190a6a7b8ac9da885aa9ca2abb4d1c1ccdddae5e6ea,7c0c7b:fefc,7c:0f160b,9b:07090a0b0c0d0e1011121415161718191a1b1c1d1e2021222425262728292a2b2c2d2e3031333435363738393a3d3e3f40464a4b4c4e50525355565758595a#5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b,7c:1f2a26384140,81fe82:010204,81ec884482:2122232d2f282b383b33343e44494b4f5a5f68,88:7e8588d8df,895e7f:9d9fa7afb0b2,7c7c65497c:919d9c9ea2b2bcbdc1c7cccdc8c5d7e8,826e66a87f:bfced5e5e1e6e9eef3,7cf87d:77a6ae,7e:479b,9e:b8b4,8d:73849491b1676d,8c:4749,91:4a504e4f64,9b:7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9ba#bbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadb,91:626170696f7d7e7274798c85908d91a2a3aaadaeafb5b4ba,8c559e7e8d:b8eb,8e:055969,8d:b5bfbcbac4d6d7dadececfdbc6ecf7f8e3f9fbe4,8e098dfd8e:141d1f2c2e232f3a4039353d3149414251524a70767c6f74858f94909c9e,8c:78828a859894,659b89:d6dedadc,9b:dcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,9c:000102030405060708090a0b0c0d0e0f101112131415161718191a#1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b,89:e5ebef,8a3e8b26975396:e9f3ef,97:0601080f0e2a2d303e,9f:808385868788898a8c,9efe9f:0b0d,96:b9bcbdced2,77bf96e092:8eaec8,93:3e6aca8f,94:3e6b,9c:7f8285868788,7a239c:8b8e90919294959a9b9e9fa0a1a2a3a5a6a7a8a9abadaeb0b1b2b3b4b5b6b7babbbcbdc4c5c6c7cacb3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a#7b7d7e808384898a8c8f93969798999daaacafb9bebfc0c1c2c8c9d1d2dadbe0e1cccdcecfd0d3d4d5d7d8d9dcdddfe2,97:7c85919294afaba3b2b4,9a:b1b0b7,9e589a:b6babcc1c0c5c2cbccd1,9b:45434749484d51,98e899:0d2e5554,9a:dfe1e6efebfbedf9,9b:080f131f23,9e:bdbe,7e3b9e:8287888b92,93d69e:9d9fdbdcdde0dfe2e9e7e5eaef,9f:222c2f39373d3e44,9c:e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,9d:000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f2021#22232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142#92$434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f8081#82838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2#92$a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1#e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff,9e:000102#92$030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e24272e30343b3c404d5052535456595d5f606162656e6f727475767778797a7b7c7d80#8183848586898a8c8d8e8f90919495969798999a9b9c9ea0a1a2a3a4a5a7a8a9aa#92$abacadaeafb0b1b2b3b5b6b7b9babcbfc0c1c2c3c5c6c7c8cacbccd0d2d3d5d6d7d9dadee1e3e4e6e8ebecedeef0f1f2f3f4f5f6f7f8fafdff,9f:000102030405#060708090a0c0f1112141516181a1b1c1d1e1f21232425262728292a2b2d2e3031#92$3233343536383a3c3f4041424345464748494a4b4c4d4e4f52535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778#797a7b7c7d7e81828d8e8f9091929394959697989c9d9ea1a2a3a4a5,f9:2c7995e7f1#92$,fa:0c0d0e0f111314181f20212324272829,e8:15161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f40414243#4445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f6061626364'),
                U2GInt={},
                U2Ghash={},
                G2Uhash={};
            !function(data){
                var k=0;
                data=data.match(/..../g);
                for(var i=0x81;i<=0xfe;i++){
                    for(var j=0x40;j<=0xFE;j++){

                        U2Ghash[data[k]]=('%'+i.toString(16)+'%'+j.toString(16))
                            .toUpperCase();
                        U2GInt[data[k]] = String.fromCharCode(i * 256 + j).charAt(0);
                        k++;

                    }
                }
                for(var key in U2Ghash){
                    G2Uhash[U2Ghash[key]]=key;
                }
            }(data);
            function isAscii(unicode) {
                return ((unicode == 0x20AC) || (unicode <= 0x007F && unicode >= 0x0000));
            }
            return{
                toGBKInt: function(str){
                    return str.replace(/./g,function(a){
                        var code=a.charCodeAt(0);
                        if(isAscii(code)){
                            return encodeURIComponent(a);
                        }else{
                            var key=code.toString(16);
                            if(key.length!=4)key=('000'+key).match(/....$/)[0];
                            return U2GInt[key]||a;
                        }
                    });
                },
                encode:function(str){

                    return str.replace(/./g,function(a){
                        var code=a.charCodeAt(0);
                        if(isAscii(code)){
                            return encodeURIComponent(a);
                        }else{
                            var key=code.toString(16);
                            if(key.length!=4)key=('000'+key).match(/....$/)[0];
                            return U2Ghash[key]||a;
                        }
                    });
                },
                decode:function(str){
                    return str.replace(/%[0-9A-F]{2}%[0-9A-F]{2}/g,function(a){
                        if(a in G2Uhash){
                            return String.fromCharCode('0x'+G2Uhash[a]);
                        }else{
                            return a;
                        }
                    }).replace(/%[\w]{2}/g,function(a){
                        return decodeURIComponent(a);

                    });
                }
            };
        }();



    })(jQuery, window);


    })(jQuery, window);

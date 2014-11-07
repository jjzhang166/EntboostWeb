/*
 * jqEBMessengerIfr
 * https://github.com/Administrator/jqEBMessenger
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */


;(function($, window, undefined) {

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


})(jQuery, window);

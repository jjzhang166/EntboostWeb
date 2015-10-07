/*
 * jqEBMessengerUI
 * https://github.com/Administrator/jqEBMessenger
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */





    (function (window, $) {

        $.extend({eb_client_config:{
            default_header : "images/logo2.gif",//聊天框顶部图像
            opposite_head_img:"images/logo2.gif",//对方聊天记录头像
            my_head_img:"images/logo2.gif",//登录方聊天记录头像
            url: "javascript:;",//主页
            title:"",
            contact_img:"images/logo2.gif",//联系人默认头像

            mes_ring:{//铃声配置
                open : true, //是否开启信息铃声
                sound_file : "css/msg.wav"//铃声文件
            },

            organize:{//企业组织架构配置
                ent_icon : "images/company.png", //企业图标
                group_icon : "images/group.png", //群组图标
                member_icon : "images/logo2.gif" //群组成员图标
            },

            cs: { //客服界面配置

                init: function(){
                    //$.eb_client_config.title = "恩布客服中心  <span style='color: darkgrey;font-size: x-small;'>免费、开源企业IM平台 咨询电话：400-840-1180</span>";
                    $.eb_client_config.title = "客服中心";
                    $.eb_client_config.default_header = "images/cs.jpg";
                    $.eb_client_config.opposite_head_img = "images/cs.jpg";
                    $.eb_client_config.my_head_img = "images/logo2.gif";//登录方聊天记录头像
                    $.eb_client_config.url = "http://www.entboost.com";//主页


                }



            },
            common: {
                init: function(){

                }
            }






        }});



    })(window, jQuery);


    (function (window, $) {

        layer.use('extend/layer.ext.js');//导入layer弹窗插件
        var eb_client_config = $.eb_client_config;//默认配置

        //扩展Date的原型函数，支持自定义格式时间
        Date.prototype.format =function(format)
        {
            var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(), //day
                "h+" : this.getHours(), //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3), //quarter
                "S" : this.getMilliseconds() //millisecond
            }
            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (this.getFullYear()+"").substr(4- RegExp.$1.length));
            for(var k in o)if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,
                        RegExp.$1.length==1? o[k] :
                        ("00"+ o[k]).substr((""+ o[k]).length));
            return format;
        }

        $.extend({
            ebTemp : {}

        });

        $.ebTemp.temps = (function(){

           var obj = {

               chat_win : '<div class="layim_chatbox" id="layim_chatbox">'
                            +'<h6>'
                            + '<span class="layim_move"></span>'
                            + '    <a href="javascript:;" class="layim_face" target="_blank" ><img style="border: none;" src="" ></a>'
                            + '    <a href="javascript:;" class="layim_names" target="_blank" id="layim_title">'

                            + '    </a>'
                            + '    <span class="layim_rightbtn">'
                            + '        <i class="layer_setmin" onclick="$.ebTemp.event.close_chat_win()"></i>'
                            + '        <i class="layim_close" onclick="$(\'#layim_chatbox\').hide();$(\'#faces_div\').hide()"></i>'
                            + '    </span>'
                            + '</h6>'
                            + '<div class="layim_chatmore" id="layim_chatmore">'
                            + '    <ul class="layim_chatlist" id="layim_chatlist"></ul>'
                            + '</div>'
                            + '<div class="layim_groups" id="layim_groups">'
                            +      '<ul class="layim_groupthis" id="layim_groupthis"></ul>'
                            + '</div>'
                            + '<div class="layim_chat">'
                            + '    <div class="layim_chatarea" id="layim_chatarea">'
                            //+ '        <ul class="layim_chatview layim_chatthis"  id="layim_area"></ul>'
                            + '    </div>'
                            + '    <div class="layim_tool">'
                            + '        <i class="layim_addface" title="发送表情" id="layim_addface"></i>'
//                            + '        <a href="javascript:;"><i class="layim_addimage" title="上传图片"></i></a>'

                            + '        <a id="file_upload_btn" href="javascript:;"><i class="layim_addfile" title="上传文件"></i></a>'

                            + '        <a class="roaming" id="roaming">消息记录</a>'
//
                            + '    </div>'
                            + '    <textarea class="layim_write" id="layim_write" style="z-index: 999;"></textarea>'
                            + '    <div class="layim_send">'
                            + '        <div style="font-size: x-small;float: right;height: 40px;line-height: 45px;color:#77c08b;margin-right: 60px;">换行:ctrl+enter</div>'
                            + '        <div class="layim_sendbtn " id="layim_sendbtn">发送</div>'
                            //+ '         <span class="layim_enter" id="layim_enter"><em class="layim_zero"></em></span>'
                            //+ '        <div class="layim_sendtype" id="layim_sendtype">'
                            //+ '            <span sendType="Enter"><i>√</i>按Enter键发送</span>'
                            //+ '            <span sendType="Ctrl+Enter"><i></i>按Ctrl+Enter键发送</span>'
                            //+ '        </div>'
                            + '    </div>'
                            + '</div>'
                            + '</div>',

               logon_win: '<div style="width: 300px;margin-left: 80px;">' +
                           '<table class="login-form">'+
                           '<tr><td><span>账号:</span></td><td><input id="accountInput" class="textInput" /></td></tr>' +
                           '<tr><td><span>密码:</span></td><td><input id="passwordInput" class="textInput" type="password" /></td></tr>' +
                           '<tr><td></td><td><div id="logonBtn">登录</div><div onclick="window.open(\'http://www.entboost.com/usercenter/register\');" id="regBtn">注册</div></td></tr>' +
                           '</table>' +
                           '</div>',

               logon_win_new: '<div class="eb-login" id="login_win">'+
                                '<div class="eb-logo">'+

                                '</div>'+
                                '<div class="eb-input">'+
                                '<div>'+
                                '<input type="text" id="accountInput" class="eb-form" placeholder="账号:"/>'+

                                '</div>'+
                                '<div>'+
                                '<input type="password" id="passwordInput" class="eb-form" placeholder="密码:"/>'+
                                '<a href="#" target="_blank" class="forget-pass">忘记密码?</a>' +
                                '</div>'+
                                '</div>'+
                                '<div class="eb-button" id="logonBtn">'+
                                '登录'+
                                '</div>'+

                                '<div class="down-button">'+

                                '<div style="display: none" id="regBtn" class="eb-button button-yellow" onclick="window.open(\'http://www.entboost.com/usercenter/register\');">'+
                                'IM注册'+
                                '</div>'+
                                '<div style="display:none;" class="eb-button button-blue" id="cus_btn">'+
                                '在线咨询'+
                                '</div>'+
                                '</div>'+
                                '</div>' +
                                '<div id="entbooost_link" style="text-align: center;font-size: 13px;padding-top: 10px;"><a style="font: 12px arial;" href="http://www.entboost.com" target="_blank">恩布互联</a></div>'
                ,
               main_win: '<div id="xximmm" class="xxim_main">'
                           +'<div class="xxim_top" id="xxim_top">'
                           +'  <div class="xxim_search"><img class="sbtn" src="./images/search.png" /><input placeholder="按回车搜索：用户、账号" id="xxim_searchkey" />'
                           +   '<div id="searchuser_list" class="searchuser_list"></div><span id="xxim_closesearch">×</span></div>'
                           +'  <div class="xxim_tabs" id="xxim_tabs"><span class="xxim_tabgroup xxim_tabnow" title="群组"><img src="images/depart.png" alt=""/></span><span class="xxim_tabfriend" title="好友"><img src="images/user-white.png" alt=""/></span><span class="xxim_latechat"  title="组织架构"><img src="images/home-white.png" alt=""/></span></div>'
                           +'  <ul class="xxim_list" style="display: block;" id="group_list"></ul>'
                           +'  <ul class="xxim_list" style="display:none;" id="contact_list">'
                           +     '<li style="display: none;" class="xxim_parentnode">'
                           +        '<ul id="out_user" style="" class="xxim_chatlist">'

                           +         '</ul>'
                           +    '</li>'
                           +  '</ul>'
                           +'  <ul class="xxim_list ztree " style="display: none;width: 100%;border: none;height: 320px;border: 0px;margin: 0px;" id="struct_list"></ul>'
                           +'  <ul class="xxim_list xxim_searchmain" id="xxim_searchmain"></ul>'
                           +'</div>'
                           +'<ul class="xxim_bottom" id="xxim_bottom">'
                           +'<li class="xxim_online" id="xxim_online">'
                           +'<i class="xxim_nowstate"></i><span id="xxim_onlinetex">在线</span>'
                           +'<div class="xxim_setonline">'
                           +'<span><i></i>在线</span>'
                           +'<span class="xxim_setoffline"><i></i>隐身</span>'
                           +'</div>'
                           +'</li>'
                           +'<li class="xxim_mymsg" id="xxim_mymsg" title="最近会话"><img class="img_center" src="images/his.png" /></li>'
                           //+'<li class="xxim_seter" id="xxim_seter" title="设置" onclick="$.ebTemp.event.get_user_info($.jqEBMessenger.clientInfo.my_uid);">'
                           +'<li class="xxim_seter" id="xxim_seter" title="设置" onclick="$.ebSetup.init();">'

                           +'<img class="img_center" src="images/setting.png" />'
                           +'<div class="">'

                           +'</div>'
                           +'</li>'
                           +'<li title="退出" class="xxim_hide" id="xxim_hide" onclick="$.ebTemp.event.exit();"><img class="img_center" src="images/exit.png" /></li>'
                           +'<li id="xxim_on" class="xxim_icon xxim_on" onclick="$.ebTemp.event.expand();"></li>'
                           +'<div state="not-active" class="layim_min" id="layim_min" style="display: none;" onclick="$.ebTemp.event.reopen_chat_win()">还原聊天窗口</div>'
                           +'</ul>'
                           +'</div>',

               chat_area: '<ul name="chat_area" class="layim_chatview layim_chatthis" ></ul>',//聊天记录容器
               card: $('<div  class="card"></div>'),//用户或群组名片,
               recent_list: $('<div class="recent_list"></div>')




           };
           return obj;


        })();


        $.ebTemp.fun = {
            /**
             * 窗口最小化新消息判断
             */
            min_chat_win_mes: function(){
                var state = $("#layim_min").attr("state");
                if(state == "active"){
                    $("#layim_min").html("<span  style='display: none;color: red;'>有新消息..............</span>");
                    $("#layim_min").find("span").show("slow");
                }
            }
            ,
            /**
             * 获取用户名称
             * @param gid 群组id
             * @param uid 用户id
             */
            get_member_name: function(gid,uid){
                return $("#group_list li[gid='"+gid+"']").find("li[account='"+uid+"'] .xxim_onename").html();
            },
            /**
             *
             * @param key uid或者group_id
             */
            remove_left_item: function(key){

                $("#layim_chatlist").children("li[account='"+ key +"']").children("[name='close']").click();
            }
            ,
            recall: function(uid){//重新call并发送message
                $.ebCache.chat_win_cache[uid] = null;
                $("#layim_chatmore ul li[account='"+ uid +"']").click();

            }
            ,
            /**
             *
             * @param id uid或者groupid
             */
            show_chat_area:function(id){
                var chat_area = $.ebTemp.fun.check_chat_area(id);
                $("#layim_chatarea ul").hide();
                chat_area.show();
                var timer = $.ebCache.timer_map[id];
                if(timer){

                    clearTimeout(timer);
                    delete $.ebCache.timer_map[id];
                }

//                $(".xxim_list li[account='"+ id +"']").click();
            },
            /**
             *
             * @param id uid或者groupid
             */
            check_chat_area: function(id){
                var chat_area = $("#layim_chatarea #"+id);

                if(chat_area.length <= 0){
                    var html = $.ebTemp.temps.chat_area;
                    chat_area = $(html);
                    chat_area.attr("id",id);
                    chat_area.appendTo($("#layim_chatarea"));
                }
                return chat_area;

            },
            /**
             * 往聊天面板添加普通消息
             * @param id 聊天面板ID
             * @param content 信息内容
             */
            push_info:function(id,content,callback){

                $.ebTemp.fun.min_chat_win_mes();
                $.ebTemp.event.play_mes_ring();
                var chat_area = $.ebTemp.fun.check_chat_area(id);
                var $content = $(content);
                $content.appendTo(chat_area);
                //chat_area.append(content);

                chat_area.scrollTop(chat_area[0].scrollHeight);
                $.ebTemp.event.count_msgs(id,"single");
                if(callback){
                    callback($content);
                }
                var chat_area = $.ebTemp.fun.check_chat_area(id);


                chat_area.scrollTop(chat_area[0].scrollHeight);

            },
            /**
             *推送聊天记录到聊天面板
             * @param param chat info {type:'',time:'',content:'',name:''}
             * @param id uid或者groupid
             */
            push_msg : function(param,id){

                var template = function(param){
                    return '<li class="'+ (param.type === 'me' ? 'layim_chateme' : '') +'">'
                        +'<div class="layim_chatuser">'
                        + function(){
                            if(param.type === 'me'){
                                return '<span class="layim_chattime">'+ param.time.format('hh:mm:ss') +'</span>'
                                    +'<span class="layim_chatname">'+ param.name +'</span>'
                                    +'<img src="'+ param.face +'" >';
                            } else {
                                return '<img src="'+ param.face +'" >'
                                    +'<span class="layim_chatname">'+ param.name +'</span>'
                                    +'<span class="layim_chattime">'+ param.time.format('hh:mm:ss') +'</span>';
                            }
                        }()
                        +'</div>'
                        +'<div class="layim_chatsay">'+ param.content +'<em class="layim_zero"></em></div>'
                        +'</li>';
                };
//                if(!$("chat_area"+id)){
//                    $.ebTemp.fun.create_chat_area(id);
//                }
                var chat_area = $.ebTemp.fun.check_chat_area(id);
                chat_area.append(template(param));

                chat_area.scrollTop(chat_area[0].scrollHeight);


            }


        };


        $.ebTemp.event = {


            /**
             * 截图放大缩小事件
             *
             */
            screenshot_handler: function($this){
                
                var i = $.layer({
                    type : 1,
                    title : false,
                    fix : false,
                    offset:['50px' , ''],
                    area : ['auto','auto'],
                    page : {html : "<div style='max-width: 800px;'><img style='max-width: 800px;' src='"+$this.attr('src')+" '/></div>"}
                });
            },


            /**
             * 获取用户信息
             * @param uid 用户ID
             */
           get_user_info: function(uid){

                $.ebCache.handler_cart(uid,function(data){


                    $.layer({
                        type: 1,   //0-4的选择,（1代表page层）
                        area: ['250px', '400px'],
                        //shade: [0],  //不显示遮罩
                        border: [0], //不显示边框
                        title: [
                            '用户信息',
                            //自定义标题风格，如果不需要，直接title: '标题' 即可
                            'border:none; background:#61BA7A; color:#fff;'
                        ],
                        bgcolor: '#eee', //设置层背景色
                        page: {
                            html: '<div style="padding:10px;width: 250px;height: auto;">'
                                    +  '<div class="card_item"><span>姓名:</span>'+data['user_name']+'</div>'
                                    +  '<div class="card_item"><span>账号:</span>'+data['account']+'</div>'
                                    +  '<div class="card_item"><span>电话:</span>'+data['tel']+'</div>'
                                    +  '<div class="card_item"><span>手机:</span>'+data['phone']+'</div>'
                                    +  '<div class="card_item"><span>邮箱:</span>'+data['email']+'</div>'
                                    //+  '<div><span>职务:</span><input type="text" value="'+data['user_name']+'" id="card_username"/></div>'
                                    +  '<div class="card_item"><span>部门:</span>'+data['group_name']+'</div>'
                                    +  '<div class="card_item"><span>公司:</span>'+data['enterprise']+'</div>'
                                    +  '<div class="card_item"><span>地址:</span>'+data['address']+'</div>'
                                 +'</div>'
                        },
                        shift: 'none'//从上动画弹出

                    });
                })
            }
            ,
            /**
             * 还原聊天窗口
             */
            reopen_chat_win: function(){
                if($("#layim_min").is(":hidden")){
                    $("#layim_chatbox").show();
                    return;
                }
                $("#layim_chatbox").show();
                $("#layim_min").hide();
                $("#layim_min").attr("state","not-active");
                $("#layim_min").html("还原聊天窗口");
            }
            ,
            /**
             * 关闭聊天窗口
             */
            close_chat_win: function(){
                $("#layim_chatbox").hide();
                $("#faces_div").hide();
                $("#layim_min").show();
                $("#layim_min").attr("state","active");

            }


            ,
            /**
             * 播放铃声
             */
            play_mes_ring:function(){
                var enable = eb_client_config.mes_ring.open;
                if(enable){
                    var borswer = window.navigator.userAgent.toLowerCase();

                    if ( borswer.indexOf( "ie" ) >= 0 ){
                        return;
                        //var embed = document.mes_ring;
                        //alert(embed);
                        //if(embed && embed.play){
                        //    embed.play();
                        //}

                    }else{

                        document.getElementById("mes_ring").play();
                    }


                }
            }
            ,
            exit:function(){//退出登录
                layer.confirm("您确定退出吗?",function(){
                    $.each($.ebCache.chatid_list, function(i, item){
                        $.ebMsg.ebcm_exit(item);
                    });
                    $.ebMsg.offline(function(){
                        window.onbeforeunload = null;
                        window.location.reload();

                    },function(error){
                        window.onbeforeunload = null;
                        window.location.reload();
                    });

                });

            },
            expand: function(){//主界面隐藏、显示
                var xxim = {};
                var node = xxim.node = {
                    tabs: $('#xxim_tabs>span'),
                    list: $('.xxim_list'),
                    online: $('.xxim_online'),
                    setonline: $('.xxim_setonline'),
                    onlinetex: $('#xxim_onlinetex'),
                    xximon: $('#xxim_on'),
                    layimFooter: $('#xxim_bottom'),
                    xximHide: $('#xxim_hide'),
                    xximSearch: $('#xxim_searchkey'),
                    searchMian: $('#xxim_searchmain'),
                    closeSearch: $('#xxim_closesearch'),
                    layimMin: $('#layim_min')


                };

                if($("#xximmm").attr('state') !== '1'){
                    $("#xximmm").stop().animate({right: -232}, 200, function(){
                        node.xximon.addClass('xxim_off');
                        try{
                            localStorage.layimState = 1;
                        }catch(e){}
                        $("#xximmm").attr({state: 1});
                        node.layimFooter.addClass('xxim_expend').stop().animate({marginLeft: -232}, 200/2);
                        node.xximHide.addClass('xxim_show');
                    });
                } else {
                    $("#xximmm").stop().animate({right: 1}, 200, function(){
                        node.xximon.removeClass('xxim_off');
                        try{
                            localStorage.layimState = 2;
                        }catch(e){}
                        $("#xximmm").removeAttr('state');
                        node.layimFooter.removeClass('xxim_expend');
                        node.xximHide.removeClass('xxim_show');
                    });
                    node.layimFooter.stop().animate({marginLeft: 0}, 200);
                }
            }
            ,
            chatmore_add: function(account,name,type){//增加实时聊天联系人
                //if(!$.ebTemp.cache.chat_win_index){
                //    $.ebTemp.temp_handler.show_chat_win({
                //        url : "javascript:;",
                //        face:eb_client_config.default_header,
                //        title:'加载中...',
                //        uid:'',
                //        account:'',
                //        call_id:''
                //    });
                //}

                var list = $("#layim_chatmore ul");



                var exist = false;
                list.children("li").each(function(){
                    var exist_account = $(this).attr("account");
                    if(account == exist_account){
                        $(this).children('span').click();
                        $(this).addClass("layim_chatnow");
                        exist = true;
                    }
                });
                if(exist){
                    return;
                }

                var temp = $('<li unread="0"  account="'+ account +'" type="'+type+'"  class="layim_chatnow">'+
                                '<span onclick="$.ebTemp.event.call_click($(this).parent(),'+type+');">'+ name +'</span>' +
                                '<em style="display: none;" name="close">×</em>' +
                                '<em style="color: red;display: none;" name="num"></em>' +
                            '</li>');
                temp.appendTo(list);
                $("#layim_chatmore").show();

                temp.mouseover(function(){
                    $(this).children("[name='close']").show();
                    $(this).children("[name='num']").hide();
                });
                temp.mouseout(function(){
                    $(this).children("[name='close']").hide();
                    $(this).children("[name='num']").show();
                });
                temp.children("em[name='close']").click(function(){


                    if($(this).parent().hasClass("layim_chatnow")){
                        $(this).parent().remove();
                        $("#layim_chatmore ul li:last").children('span').click();
                        if($("#layim_chatlist .layim_chatnow").length == 0){
                            $("#layim_chatmore ul li:last").children('span').click();
                        }else{
                            $("#layim_chatlist").children(".layim_chatnow").click();
                        }


                    }else{
                        $(this).parent().remove();
                    }

                    //if($("#layim_chatmore ul li").length <= 1){
                    //    $("#layim_chatmore").hide();
                    //}
                    var account = $(this).parent().attr('account');
                    var win_cache = $.ebCache.chat_win_cache[account];
                    if(win_cache){
                        delete $.ebCache.timer_map[account];
                        var timer = setTimeout(function(){
                            var chat_id = win_cache.group_code || win_cache.callInfo.chat_id;
                            $.ebCache.chat_win_cache[account] = null;
                            $.ebTemp.cache.calling_cache[account] = null;

                            $.jqEBMessenger.EBCM.ebwebcm_exit(chat_id);
                        }, 300000);
                        $.ebCache.timer_map[account] = timer;

                    }


                    if($("#layim_chatlist li").length == 0){
                        $("#layim_chatbox").hide();

                    }




                });
                temp.children('span').click();



//                var exist_account = $.ebCache.cur_contact_id;
//                if(exist_account){
//                    $("#layim_write").val($.ebCache.wait_send_mes_map[exist_account]);
//                }
//                $.ebCache.cur_contact_id = account;
//                $.ebCache.wait_send_mes_map[account] = cur_mes;




            }
            ,
            click_contact: function($self){//点击联系人或者群聊天事件



                $.ebTemp.event.reopen_chat_win();
                var gid = $self.attr("gid");
                var account = $self.attr("account");

                var name = $self.attr("name");
                if(account){
                    //一对一聊天
                    if($.jqEBMessenger.clientInfo.my_uid != account){
                        this.chatmore_add(account,name,$.jqEBMessenger.chat_type.single);
                    }
                }else if(gid){

                    //群组聊天
                    this.chatmore_add(gid,name,$.jqEBMessenger.chat_type.group);
                }




            }
            ,
            count_msgs: function(key,type){//计算未读消息数量
                var list = $("#layim_chatlist").children("li[account='"+ key +"']");
                if(list.length == 0){
                    if(type == "group"){
                        $("#group_list").children("li[gid='"+key+"']").find("[name='group_send_btn']").click();
                    }else{
                        $(".xxim_list li[account='"+ key +"']").click();
                    }
                }

                var li = $("#layim_chatmore ul li[account='"+ key +"']");
                var unread = parseInt(li.attr("unread"));//最新消息数量
                unread = unread + 1;
                li.attr('unread',''+unread);
                $("#layim_chatmore ul li").each(function(){

                    var uns = $(this).attr("unread");

                    var state = $(this).attr("class");
                    if(state == "layim_chatnow"){
                        $(this).find("[name='num']").html('');
                        $(this).attr("unread",0);
                    }else{
                        if(uns <= 0){
                            $(this).find("[name='num']").html('');
                        }else{
                            $(this).find("[name='num']").html(uns);
                            if(uns > 99){
                                $(this).find("[name='num']").html('99+');
                            }

                        }

                    }
                });

            }
            ,
            fold: function($self){//折叠展开联系人
                var ul = $self.parent();
                if(ul.attr('class').indexOf('xxim_liston') < 0){
                    ul.addClass('xxim_liston');
                    ul.find('.xxim_chatlist').show();
                }else{
                    ul.removeClass('xxim_liston');
                    ul.find('.xxim_chatlist').hide();
                }

            },
            /**
             * 列出群组成员并调节窗口大小
             * @param gid group_id
             * @private
             */
            _list_members: function(gid){
                if(!gid){
                    $("#layim_groups").hide();
                    $("#layim_chatbox").removeClass("layim_add_width");
                    return;
                }
                $("#layim_groupthis").html('');

                var cache_members = $.ebCache.org_members[gid];

                $.ebCache.handler_members(gid,function(members){
                    $.each(members, function(i,m){
                        var head_file = m.head_file;
                        if($.trim(head_file).length == 0){
                            head_file = eb_client_config.default_header;
                        }
                        var uid = m.member_uid;
                        var state_info = m.member_uid + "-" + m.line_state;


                        var temp =
                            $('<li state_info="'+state_info+'"  onclick="$.ebTemp.event.click_contact($(this));" account="'+uid+'" name="'+m.user_name+'">' +
                                '<img src="'+ head_file +'" class="xxim_oneface">' +
                                '<span class="xxim_onename">'+ m.user_name +'</span>' +
                                '</li>');

                        $.im_state.set_state(temp, m.line_state);
                        temp.appendTo($("#layim_groupthis"));
                        temp.children('img').mouseover(function(){
                            $.ebTemp.temp_init_handler._show_card(temp, 1, temp.attr('account'),m);

                        });
                        temp.children('img').mouseleave(function(){
                            $.ebTemp.temps.card.remove();
                        });

                    });

                    $("#layim_chatbox").addClass("layim_add_width");

                    $("#layim_groups").show();
                });

            },
            /**
             * 防止重复call
             * @param account uid 或者 group_id
             * @private
             */
            _check_calling: function(account){
                var result = false;
                var cache_time = $.ebTemp.cache.calling_cache[account];
                if( (!cache_time) || new Date().getTime() - parseInt(cache_time) > 10000){
                    $.ebTemp.cache.calling_cache[account] = new Date().getTime() + '';
                    return true;
                }
                return false;
            },
            call_click: function($self,type){//点击呼叫



                var account = $self.attr('account');


                if(account == $.jqEBMessenger.clientInfo.my_uid){
                    return;
                }
                $.ebCache.user_clicltime_map[account] = new Date().getTime();

                //if((!account) || account.length == 0){
                //    return;
                //}
                $("#layim_write").focus();


                var value = $.ebCache.wait_send_mes_map[account];

                if(!value){
                    value = "";
                }
                $("#layim_write").val(value);


                $self.find("[name='num']").html('');
                $self.attr("unread","0");





                //var gid = $self.attr('gid');

                if(type == $.jqEBMessenger.chat_type.single){

                    $("#file_upload_btn").show();
                    this._list_members(false);
                    var info = $.ebCache.chat_win_cache[account];
                    if(info){
                        $.ebTemp.temp_handler.show_chat_win({
                            url : "javascript:;",
                            face:eb_client_config.default_header,
                            title: info.accountInfo.fInfo.name.length > 0 ? info.accountInfo.fInfo.name : info.accountInfo.from_account,
                            uid:info.accountInfo.uid,
                            account:info.accountInfo.uid,
                            call_id:info.callInfo.chat_id

                        });

                        $.ebTemp.fun.show_chat_area(info.accountInfo.uid);

                    }else{
                        if(this._check_calling(account)){

                            $.ebChat.call(account, $.jqEBMessenger.chat_type.single, null);
                        }
                    }
                }else if(type == $.jqEBMessenger.chat_type.group){
                    $("#file_upload_btn").hide();
                    var info = $.ebCache.chat_win_cache[account];
                    if(info){
                        var info = $.ebCache.get_group(account);

                        $.ebTemp.temp_handler.show_chat_win({
                            url : "javascript:;",
                            face:eb_client_config.default_header,
                            title: info.group_name,
                            uid:info.group_code,
                            account:info.group_code,
                            call_id:info.group_code,
                            type: "group"
                        });

                        $.ebTemp.fun.show_chat_area(info.group_code);
                    }else{
                        if(this._check_calling(account)){

                            $.ebChat.call(account, $.jqEBMessenger.chat_type.group, null);
                        }

                    }
                    this._list_members(account);


                }



            }
        }

        $.ebTemp.temp_init_handler = {


            /**
             * 初始化铃声
             */
            init_ring: function () {
                if (!$.ebTemp.cache.mes_ring_inited) {
                    var none_ie_temp = ' <audio style="display: none;"  id="mes_ring" controls>'
                        + '<source src="" />'
                        + '</audio>';

                    var ie_temp = '<embed name="mes_ring" src="" autostart="true" hidden="true" loop="false"></embed>';
                    var borswer = window.navigator.userAgent.toLowerCase();
                    var ring_obj = null;
                    if (borswer.indexOf("ie") >= 0) {
                        ring_obj = $(ie_temp);
                        ring_obj.attr("src", eb_client_config.mes_ring.sound_file);
                    } else {
                        ring_obj = $(none_ie_temp);
                        ring_obj.find('source').attr("src", eb_client_config.mes_ring.sound_file);
                    }

                    ring_obj.appendTo($('body'));
                    $.ebTemp.cache.mes_ring_inited = true;

                }
            }
            ,
            /**
             * init chat window
             * @param data chat window init data {uid:'',url:'',face:''}
             */
            init_chat_win: function (data) {

                if ($(".xxim_list li[account='" + data.uid + "']").length == 0 && data.type != "group") {
                    //$.ebTemp.event.chatmore_add(data.uid , data.title,$.jqEBMessenger.chat_type.single);

                    $('<li style="display:none;" unread="0"  user_type="out_user" name="' + data.title + '"  account="' + data.uid + '" onclick="$.ebTemp.event.click_contact($(this));" >' +
                        '<img src="" class="xxim_oneface">' +
                        '<span class="xxim_onename"></span>' +
                        '</li>').appendTo($('#out_user'));

                }


                $(".layim_face").attr('href', data.url);
                $(".layim_face img").attr('src', data.face);

                $("#layim_title").html(data.title);

                $("#layim_title").attr('href', data.url);
                $("#layim_chatbox").attr('uid', data.uid);
                $("#layim_chatbox").attr('call_id', data.call_id);

                $("#xxim_top li[account='" + data.uid + "']").find("[name='unread']").text('');
                $("#xxim_top li[account='" + data.uid + "']").attr("unread", "0");
                $("#xxim_top li[account='" + data.uid + "']").find("[name='unread']").hide();


                var uid = data.uid;

                var list = $("#layim_chatmore ul");

                list.children("li").removeClass("layim_chatnow");

                var li = list.children("li[account='" + uid + "']");
                if (li.length == 0) {
                    $("body [user_type='out_user'][account='" + uid + "']").click();
                    if (data.type == "group") {
                        $("#group_list").children("li[gid='" + uid + "']").find("[name='group_send_btn']").click();

                    } else {
                        $(".xxim_list li[account='" + uid + "']").click();
                    }

                } else {
                    li.addClass("layim_chatnow");
                }


                //绑定查看名片事件
                if ($.jqEBMessenger.clientInfo.user_type != "visitor") {
                    $("#layim_chatbox").find(".layim_face").removeAttr("target");
                    if (data.uid != data.call_id) {
                        $("#layim_chatbox").find(".layim_face").attr("onclick", "$.ebTemp.event.get_user_info(" + data.uid + ");");

                    } else {
                        $("#layim_chatbox").find(".layim_face").removeAttr("onclick");
                    }

                }
                //修改漫游消息连接
                var logon_params = $.ebCache.logon_params;
                var ok = logon_params.my_um_online_key;
                var add_params = "&gid=0&fuid=" + data.uid;
                if(data.type == "group") {
                    add_params = "&gid=" + data.uid;
                }
                var eb_url = "http://" + $.ebMsg.options.DOMAIN_URL
                var roaming_url = eb_url + "/eb/chat/chat.csp?ok=" + ok + "&uid=" + logon_params.my_uid + add_params;
                $("#roaming").unbind("click").bind("click",function(){
                    $.layer({
                        type: 2,
                        shadeClose: true,
                        title: $("#layim_title").html() + "的聊天消息",
                        closeBtn: [0, true],
                        shade: [0],
                        border: [1, 0.3, '#000'],
                        offset: ['20px',''],
                        area: ['600px', ($(window).height() - 50) +'px'],
                        iframe: {src: roaming_url}
                    });
                });



            },
            init_logon_win: function (logon_callback, data) {

                if(data['product-name'] && data['product-name'].length > 0){
                    document.title = data['product-name'];
                }else{
                    document.title = "恩布互联";
                }
                if(data['forget-pwd-url'] && data['forget-pwd-url'].length > 0){
                    $(".forget-pass").attr("href", data['forget-pwd-url']);
                    $(".forget-pass").show();

                }
                if(data['ent-logo-url'] && data['ent-logo-url'].length > 0){

                    var logoCss = "transparent url("+ data['ent-logo-url'] +") no-repeat scroll 0% 0%"
                    $(".eb-logo").css("background",logoCss);
                    var browser = $.browser;
                    if(browser.msie && parseInt(browser.version) <= 8){
                        var filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+data['ent-logo-url']+"',sizingMethod='scale')";
                        $(".eb-logo").css("filter",filter);
                        $(".eb-logo").css("background","");

                    }else{
                        $(".eb-logo").css("background-size","120px 120px");
                    }



                }

                $("#login_win").keydown(function(e){
                    if(e.keyCode == 13){
                        //$("#logonBtn").click();
                        var pass_len = $.trim($("#passwordInput").val()).length;
                        var account_len = $.trim($("#accountInput").val()).length;
                        if(pass_len > 0){
                            $("#logonBtn").click();

                        }else if(account_len > 0){
                            $("#passwordInput").focus();
                        }else if(account_len == 0){
                            $("#accountInput").focus()
                        }
                    }
                });
                $("#logonBtn").on('click', function () {
                    var account = $.trim($("#accountInput").val());
                    var password = $.trim($("#passwordInput").val());
                    if (account.length === 0) {
                        layer.alert("账号不能为空");
                        return;
                    }
                    if (password.length === 0) {
                        layer.alert("密码不能为空");
                        return;
                    }

                    var logoned = false;

                    logon_callback(account, password);
                    $("#passwordInput").val('');


                    //$.ebChat.logon(account, password);
                });
                $("#reg_btn").click(function () {
                    window.open("http://www.entboost.com/usercenter/register");
                });

                $("#cus_btn").click(function () {
                    window.open($.ebMsg.options.WEBIM_URL + "/client.html?to_account=" + $.ebMsg.options.CUS_ACCOUNT);

                });
            },
            init_dom: function () {
                $.ebTemp.dom = {
                    send_btn: $("#layim_sendbtn"),
                    face_btn: $("#layim_addface"),
                    writer_area: $("#layim_write"),
                    chat_area: $("#layim_area"),
                    chat_box: $("#layim_chatbox"),
                    upload_btn: $("#file_upload_btn")
                };
            },
            init_event: function () {
                var dom = $.ebTemp.dom;
                $("#layim_write").xheditor({tools: 'Emot,Img', width: '100%', height: 100, forcePtag: true,layerShadow:0});
                $("#xhe0_Tool").parent().hide();
                $("#xhe0_iframearea").css("height", "96px");


                setInterval(function(){
                    var value = $("#layim_write").val();
                    var account = $("#layim_chatbox",parent.document).attr("uid");
                    if(account && parseInt(account) > 0){
                        $.ebCache.wait_send_mes_map[account] = value;
                    }

                },500);


                var send_fun = function () {//发送消息
                    var msg = dom.writer_area.val();
                    var rootMsg = msg;
                    if (msg.replace(/\s/g, '') === '' ||
                        ($('<div>' + msg + '</div>').find('img').length === 0 && $.trim($('<div>' + msg + '</div>').text()).length === 0)) {
                        layer.tips('说点啥呗！', dom.send_btn, 2);
                        dom.writer_area.val('');
                        dom.writer_area.focus();

                    } else {
                        var uid = dom.chat_box.attr('uid');
                        var call_id = dom.chat_box.attr('call_id');
                        $.ebChat.send({
                            uid: uid,
                            call_id: call_id
                        }, msg);


                    }
                }

                dom.send_btn.click(send_fun);
                var tframe = document.getElementById("xhe0_iframe").contentWindow || document.frames["xhe0_iframe"][0];
                var doc = tframe.document;
                $(doc.body).css("background-color","#EAFCFE");
                $(doc.body).keydown(function (e) {
                    if(e.ctrlKey && e.keyCode == 13){

                        //dom.writer_area.val(dom.writer_area.val() + "\r\n");
                        var body = doc.getElementsByTagName("body")[0];
                        body.innerHtml = body.innerText + "<br/>";
                    }else if ( e.keyCode == 13) {
                        send_fun();
                    }

                });
                //文件上传事件
                $("#file_upload_btn").click(function () {


                    var index = layer.prompt({title: '请选择要上传的文件', type: 2}, function (file) {

                        if (file) {
                            var file_input = document.getElementById("xubox_prompt");
                            var agent = window.navigator.userAgent;
                            if (agent.indexOf('MSIE') != -1) {//IE浏览器

                            } else {//非IE浏览器
                                if (file_input.files[0].size > 1 * 1024 * 1024) {
                                    layer.alert("最多只支持大小为1M的文件");
                                    return;
                                }
                            }


                            $("#xubox_prompt").attr('name', 'attachment_file');
                            var chat_id = $("#layim_chatbox").attr("call_id");
                            var errCodeMap = $.jqEBMessenger.errCodeMap;
                            $.ebMsg.sendfile("xubox_prompt", chat_id, function (state, callId, fileName, mimeType, url) {

                                var callInfo = $.jqEBMessenger.chatMap.callInfoByChatId(callId);
                                var account = null;
                                if (callInfo && callInfo.group_code != '0') {
                                    account = callInfo.group_code;
                                } else if (callInfo && callInfo.group_code == '0') {

                                    for (var key in callInfo.accounts) {
                                        if (key != $.jqEBMessenger.clientInfo.my_uid) {
                                            account = key;
                                            break;
                                        }
                                    }
                                }

                                switch (state) {
                                    //申请上传文件失败
                                    case errCodeMap.SENDFILE_REQUEST_FAILURE:
                                        $.ebTemp.fun.push_info(account, "<div class='eb_info'>申请上传文件失败。</div>");
//                                        $.ShowSysTips(callId, "<span style='color:red;'>申请上传文件失败。</span>");
                                        break;
                                    //空文件
                                    case errCodeMap.UPLOAD_FILE_EMPTY:
                                        $.ebTemp.fun.push_info(account, "<div class='eb_info'>上传文件失败，请先选择一个文件后再点击传送。</div>");
                                        break;
                                    //文件超长
                                    case errCodeMap.CONTENT_TOO_LONG:
//                                        $.IM.defaultOptions.resetUploadAttachment();
//                                        chatEl.find("#upfile").val("");
//                                        //清空file控件内容
//                                        file.outerHTML += "";
//                                        file.value = "";
//
                                        $.ebTemp.fun.push_info(account, "<div class='eb_info'>很抱歉！上传失败，文件超过最大限制(1MB-兆字节)。</div>");
                                        break;
                                    //离线保存成功
                                    case errCodeMap.OK:
//                                        chatEl.find("#upfile").val("");
//                                        //清空file控件内容
//                                        file.outerHTML += "";
//                                        file.value = "";
//
                                        var spls = fileName.split("\\");
                                        var showHtml = [
                                            "<div class='eb_info'>",
                                            "服务器已经成功保存离线文件：",
                                            spls[spls.length - 1]


                                        ];
                                        //如图片资源则自动显示
                                        if ($.jqEBMessenger.pictureMimeTypeMap[mimeType]) {
                                            var image_url = [
                                                '<img src="',
                                                url,
                                                '"',
                                                ' onclick="window.open(\'',
                                                url,
                                                '\')"',
                                                ' onload="adjustImgSize(this, ' + 200 + ',' + 400 + ');updateScroll();"',
                                                ' style="cursor:pointer;margin-top:10px;max-width:200px;max-height:400px;"',
                                                '/>'
                                            ].join("");
                                            showHtml.push("<br/>");
                                            showHtml.push(image_url);
                                            text_area_log(image_url);
                                        }
                                        showHtml.push("</div>");
                                        $.ebTemp.fun.push_info(account, showHtml.join(""));


                                        break;

                                }
                            }, function (state, callId, fileName) {
                                var spls = fileName.split("\\");
                                fileName = spls[spls.length - 1];
                                var errCodeMap = $.jqEBMessenger.errCodeMap;
                                var callInfo = $.jqEBMessenger.chatMap.callInfoByChatId(callId);
                                var account = null;
                                if (callInfo && callInfo.group_code != '0') {
                                    account = callInfo.group_code;
                                } else if (callInfo && callInfo.group_code == '0') {

                                    for (var key in callInfo.accounts) {
                                        if (key != $.jqEBMessenger.clientInfo.my_uid) {
                                            account = key;
                                            break;
                                        }
                                    }
                                }
                                switch (state) {
                                    //
                                    case errCodeMap.OK:
                                        //$.ShowSysTips(callId, "对方已经成功接收到文件。<br/> <span style='color: blue;'>" + fileName + "</span>");
                                        var showHtml = [
                                            "<div class='eb_info'>",
                                            "对方已经成功接收到文件：" + fileName,

                                            "</div>"


                                        ];
                                        $.ebTemp.fun.push_info(account, showHtml.join(""))
                                        break;
                                    //f对方拒绝或取消接收文件事件
                                    case errCodeMap.UPLOAD_FILE_REJECT:
                                        //$.ShowSysTips(callId, "对方<span style='color:red;font-weight:bold;'>拒绝</span>接收文件。<br/> <span style='color:red;'>" + fileName + "</span>");
                                        var showHtml = [
                                            "<div class='eb_info'>",
                                            "对方拒绝接收文件：" + fileName,

                                            "</div>"


                                        ];
                                        $.ebTemp.fun.push_info(account, showHtml.join(""))
                                        break;
                                }
                            });

                            layer.close(index);

                        }

                    }, function () {


                    });
                    $(".xubox_setwin").hide();

                });



            },
            init_emos: function (emos) {
                var top = $("#layim_addface").offset().top - 230;
                var left = $("#layim_addface").offset().left;
                var temp = '<div id="faces_div"  style="background:#fff;display:none;z-index:100000000;position: absolute;left:' + left + 'px;top:' + top + 'px;height: 200px;overflow: auto;width: 400px;padding:5px;border:1px solid #61BA7A;">';
                emos.sort(function (a, b) {
                    return parseInt(a.index) - parseInt(b.index);
                });
                for (var i = 0; i < emos.length; i++) {
                    var emo = emos[i];
                    if (emo.res_type != '6') {
                        continue;
                    }
                    var url = [
                        "http://",
                        emo.server,
                        "/servlet.ebwebcm.res?resid=",
                        emo.resid
                    ].join("");
                    //var url = pool.emos[i].url;


                    var img = '<img class="face" name="face" width="30px" height="30px" src="' + url + '" ' +
                        ' resid="' + emo.resid + '"' +
                        ' server="' + emo.server + '"' +
                        ' cmserver="' + emo.server + '"' +
                        ' desc="' + emo.desc + '"' +
                        ' index="' + emo.index + '"' +
                        ' type="' + emo.type + '"' +
                        ' res_type="' + emo.res_type + '"' +
                        ' />';

                    temp += img;
                }
                temp += '</div>';
                $('body').append(temp);
                $(".face").on('click', function () {
                    var writeArea = $.ebTemp.dom.writer_area;

                    var html = writeArea.val() + '<img src="' + $(this).attr("src") + '" ' +
                        ' resid=' + $(this).attr('resid') +
                        ' desc="' + $(this).attr('desc') + '"' +
                        ' cmserver="' + $(this).attr('cmserver') +

                        '" />';
                    writeArea.val(html);
                    //var account = $("#layim_chatbox").attr("uid");
                    //if (account && parseInt(account) > 0) {
                    //    $.ebCache.wait_send_mes_map[account] = html;
                    //}


                    $("#faces_div").hide();
                });
                $("#layim_addface").on("click", function () {
                    var top = $("#layim_addface").offset().top - 230;
                    var left = $("#layim_addface").offset().left;
                    $("#faces_div").css("top", top + "px");
                    $("#faces_div").css("left", left + "px");
                    $("#faces_div").toggle(250);

                });
            },
            _init_contact: function (contacts) {
                if(!contacts){
                    contacts = [];
                }
                $.each(contacts,function(i,m){

                });
                var contact_ul = $("#contact_list");
                //初始化联系人
                if (!contacts || contacts.length == 0) {
                    var html = '<li data-id="1" class="xxim_parentnode"><h5><i></i><span class="xxim_parentname">默认分组</span><em class="xxim_nums">（0）</em></h5></li>';
                    contact_ul.append(html);
                    return;
                }

                var groups = {};

                var gname_array = [];


                $.each(contacts, function(i, m){
                    var group_name = m.group;
                    if (group_name.length === 0) {
                        group_name = "默认分组";
                    }
                    if (!groups[group_name]) {
                        var group = $('<li data-id="1" class="xxim_parentnode">' +
                            '<h5 onclick="$.ebTemp.event.fold($(this));"><i></i>' +
                            '<span class="xxim_parentname">' + group_name + '</span>' +
                            '<em class="xxim_nums">(0)</em>' +
                            '</h5>' +
                            '<ul style="display: none;" class="xxim_chatlist">' +

                            '</ul>' +
                            '</li>');
                        groups[group_name] = group;
                        gname_array.push(group_name);

                    }
                    var state_info = m.con_uid + "-" + m.line_state;
                    var contact_title = m.name.length > 0 ? m.name : m.contact;
                    var $li = $('<li state_info="' + state_info + '"  unread="0"  class="xxim_childnode" name="' + contact_title + '"  account="' + m.con_uid + '" onclick="$.ebTemp.event.click_contact($(this));" >' +
                        '<img src="' + $.eb_client_config.contact_img + '" class="xxim_oneface">' +
                        '<span class="xxim_onename">' + contact_title + '</span>' +
                        '</li>');

                    $.im_state.set_state($li, m.line_state);

                    m.user_name =  m.name;
                    m.member_account = m.contact;

                    $li.children('img').mouseover(function(){

                        $.ebTemp.temp_init_handler._show_card($("#xxim_top"), 1, $li.attr('account'),m);

                    });
                    $li.children('img').mouseleave(function(){
                        $.ebTemp.temps.card.remove();
                    });
                    groups[group_name].find('.xxim_chatlist').append($li);
                });



                for (var j = 0; j < gname_array.length; j++) {

                    var gname = gname_array[j];

                    groups[gname].appendTo(contact_ul);
                }

                $("#contact_list .xxim_parentnode").each(function () {
                    var size = $(this).find(".xxim_chatlist .xxim_childnode").length;
                    var online_size = $(this).find(".online").length;
                    $(this).find("h5 .xxim_nums").html("[" + online_size + "/" + size + "]")
                });
            },
            /**
             * 显示联系人或者部门名片
             * @param $dom 鼠标悬停的元素
             * @param type 类型 1、联系人 2、部门或群组
             * @param id 部门id或者用户id
             * @param m 联系人信息：群组或部门可省略此参数
             * @private
             */
            _show_card: function($dom, type, id, m){
                var $card = $.ebTemp.temps.card;
                var top = $dom.offset().top;
                var left = $dom.offset().left;
                $card.removeClass("left");
                $card.removeClass("top");
                if($dom.parent().attr("id") == "layim_groupthis"){

                    $card.css("left", left + 135);

                }else{

                    top = $("#xxim_top").offset().top + 200;
                    $card.css("left",left - 230 - 30);

                }

                $card.css("top", top);



                $card.html('');
                if(type == 1){
                    var name = m.user_name.length > 0 ? m.user_name : m.member_account;
                    $('<div class="card_name">' + name + '('+ id +')' +  '</div>').appendTo($card);
                    $('<div class="card_des">'+ m.description +'</div>').appendTo($card);
                    $('<ul class="card_info">'+
                        '<li>电话：'+ m.tel +' </li>'+
                        '<li>手机：'+ m.phone +' </li>'+
                        '<li>邮箱：'+ m.email +' </li>'+
                        '<li>传真：'+ m.fax +' </li>'+
                        '<li>地址：'+ m.address +' </li>'+

                        '</ul>').appendTo($card);

                    var group_info = $.ebCache.get_group(m.group_code);
                    if(group_info){
                        $('<div class="card_from">'+ group_info.group_name +'</div>').appendTo($card);
                    }
                }else if(type == 2){

                    var group_info = $.ebCache.get_group(id);
                    var name = group_info.group_name;
                    var fax = group_info.fax;
                    var addr = group_info.address;
                    var email = group_info.email;
                    var phone = group_info.phone;
                    var des = group_info.description;
                    var url = group_info.url;
                    var enterprise_code = group_info.enterprise_code;
                    var ent_name = $.ebCache.org.enterprise_info.enterprise_name;
                    var type = "群组";
                    if(enterprise_code && parseInt(enterprise_code) > 0){
                        type = "部门";
                    }
                    $('<div class="card_name">' + name + ' - ' + type + "：" + id +  '</div>').appendTo($card);
                    $('<div class="card_des">'+ des +'</div>').appendTo($card);
                    $('<ul class="card_info">'+
                        '<li>电话：'+ phone +' </li>'+
                        '<li>网址：'+ url +' </li>'+
                        '<li>邮箱：'+ email +' </li>'+
                        '<li>传真：'+ fax +' </li>'+
                        '<li>地址：'+ addr +' </li>'+

                    '</ul>').appendTo($card);
                    if(enterprise_code && parseInt(enterprise_code) > 0){
                        $('<div class="card_from">'+ ent_name +'</div>').appendTo($card);
                    }
                }

                $card.appendTo($("body"));

            }
            ,

            /**
             *  初始化我的部门和群组
             * @param org 公司组织架构信息
             * @private
             */
            _init_group: function (org) {

                var groups = org.groups;//群组

                var members = org.members;//群组成员
                //找出我的群组,向面板中提插入群
                var my_groups = [];
                for (var i = 0; i < groups.length; i++) {
                    var group = groups[i];
                    var my_emp_id = parseInt(group.my_emp_id);
                    if (my_emp_id != 0) {
                        my_groups.push(group);

                        var group_obj = $('<li name="' + group.group_name + '" gid="' + group.group_code + '"  class="xxim_parentnode">' +
                            '<h5 ><i onclick="$.ebTemp.event.fold($(this).parent());"></i>' +
                            '<span class="xxim_parentname" onclick="$.ebTemp.event.fold($(this).parent());">' + group.group_name + '</span>' +
                            '<em class="xxim_nums"></em>' +
                            '<span style="position: relative;left:10px;top:3px;display: none;" name="group_send_btn"  onclick="$.ebTemp.event.click_contact($(this).parent().parent());">' +
                            '<img  src="images/send.png" />' +
                            '</span>' +
                            '</h5>' +
                            '<ul style="display: none;" class="xxim_chatlist">' +

                            '</ul>' +
                            '</li>');
                        var h5 = group_obj.children('h5');
                        group_obj.appendTo($("#group_list"));
                        h5.children('.xxim_parentname').mousemove(function () {
                            $(this).parent().children("[name='group_send_btn']").show();
                        });
                        h5.mouseleave(function () {
                            $(this).children("[name='group_send_btn']").hide();
                        });
                        h5.children('i').mousemove(function(){

                            $.ebTemp.temp_init_handler._show_card($("#xxim_top"), 2, $(this).parent().parent().attr('gid'));
                        });
                        h5.children('i').mouseleave(function(){
                            $.ebTemp.temps.card.remove();
                        });


                    }
                }

                //向群组中添加成员

                for (var j = 0; j < my_groups.length; j++) {


                    var group = my_groups[j];

                    var gid = group.group_code;

                    $.ebCache.handler_members(gid, function (members) {

                        $.each(members,function(i,member){
                            $.ebCache.my_group_members[member.member_uid] = member;
                            //var member = members[j];
                            var head_img = $.eb_client_config.contact_img;
                            if (member.head_file.length > 0) {
                                head_img = member.head_file;
                            }
                            var contact_title = member.user_name.length > 0 ? member.user_name : member.member_account;

                            var state_info = member.member_uid + "-" + member.line_state;
                            //var state_class;//在线状态css样式
                            //if(member.line_state == "1"){
                            //    state_class = "online";
                            //}else if(member.line_state == "2" || member.line_state == "3"){
                            //    state_class = "offline";

                            //}
                            //var mouse_over = function(){
                            //    $.ebTemp.temp_init_handler._show_card($g_li, 1, $g_li.attr('account'),member);
                            //}
                            //var mouse_leave = function(){
                            //    $.ebTemp.temps.card.remove();
                            //}
                            var $g_li = $('<li  state_info="' + state_info + '"  unread="0"  class="xxim_childnode" name="' + contact_title + '"  account="' + member.member_uid + '" onclick="$.ebTemp.event.click_contact($(this));" >' +
                                '<img  src="' + head_img + '" class="xxim_oneface">' +
                                '<span class="xxim_onename">' + contact_title + '</span>' +
                                '</li>');
                            $g_li.appendTo($("#group_list li[gid='" + member.group_code + "']").find('.xxim_chatlist'));
                            $.im_state.set_state($g_li, member.line_state);
                            $g_li.children('img').mouseover(function(){
                                $.ebTemp.temp_init_handler._show_card($("#xxim_top"), 1, $g_li.attr('account'),member);

                            });
                            $g_li.children('img').mouseleave(function(){
                                $.ebTemp.temps.card.remove();
                            });


                            var online_size = $("#group_list li[gid='" + member.group_code + "'] .online").length;
                            $("#group_list li[gid='" + member.group_code + "']").find(".xxim_nums").html(' [' + online_size + '/' + members.length + ']');


                        });


                    });

                }
            },

            init_main_win: function (contacts, org) {
                this._init_contact(contacts);//初始化联系人
                this._init_group(org);//初始化我的群组
                $.eb_organize.init("struct_list");//初始化组织架构


                //最近会话处理
                $("#xxim_mymsg").click(function(){

                    var recent_list = $.ebCache.recent_call_cache;
                    var $recent_list = $.ebTemp.temps.recent_list;
                    $recent_list.html("");
                    $('<div style="line-height: 30px;font-size: 12px;padding-left: 5px;color:#b83b29;">最近会话' +
                            '<span class="recent_back" onclick="$.ebTemp.temps.recent_list.remove();"><<返回聊天</span>' +
                        '</div>')
                        .appendTo($recent_list);

                    $recent_list.css("top",$("#xxim_tabs").offset().top);
                    $recent_list.css("left",$("#xxim_tabs").offset().left);

                    $.each(recent_list, function(i,item){
                        var type = item.type;
                        var id = item.id;
                        var time = Math.ceil((new Date().getTime() - item.time)/1000/60) + "分钟前";

                        var $temp = undefined;
                        if(type == "1"){
                            var accountInfo = $.jqEBMessenger.accountInfoMap[id];
                            if(accountInfo){
                                var title = accountInfo.fInfo.name.length > 0 ? accountInfo.fInfo.name : accountInfo.from_account;
                                var $user_lis = $(".xxim_childnode[account='"+ id +"']");
                                var state = "offline";
                                if($user_lis.length > 0){
                                    if($user_lis.hasClass("online")){
                                        state = "online";
                                    }
                                }


                                $temp = $('<div class="searchuser '+ state +'" account="'+accountInfo.uid+'">' +
                                        '<img src="images/logo2.gif" height="20px" width="20px"> ' +
                                            title    +
                                            '<span style="color:gray;"> - '+ time + '</span>' +
                                        '</div>');
                            }

                        }else if(type == "2"){
                            var groupInfo = $.ebCache.get_group(id);
                            if(groupInfo){
                                $temp = $('<div class="searchuser online" account="'+ groupInfo.group_code +'">' +
                                        '<img src="images/group.png" height="20px" width="20px"> ' +
                                            groupInfo.group_name +
                                            '<span style="color:gray;"> - '+ time + '</span>' +
                                        '</div>');
                            }
                        }
                        if($temp){
                            $temp.appendTo($recent_list);
                            $temp.click(function(){
                                var uid = $(this).attr("account");
                                if(type == "1"){
                                    if($(".xxim_childnode[account='"+ uid +"']").length > 0){
                                        $(".xxim_childnode[account='"+ uid +"']").click();
                                    }else{
                                        $.ebChat.call(uid, $.jqEBMessenger.chat_type.single,function(e){

                                        },function(error){
                                            $.im_state.state_handler(error);
                                        });
                                    }
                                }else if(type == "2"){
                                    $("#group_list li[gid='"+ uid +"'] [name='group_send_btn']").click();
                                }

                            });
                        }
                    });

                    $recent_list.appendTo($('body'));
                });

                //卡片切换

                $("#xxim_tabs").children('span').click(function () {

                    var type = $(this).attr('class');

                    $("#xxim_tabs").children('span').removeClass('xxim_tabnow');


                    $("#xxim_tabs").children('span').each(function(){
                            var imgSrc = $(this).find("img").attr("src");
                            if(imgSrc.indexOf("-white") == -1){
                                imgSrc = imgSrc.split(".")[0] + "-white.png";

                                $(this).find("img").attr("src",imgSrc);
                            }


                    });

                    $(this).addClass('xxim_tabnow');
                    var imgName = $(this).find("img").attr("src");
                    $(this).find("img").attr("src",imgName.replace(/-white/,""));

                    $("#contact_list,#group_list,#struct_list").hide();
                    if (type.indexOf('xxim_tabfriend') > -1) {
                        $("#contact_list").show();
                    } else if (type.indexOf('xxim_tabgroup') > -1) {
                        $("#group_list").show();
                    } else if (type.indexOf('xxim_latechat') > -1) {
                        $("#struct_list").show();
                    }
                });


                //搜索用户
                $("#xxim_searchkey").keyup(function (e) {
                    if($.trim($(this).val()).length == 0){
                        $("#searchuser_list").html("");
                        $("#searchuser_list").hide();
                        return;
                    }

                    if(e.keyCode == "13"){
                        var search_list = $("#searchuser_list");

                        var value = $.trim($(this).val());

                        if(value.length == 0){
                            layer.alert("请输入关键字");
                            return;
                        }
                        search_list.html("");

                        $.ebCache.search_user(value,function(data){
                            search_list.html("");
                            var users = data.users;
                            users.sort(function(a,b){
                                return parseInt(b.line_state) - parseInt(a.line_state);
                            });
                            if(users.length > 0){
                                $("#searchuser_list").show();
                            }
                            for(var i=0;i<users.length;i++){
                                var user = users[i];

                                var name = user.user_name + ' - ' + user.member_account;
                                if(user.user_name == user.member_account){
                                    name = user.user_name;
                                }
                                //var name = user.user_name.length > 0 ? user.user_name : user.member_account;
                                var head_file = $.trim(user.head_file);

                                if(!head_file || head_file.length == 0){
                                    head_file = $.eb_client_config.contact_img;
                                }
                                var $user = $('<div class="searchuser" account="'+user.member_uid+'">'
                                    + '<img width="20px" height="20px"  src="'+head_file+'" />'
                                    + ' ' + name
                                    + '</div>');
                                $.im_state.set_state($user,user.line_state)
                                $user.click(function(){


                                    var uid = $(this).attr("account");
                                    $.ebCache.user_clicltime_map[uid] = new Date().getTime();
                                    if(uid == $.jqEBMessenger.clientInfo.my_uid){
                                        layer.alert("不能呼叫自己");
                                        return;
                                    }
                                    if($(".xxim_childnode[account='"+ uid +"']").length > 0){
                                        $(".xxim_childnode[account='"+ uid +"']").click();
                                    }else{
                                        $.ebChat.call(uid, $.jqEBMessenger.chat_type.single,function(e){

                                        },function(error){
                                            $.im_state.state_handler(error);
                                        });
                                    }
                                });
                                $user.appendTo(search_list);
                            }


                        },function(state){
                            $.im_state.state_handler(state)
                        });

                    }

                });
            }
        }

        $.ebTemp.cache = {
            chat_win_index : null,
            chat_win_map:{},
            mes_ring_inited:false,
            calling_cache: {}//缓存正在call的账号

        };

        $.ebTemp.temp_handler = {
            show_main_win:function(contacts,org){



                $('body').append($.ebTemp.temps.main_win);
                $.ebTemp.temp_init_handler.init_main_win(contacts,org);
                $.ebTemp.temp_init_handler.init_ring();


            },
            /**
             * show the chat window
             * @param data chat window init data {uid:'',url:'',face:''}
             */
            show_chat_win : function(data){


                if(!$.ebTemp.cache.chat_win_index){

                    var win_index = $.layer({
                        type: 1,
                        border: [0],
                        title: false,
                        shade: [0],
                        area: ['620px', '493px'],
                        move: '.layim_chatbox .layim_move',
                        moveType: 1,
                        closeBtn: false,
                        offset: [(($(window).height() - 493)/2)+'px', ''],
                        page: {
                            html: $.ebTemp.temps.chat_win
                        }
                    });

                    $.ebTemp.cache.chat_win_index = win_index;
                    $.ebTemp.temp_init_handler.init_dom();
                    $.ebTemp.temp_init_handler.init_event();
                    $.ebTemp.temp_init_handler.init_chat_win(data);
                    $.ebTemp.temp_init_handler.init_ring();
                    $.ebTemp.temp_init_handler.init_emos( $.ebCache.org.emotions);
                    $.im_state.init();
                }else{
                    $.ebTemp.temp_init_handler.init_chat_win(data);
                    $("#layim_chatbox").show();
                }
            },

            //显示登录界面
            show_logon_win: function(logon_callback){



                $.ebMsg.querysysinfo(function(data){

                    if(data.code && data.code == "0"){
                        $.ebCache.sysinfo = data;
                        var $html = $($.ebTemp.temps.logon_win_new);



                        $html.appendTo($('body'));


                        $.ebTemp.temp_init_handler.init_logon_win(logon_callback, data);
                        $("#accountInput").focus();

                        $.ebCache.logon_win_index = "login_win";
                    }else{
                        $.im_state.state_handler({msg:"加载服务器信息失败"});
                    }

                },function(error){
                    $.im_state.state_handler(error);
                });



            },
            close_logon_win: function(){
                $("#"+$.ebCache.logon_win_index).hide();
                $.ebCache.logon_win_index = null;
                $('body').css('background','#fff');
                $(".eb_error_tag").hide();
                $("#entbooost_link").hide();
            }
        };


    })(window,jQuery);


    (function (window, $) {


        //获取get参数集合
        var $_GET = (function(){
            var url = window.document.location.href.toString();
            var u = url.split("?");
            if(typeof(u[1]) == "string"){
                u = u[1].split("&");
                var get = {};
                for(var i in u){
                    var j = u[i].split("=");
                    get[j[0]] = j[1];
                }
                return get;
            } else {
                return {};
            }
        })();
        /**
         * chat record info
         * @param content
         * @param type
         * @param name
         * @param time
         */
        var Chat = function(content, type, name, time){
            this.content = content;
            this.type = type;
            this.name = name;
            this.time = time;
        }

        var CallAndAccountInfo = function(callInfo,accountInfo){
            this.callInfo = callInfo;
            this.accountInfo = accountInfo;
        }
//        ebUI.callInfoMap[callInfo.call_id] = callInfo;
//        ebUI.accountInfoMap[accountInfo.uid] = accountInfo;
        //显示聊天界面
        $.extend({
            ebCache : {
                eb_sid:null,//token
                sysinfo:{},//系统初始化信息
                logon_params: {},//登录后参数
                user_clicltime_map: {},//点击用户时间缓存
                timer_map: {}, //退出会话计时器列表
                chatid_list:[],//会话id列表
                recent_call_cache: [],//最近会话列表[{type:xxx,id:xxx}] type 1、用户 2、群组
                search_user: {},//搜索用户信息缓存{key:[list]}
                recall_cache:{},//会话失效缓存，{uid:callInfo}
                card_cache:{},//用户电子名片缓存
                wait_send_mes_map: {},//待发送消息map
                cur_contact_id: null,//当前联系人ID
                org:{},//公司组织架构,不包含员工
                org_members:{},//部门员工缓存{group_code:[members_list]}
                org_member:{},//员工信息缓存{uid:xxx}
                my_group_members: {},//我的部门或群组终端员工{uid:xxx}
                org_loaded:false,//组织架构是否加载
                $_GET : $_GET,
                user_type : '1',//登录类型 1、普通用户 2、游客
//                chat_cache : {},//聊天记录缓存{uid:[chat,chat.....]}
//                call_account_cache:{},
                chat_win_cache: {},//聊天窗口缓存{uid/groupid:dom_id}

                call_time: {},//进入会话的时间
                logon_win_index:null,

                //下载离线文件
                ack_file: function(call_id,msg_id,url){

                    $.ebMsg.fileack(call_id,msg_id,0,function(param){
                        window.open(url);
                    },function(state){
                        im_state.state_handler(state)
                    })

                },
                /**
                 * 电子名片处理
                 *  @param uid 用户ID
                 *  @param callback 回调
                 */
                handler_cart: function(uid, callback){
                    var card = $.ebCache.card_cache[uid];
                    if(card){
                        callback(card);
                    }else{
                        $.ebMsg.userQuery(uid, function(data){
                            callback(data);
                            $.ebCache.card_cache[uid] = data;
                        },function(state){
                            $.im_state.state_handler(state);
                        });
                    }

                },
                /**
                 * 添加最近会话
                 * @param type 类型 1、用户 2、群组
                 * @param id uid 或者 group_id
                 */
                add_recent_call: function(type, id){
                    var cache = $.ebCache.recent_call_cache;
                    var n = 0;
                    for(var i=0;i<cache.length;i++){
                        var item = cache[i];
                        if(item.type == type && item.id == id){
                            n++;
                            break;
                        }
                    }
                    if(n == 0){
                        cache.push({type:type, id:id, time: new Date().getTime()});
                    }
                }
                ,
                /**
                 * 查询用户信息
                 * @param type 1、用户注册查询 2、用户登录查询 6、用户信息查询
                 * @param uid
                 * @param callback
                 */
                handler_member:function(type,uid,callback){//根据uid查找用户信息
                    var member = $.ebCache.org_member[uid];
                    if(member){
                        callback(member);
                    }else{
                        $.ebMsg.queryUser(type, uid, function(member){
                            if(member){
                                callback(member);
                                //$.ebCache.org_member[uid] = member;
                            }

                        },function(state){
                            //layer.alert("用户信息错误");
                        });
                    }
                },
                /**
                 *
                 * @param key 关键字
                 * @param callback 回调函数
                 */
                search_user: function(key,callback){
                    var search_cache = $.ebCache.search_user[key];

                    if(!search_cache){
                        $.ebMsg.searchuser(key,function(data){
                            $.ebCache.search_user[key] = data;
                            callback(data);

                        },function(state){
                            $.im_state.state_handler(state)
                        });
                    }else{
                        callback(search_cache);
                    }
                }
                ,
                /**
                 *
                 * @param gid 部门ID
                 * @param callback 对部门员工的回调
                 */
                handler_members: function(gid, callback){
                    var sort_members = function(membs){

                        membs.sort(function(a,b){
                            if(a.line_state != b.line_state){
                                return b.line_state - a.line_state;
                            }else{
                                var str1 = $URL.toGBKInt(a.user_name);
                                var str2 = $URL.toGBKInt(b.user_name);
                                return str1 > str2 ? 1 : -1;

                            }

                        });
                    }

                    var update_ols = function(group_id,members,call){

                            $.ebMsg.loadols(group_id,function(params){

                                var ols = params.user_ols;
                                for(var i=0;i<members.length;i++){
                                    var m = members[i];
                                    m.line_state = "2";
                                    for(var j=0;j<ols.length;j++){
                                        var ol = ols[j];
                                        if(ol.user_id == m.member_uid){
                                            m.line_state = ol.line_state;
                                        }

                                    }
                                }
                                sort_members(members);
                                call(members);

                                $.ebCache.org_members[group_id] = members;


                            }, function (state) {
                                layer.alert(error.msg);
                            });
                    }



                    var members = $.ebCache.org_members[gid];

                    if(members){
                        update_ols(gid,members,callback);
                        //sort_members(members);
                        //
                        //callback(members);

                    }else{

                        var storage = window.localStorage;
                        var group = $.ebCache.get_group(gid);
                        var store_ver = storage.getItem("version:"+gid);
                        if(storage && store_ver == group.group_ver && storage.getItem("members:"+gid)){
                            var store_members = JSON.parse(storage.getItem("members:"+gid));

                            update_ols(gid,store_members,callback);



                        }else{
                            $.ebMsg.loadorg({
                                group_code:gid,
                                load_my_group:'0',
                                load_ent_dep:'0',
                                load_image:'0'

                            },function(org){
                                if(org && org.members){
                                    sort_members(org.members);
                                    callback(org.members);
                                    $.ebCache.org_members[gid] = org.members;

                                    if(window.localStorage) {
                                        storage = window.localStorage;
                                        storage.setItem("members:"+gid, JSON.stringify(org.members));
                                        storage.setItem("version:"+gid, group.group_ver);
                                    }

                                }


                            },function(error){
                                layer.alert(error.msg);
                            });

                        }



                    }


                }
                ,
                get_group:function(gid){//根据群组id查找群组信息
                    var groups = this.org.groups;

                    var result = null;
                    for(var i=0;i<groups.length;i++){
                        var group = groups[i];
                        if(group.group_code == gid){
                            result = group;
                            break;

                        }
                    }
                    return result;
                },

                get_chats : function(uid){
                    var chat_list = this.chat_cache[uid];
                    if(!chat_list){
                        this.chat_cache[uid] = [];
                    }
                    return this.chat_cache[uid];

                },
                add_call_account_cache: function(callInfo, accountInfo){
                    var call_account_info = new CallAndAccountInfo(callInfo, accountInfo);
                    this.call_account_cache[accountInfo.uid] = call_account_info;
                    this.call_account_cache[accountInfo.from_account] = call_account_info;
                }
                ,
                get_call_account_cache: function(uid){
                    var cache = this.call_account_cache[uid];
                    return cache;
                },
                add_logon_user: function(logonUser){
                    this.logon_user_cache = logonUser;
                },
                get_logon_user: function(){
                    return this.logon_user_cache;
                },
                remove_logon_user: function(){
                    this.logon_user_cache = null;
                }
            }
        });


    })(window, jQuery);


    /**
     * 企业组织架构模块
     */
    (function (window, $) {

        var eb_client_config = $.eb_client_config;//配置信息
        var temp = $.ebTemp.temps;//网页模板
        var cache = $.ebCache;//缓存信息
        var treeId = null; //tree所在元素的id

        $.extend({eb_organize:{

            /**
             * 用户在线状态变更后，重新排序
             * @param data 在线数据
             */
            reList: function(data){
                var gid = data.group_id;
                var uid = data.from_uid;

                var account = data.from_account;
                var state = data.line_state;

                var treeObj = $.fn.zTree.getZTreeObj(treeId);

                var nodes = treeObj.getNodesByFilter(function(node){
                    return node.id == uid;
                });

                $.each(nodes,function(index,node){
                    node.line_state = state;
                    var parentNode = node.getParentNode();
                    var nodeList = parentNode.children;

                    nodeList.sort(function(a,b){

                        if(a.line_state != b.line_state){
                            return b.line_state - a.line_state;
                        }else{
                            var str1 = $URL.toGBKInt(a.name);
                            var str2 = $URL.toGBKInt(b.name);
                            return str1 > str2 ? 1 : -1;

                        }

                    });
                    treeObj.removeChildNodes(parentNode);
                    treeObj.addNodes(parentNode,nodeList);
                    nodeList = parentNode.children;
                    $.each(nodeList, function(index, node){
                        $.eb_organize._set_iconcss(node);
                    });

                });




            }
            ,
            /**
             * 初始化企业组织结构数据
             * @private
             */
            _init_data: function(){
                var org = cache.org;

                var depart_info = org.enterprise_info;//企业信息

                var groups = org.groups;//群组列表(包含个人群组)
                var members = org.members;//成员列表

                var data = [];
                data.push({
                    isRoot:true,
                    id:'0',
                    name: depart_info.enterprise_name + " ["+ $.eb_organize._count_members() +"]",
                    open:true

                });
                for(var i=0;i<groups.length;i++){
                    var g = groups[i];
                    if(g.enterprise_code != '0'){

                        g['pId'] = g.parent_code;
                        g['name'] = g.group_name + " ["+ g.emp_count  +"]";
                        g['id'] = g.group_code;
                        g['isParent'] = true;
                        g['url'] = null;
                        data.push(g);
                    }
                }

                data.sort(function(a,b){
                    return a.display_index - b.display_index;
                });
                return data;


            },


            _node_click: function(event, treeId, treeNode, clickFlag){
                var eb_tree = $.fn.zTree.getZTreeObj(treeId);
                if(treeNode.isParent){
                    if(treeNode.open){
                        eb_tree.expandNode(treeNode,false,false,true,true);
                    }else{
                        eb_tree.expandNode(treeNode,true,false,true,true);
                    }
                }

                var member_uid = treeNode.member_uid;
                var name = treeNode.name;
                if(member_uid){
                    var $obj = $('<div account="'+member_uid+'" name="'+name+'"></div>');
                    $.ebTemp.event.click_contact($obj);

                }
            },


            _node_expanded: {},//缓存组织结构部门是否已经展开
            vvv:"123",
            /**
             * 设置头像css
             * @param id
             * @private
             */
            _set_iconcss: function(node){
                var icon = node['icon'];
                var $img = $('<img />');
                $img.attr('src',icon);
                $img.css("width","17px");
                $img.css("height", "17px");
                $img.css("position","relative")
                $img.css("top","14px");

                var $imgSpan = $("#" + node.tId).find(".ico_docu");
                $img.appendTo($imgSpan);

                $imgSpan.removeAttr("style");
                $.im_state.set_state($imgSpan,node.line_state);

            }
            ,
            /**
             * 计算公司人数
             * @private
             */
            _count_members: function(){
                var org = $.ebCache.org;
                var groups = org.groups;
                var allMembers = 0;
                $.each(groups, function(index, group){
                    allMembers += parseInt(group.emp_count);
                });
                return allMembers;
            }
            ,
            _node_expand: function(event, treeId, treeNode){//展开部门，加载联系人

                var expands = $.eb_organize._node_expanded;

                var eb_tree = $.fn.zTree.getZTreeObj(treeId);
                if(expands[treeNode.id]){
                    return;
                }

                if(treeNode.id == '0'){
                    return;
                }

                cache.handler_members(treeNode.id, function(members){
                    var newNodes = [];
                    for(var i=0;i<members.length;i++){
                        var m = members[i];
                        if(cache.get_group(m.group_code).enterprise_code != '0'){

                            m['id'] = m.member_uid;
                            m['pId'] = m.group_code;
                            m['isParent'] = false;
                            var headFile = eb_client_config.organize.member_icon;
                            if(m['head_file'] && m['head_file'].length > 0) {
                                headFile = m['head_file'];
                            }
                            m['icon'] = headFile;
                            m['name'] = m.user_name.length > 0 ? m.user_name : m.member_account;
                            newNodes.push(m);

                        }
                    }
                    eb_tree.addNodes(treeNode,newNodes,true);
                    treeNode['expanded'] = true;
                    expands[treeNode.id] = true;


                    var nodeList = treeNode.children;

                    $.each(nodeList, function(index, node){
                        $.eb_organize._set_iconcss(node);

                    });

                });



            },

            init:function(id){
                treeId = id;
                if(!cache.org.enterprise_info ){
                    $(".xxim_latechat").hide();
                    return;
                }
                var click_event = this._node_click;
                var expand_event = this._node_expand;
                function addDiyDom(treeId, treeNode) {
                    var spaceWidth = 5;
                    var switchObj = $("#" + treeNode.tId + "_switch"),
                        icoObj = $("#" + treeNode.tId + "_ico");
                    switchObj.remove();
                    icoObj.before(switchObj);

                    if (treeNode.level > 1) {
                        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
                        switchObj.before(spaceStr);
                    }
                }
                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback:{
                        onClick: click_event,
                        onExpand: expand_event
                    },
                    view: {
                        showLine: false,
                        showIcon: false,
                        selectedMulti: false,
                        dblClickExpand: false,
                        addDiyDom: addDiyDom
                    }
                };
                var init_data = this._init_data();
                $.fn.zTree.init($("#"+id), setting, init_data);
                var treeObj = $("#"+id);
                treeObj.addClass("showIcon")

                var eb_tree = $.fn.zTree.getZTreeObj(treeId);
                var root = eb_tree.getNodesByFilter(function(node){
                    return node.id == "0";
                },true);
                var $button = $("#" + root.tId).find(".switch:first");
                //$button.removeClass("button");
                var $comImage = $("<img src='"+eb_client_config.organize.ent_icon+"' />");
                $comImage.css("width","20px;");
                $comImage.css("height","20px");

                $comImage.appendTo($button);


                //var cpmpanyPram = $("[title*='eb_company']").attr("title");
                //$("[title*='eb_company']").find("span:first").hide();
                //var $comImage = $("<img src='"+eb_client_config.organize.ent_icon+"' />");
                //$comImage.css("width","20px;");
                //$comImage.css("height","20px");
                //$comImage.css("position","relative");
                //$comImage.css("top","5px");
                //$("[title*='eb_company']").find("span:last").html("");
                //$comImage.appendTo($("[title*='eb_company']").find("span:last"));
                //$("[title*='eb_company']").find("span:last").append("<span style='margin-left: 5px;'>" + cpmpanyPram + "</span>");

            }



        }});



    })(window, jQuery);


    //状态管理模块
    (function (window, $) {
        var jqEBM = $.jqEBMessenger;
        var chat = $.ebChat;
        $.extend({im_state:{
            _cmhb_error: function(){
                var times = jqEBM.cmhbAuthErrorTimes;

                if(times >= 5){

                    window.onbeforeunload = null;
                    setTimeout("location.replace(location.href)",5000);
                    $.layer({
                        shade: [0.5, '#000'],
                        area: ['auto','auto'],
                        closeBtn:false,
                        dialog: {
                            msg: '登录状态已经失效!',
                            btns: 1,
                            type: 8,
                            btn: ['重新登录'],
                            yes: function(){
                                location.replace(location.href);
                            }
                        }
                    });
                }
            }
            ,
            _tick_off: function(){

                if(jqEBM.clientInfo.tickoff){
                    window.onbeforeunload = null;
                    setTimeout("location.replace(location.href)",10000);
                    $.layer({
                        shade: [0.5, '#000'],
                        area: ['auto','auto'],
                        closeBtn:false,
                        dialog: {
                            msg: '您的账号在别处登录了！',
                            btns: 1,
                            type: 8,
                            btn: ['重新登录'],
                            yes: function(){
                                location.replace(location.href);
                            }
                        }
                    });

                }

            },
            /**
             * 错误处理
             * @param state 状态信息
             * @param index 需要关闭的特效、窗口编号...
             */
            state_handler: function(state, index){

                if(index){
                    layer.close(index);
                }
                $(".eb_error_tag").show();
                var text = "未知错误";
                if(state.msg){
                    text = state.msg;

                }
                $("#error_span").html(state.msg);
                setTimeout(function(){
                    $(".eb_error_tag").hide();
                },3000);



            }
            ,
            /**
             * 监听是否在别处登录
             * @param interval 监听间隔（毫秒）
             *
             */
            kick_off_listerner: function(){
                setInterval($.im_state._tick_off,2000);
            },
            /**
             * 监听关闭和刷新事件
             */
            check_leave: function(){


                    //注册页面关闭前的事件
                    window.onbeforeunload = function () {


                        return "该操作将放弃保存当前的消息内容";
                    };
                    //window.onunload = function () {
                    //
                    //    $.ebMsg.offline(function(param){},function(state){});
                    //};


            },
            /**
             * cmhb失效次数超过100，重新登录
             */
            cmhb_error_listerner:function(){
                setInterval($.im_state._cmhb_error,2000);
            }
            ,
            /**
             * 设置在线状态
             * @param $element
             */
            set_state :function($element, state){

                if(state=="5"){
                    $element.removeClass("busy");
                    $element.removeClass("leave");
                    $element.removeClass("offline");
                    $element.addClass("online");
                }else if(state == "2" || state == "0") {
                    $element.removeClass("busy");
                    $element.removeClass("leave");
                    $element.removeClass("online");
                    $element.addClass("offline");
                }else if(state == "3" ){
                    $element.removeClass("leave");
                    $element.removeClass("online");
                    $element.removeClass("offline");
                    $element.addClass("busy");
                }else if(state == "4"){
                    $element.removeClass("busy");
                    $element.removeClass("online");
                    $element.removeClass("offline");
                    $element.addClass("leave");
                }
            }
            ,
            init: function(){

                var im_state = $.im_state;
                im_state.kick_off_listerner();
                //im_state.cmhb_error_listerner();
                var agent = window.navigator.userAgent;
                if(agent.indexOf('MSIE') == -1){
                    im_state.check_leave();
                }

            }


        }});



    })(window, jQuery);


    (function (window, $) {

        var eb_client_config = $.eb_client_config;//默认配置
        var im_state = $.im_state;
        $.extend({
            ebChat : {
                send : function(chatParam, chat){
                    var uid = chatParam.uid;
                    var call_id = chatParam.call_id;
//                    var call_account_info = $.ebCache.get_call_account_cache(uid);
//                    var call_id = call_account_info.callInfo.call_id;
                    var root_chat = chat;

                    chat = chat.replace(/<br \/>/gi,'\n');
//                     .replace(/<div>\s*<\/div>|<div\s*\/>/gi, '\n')
                    chat = chat.replace(/<\/p>/g, '\n');
                    chat = chat.replace(/<p>/g,'');
                    chat = $.trim(chat);


                    $.ebMsg.sendMessage(call_id,chat,function(){
//                       var chat_list = $.ebCache.get_chats(uid);

                        if($.jqEBMessenger.clientInfo.user_type == "visitor"){
                            $.jqEBMessenger.clientInfo.username = '游客';
                        }
                        $.ebTemp.fun.push_msg({
                            content: root_chat,
                            name: $.jqEBMessenger.clientInfo.username.length > 0 ?
                                  $.jqEBMessenger.clientInfo.username : $.jqEBMessenger.clientInfo.my_account,
                            face:eb_client_config.my_head_img,
                            time:new Date(),
                            type:'me'
                        },uid);

                        $.ebTemp.dom.writer_area.val('');
                        $.ebTemp.dom.writer_area.focus();
                        $.ebCache.wait_send_mes_map[uid] = '';


                    },function(state){

                        var recall_info = $.ebCache.recall_cache[uid];
                        var type = $.jqEBMessenger.chat_type.single;
                        if(recall_info){
                            if(recall_info.group_code != '0'){
                                type = $.jqEBMessenger.chat_type.group;
                            }

                            $.ebChat.call(uid,type,recall_info.chat_id);

                        }


                    });
                },
                /**
                 *
                 * @param target uid或者account
                 */
                call:function(target,type,chat_id){
                    //if(!chat_id){
                    //    chat_id = null;
                    //}
                    target = $.trim(target);
                    if(type == $.jqEBMessenger.chat_type.single){
                        $.ebMsg.callAccount(target, chat_id , null ,function(callInfo,accountInfo){


                        },function(error){
                            //alert("呼叫失败");
                            im_state.state_handler(error);
                            $.ebTemp.fun.remove_left_item(target);

                        });
                    }else if(type == $.jqEBMessenger.chat_type.group){
                        $.ebMsg.callGroup(target, chat_id ,function(callInfo){



                        },function(error){
                            //alert("呼叫失败");
                            im_state.state_handler(error);
                            $.ebTemp.fun.remove_left_item(target);
                        });
                    }

                },
                logonVistor : function(call_num){
                    $('body').css('background','#fff');
                    $.eb_client_config.cs.init();
                    var load_index = layer.load();
                    $.ebCache.user_type = '2';
                    $.ebMsg.logonVisitor(function(data){
                        $.ebCache.logon_params = data;
                        $.ebMsg.online(function(){
                            $.ebMsg.loadorg({
                                load_ent_dep:0,
                                load_my_group:0,
                                load_emp:0
                            },function(org){
                                if(org && org.emotions){
                                    $.ebCache.org = org;


                                    $.ebMsg.callAccount(call_num, null , null ,function(callInfo,accountInfo){

                                        //$.ebCache.add_call_account_cache(callInfo,accountInfo);


                                        layer.close(load_index);

                                        $(".layim_rightbtn").hide();


                                    },function(error){
                                        im_state.state_handler(error,load_index);
                                    });
                                }

                            },function(state){
                                im_state(state,load_index);
                            });


                        },function(state){
                            im_state(state,load_index);
                        });


                    } , function(state){
                        im_state.state_handler(state, load_index);
                    });
                },
                logon: function(){

                    var logon_user = $.jqEBMessenger.clientInfo;

                    if(logon_user && logon_user.line_state == '0'){
                        $.ebTemp.temp_handler.show_logon_win(function(account, password){
                            $.ebMsg.queryUser(2, account, function(user){
                                var acount_type = user['account-type'];
                                var md5_password = $.md5(user.uid + "" + password).toLowerCase();
                                var logon_type = 4096;
                                if((acount_type && acount_type == "1") || $.ebCache.sysinfo['passwd-auth-mode'] == "2"){
                                    md5_password = password;
                                    logon_type = 4112;
                                }


                                //登录
                                var load_index = layer.load("登录中...",60);

                                $.ebMsg.logonAccount(user.uid, md5_password, logon_type ,function(param){


                                    $.ebCache.logon_params = param;


                                    //上线

                                    $.ebMsg.online(function(){

                                        //加载联系人
                                        $.ebMsg.loadcontact(function(contactList){

                                            $.ebMsg.loadorg({
                                                load_emp:'0'
                                            },function(org){
                                                if(!org){
                                                    im_state.state_handler({msg:"数据加载失败，请稍后再试！"},load_index);
                                                    return;
                                                }

                                                if(!$.ebCache.org_loaded){
                                                    $.ebCache.org_loaded = true;
                                                    $.ebCache.org = org;
                                                    var groups = org.groups;
                                                    groups.sort(function(a,b){
                                                        if(a.enterprise_code == b.enterprise_code){
                                                            return a.group_name > b.group_name ? 1 : -1;
                                                        }else{
                                                            return a.enterprise_code - b.enterprise_code;
                                                        }
                                                    });

                                                    $.ebTemp.temp_handler.show_main_win(contactList,org);
                                                    $.im_state.init();
                                                    layer.close(load_index);
                                                    $.ebTemp.temp_handler.close_logon_win();
                                                    $.jqEBMessenger.EBUM.ebwebum_loadinfo();
                                                    setInterval(function(){
                                                        $.jqEBMessenger.EBUM.ebwebum_loadinfo();
                                                    },120000);
                                                }



                                            },function(state){
                                                im_state.state_handler(state,load_index);
                                            });

                                        },function(state){
                                            im_state.state_handler(state,load_index);
                                        });
                                    });


                                },function(state){
                                    im_state.state_handler(state,load_index);

                                });
                            }, function(state){
                                im_state.state_handler(state);
                            });
                        });
                        return;
                    }

//                    $.ebMsg.queryUser(2,account,function(param){
//
//
//                    },function(state){
//                            alert(state.error);
//                    });

                }

            }

        });

        /*方法重写*/
        /**
         *
         * @param callInfo 呼叫信息
         * @param accountInfo 账号信息
         * @param richInfo 富文本
         */
        $.ebMsg.eventHandle.onReceiveMessage = function(callInfo, accountInfo, richInfo){
            $.ebTemp.fun.min_chat_win_mes();
            $.ebTemp.event.play_mes_ring();
            var content = "";
            for(var i=0;i<richInfo.length;i++){
                var mes = richInfo[i];

                if(mes.type == "text"){
                    content += $.ebfn.htmlEncode(mes.content);
                }else

                if(mes.type = "screenshot"){
                    
                    content += "<img type='screenshot' onclick='$.ebTemp.event.screenshot_handler($(this));' style='max-width:250px;cursor:pointer;' src='"+ mes.content +"'/>";
                }else
                if(mes.type = "emotion"){

                    content += "<img src='"+ mes.content +"'    />";
                }
            }

            if(callInfo.group_code != '0'){

                    type = "he";
                    var face = eb_client_config.opposite_head_img;
                    var name = $.ebTemp.fun.get_member_name(callInfo.group_code,accountInfo);

                    if(accountInfo == $.jqEBMessenger.clientInfo.my_uid){
                        type = "me";
                        face = eb_client_config.my_head_img;
                    }
                    $.ebTemp.event.count_msgs(callInfo.group_code,"group");
                    $.ebTemp.fun.push_msg({
                        content: content,
                        name: name,
                        face:face,
                        time:new Date(),
                        type:type
                    },callInfo.group_code);





            }else{
                if(!accountInfo){

                    if(callInfo.group_code == '0'){
                        accountInfo = {};
                        accountInfo.uid = $.jqEBMessenger.clientInfo.my_uid;
                    }
                }

                var uid = accountInfo.uid;
                $.ebTemp.event.count_msgs(uid,"single");

                //判断是否为本账号在其它客户端发送消息
                var type = 'he';
                var name = '';
                var face = eb_client_config.opposite_head_img;
                if($.jqEBMessenger.clientInfo.my_uid == uid){
                    for(var key in callInfo.accounts){
                        if(key != uid){
                            uid = key;
                            type = 'me';
                            name = $.jqEBMessenger.clientInfo.username;
                            face = eb_client_config.my_head_img;
                            break;
                        }
                    }

                }else{
                    name = accountInfo.fInfo.name.length > 0 ? accountInfo.fInfo.name : accountInfo.from_account;
                    if(name.length == 0){
                        name = accountInfo.uid;
                    }

                }

                $.ebTemp.fun.push_msg({
                    content: content,
                    name: name,
                    face:face,
                    time:new Date(),
                    type:type
                },uid);
            }


            $.ebTemp.event.reopen_chat_win();


        }

        /**
         * 收到文件
         */
        $.ebMsg.eventHandle.onReceiveFile = function(callInfo, from_uid, file_info){

            $.ebTemp.fun.push_info(from_uid, "<div class='eb_info'>收到文件："+file_info.file+"（"+file_info.size+"字节）"
                                            +   " <a name='ack_file"+file_info.msg_id+"'  href='javascript:;'>下载</a>"
                                            +   "<a target='_blank' name='common_link' style='display: none;' href='"+file_info.url+"'>下载</a>"
                                            + "</div>");

            $("[name='ack_file"+file_info.msg_id+"']").mouseover(function(){
                $.ebMsg.fileack(callInfo.chat_id,file_info.msg_id,0,function(param){
                    $("[name='ack_file"+file_info.msg_id+"']").next().show();

                    $("[name='ack_file"+file_info.msg_id+"']").hide();

                },function(state){
                    im_state.state_handler(state);
                })
            });
            $.ebTemp.event.reopen_chat_win();
        }

        /**
         * 处理接收文件事件
         */

        $.ebMsg.eventHandle.onReceivingFile = function(callInfo, from_uid, file_info){

            $.ebTemp.fun.push_info(from_uid, "<div class='eb_info' name='file_reving"+file_info.msg_id+"'>对方发送文件：" + file_info.file +
                                               "<span><a href='javascript:;' style='color: #0075BF;'>&nbsp;接收</a> <a style='color: red;'  href='javascript:;'>&nbsp;拒绝</a></span>"           +
                                             "</div>");

            $("[name='file_reving"+file_info.msg_id+"'] a:eq(0)").click(function(){
                $.ebMsg.fileack(callInfo.chat_id,file_info.msg_id,3,function(param){

                    $("[name='file_reving"+file_info.msg_id+"'] span").html("<span style='color:#b84d20;'>&nbsp;正在接收</span>");
                },function(state){
                    im_state.state_handler(state);
                })
            });
            $("[name='file_reving"+file_info.msg_id+"'] a:eq(1)").click(function(){
                $.ebMsg.fileack(callInfo.chat_id,file_info.msg_id,2,function(param){
                    $("[name='file_reving"+file_info.msg_id+"'] span").html("<span style='color:red;'>&nbsp;已经拒绝</span>");
                },function(state){
                    im_state.state_handler(state);
                })
            });
            $.ebTemp.event.reopen_chat_win();

        }

        //用户在线状态通知事件
        $.ebMsg.eventHandle.onLineStateChange = function(data,type){

            $.eb_organize.reList(data);//组织架构在线状态

            var gid = data.group_id;
            var uid = data.from_uid;
            var account = data.from_account;
            var state = data.line_state;
            var accounts = $("li[state_info][account='"+uid+"'],li[state_info][account='"+account+"']");
            var ul_list = [];
            accounts.each(function(){

                $.im_state.set_state($(this),state);
                var state_info = $(this).attr("account") + "-" + state;
                $(this).attr("state_info",state_info);
                ul_list.push($(this).parent());

            });
            for(var i=0;i<ul_list.length;i++){
                var ul = ul_list[i];
                var lis = ul.find("li[account]");

                var new_lis = lis.toArray().sort(function(a,b){
                    if(a.getAttribute("state_info") && b.getAttribute("state_info")){
                        var state_a = parseInt(a.getAttribute("state_info").split("-")[1]);
                        var state_b = parseInt(b.getAttribute("state_info").split("-")[1]);

                        if(state_a != state_b){
                            return state_b - state_a;
                        }
                        var name_a = $URL.toGBKInt(a.getAttribute("name"));
                        var name_b = $URL.toGBKInt(b.getAttribute("name"));
                        return name_a > name_b ? 1 : -1;
                    }
                    return -1;


                });

                ul.html("");
                $(new_lis).appendTo(ul);
                ul.children("li").each(function(){
                    var uid = $(this).attr("account");
                    var member = $.ebCache.my_group_members[uid];
                    $.ebCache.handler_member();
                    var $g_li = $(this);
                    $g_li.children('img').mouseover(function(){
                        $.ebTemp.temp_init_handler._show_card($g_li, 1, $g_li.attr('account'),member);
                    });
                    $g_li.children('img').mouseleave(function(){
                        $.ebTemp.temps.card.remove();
                    });
                });
                var user_count = $(new_lis).length;

                var online_count = 0;
                for(var p=0;p<new_lis.length;p++){
                    var li = new_lis[p];
                    if($(li).hasClass("online")){
                        online_count++;
                    }
                }
                ul.parent().find("h5 .xxim_nums").html("["+ online_count + "/" + user_count +"]");
            }

        }


        /**
         * 初始化表情
         * @param emotions
         */
        $.ebMsg.eventHandle.onLoadEmotions = function(emotions){

            $.ebCache.emos = emotions;
        }

        /**
         * 会话失效处理
         */

        $.ebMsg.eventHandle.onChatInvalid = function(callInfo){
            var account;
            var type= $.jqEBMessenger.chat_type.single;
            if(callInfo.group_code == '0'){
                var accounts = callInfo.accounts;
                for(var key in accounts){
                    if(key != $.jqEBMessenger.clientInfo.my_uid){
                        account = key;
                    }
                }

            }else{
                var type= $.jqEBMessenger.chat_type.group;
                account = callInfo.group_code;
            }
            var chat_id = callInfo.chat_id;
            var call_str = "";
            $.ebTemp.fun.push_info(account,"<div class='eb_info' recall_account='"+account+"'>当前会话已经失效。" +
                "<button style='color:red;' onclick='$.ebChat.call("+account+","+type+","+chat_id+");'>重新进入</button></div>");
            $.ebCache.recall_cache[account] = callInfo;
            $.ebTemp.event.reopen_chat_win();
        }

        /**
         * 进入会话
         * @param callInfo
         * @param info
         */
        $.ebMsg.eventHandle.onEnterCall = function(callInfo,info){




            $.ebCache.chatid_list.push(callInfo.chat_id);
            var accounts = callInfo.accounts;
            var group_code = callInfo.group_code;//群组ID，0代表一对一对话

            if(group_code == '0'){//一对一会话



                var uid;
                for(var key in accounts){
                    if(key != $.jqEBMessenger.clientInfo.my_uid){
                        uid = key;
                    }

                }
                var recall_info = $.ebCache.recall_cache[uid];
                if(recall_info){
                    $.ebTemp.fun.push_info(uid,"<div class='eb_info'>重新进入会话成功。</div>",function($content){
                        setTimeout(function(){
                            $content.fadeOut();
                        },2000);
                    });
                    $("[recall_account='"+uid+"']").remove();
                    $.ebCache.recall_cache[uid] = null;

                }

                var accountInfo = $.jqEBMessenger.accountInfoMap[uid];


                //$.ebCache.call_time[uid] = new Date();
                $.ebCache.chat_win_cache[uid] = {
                    callInfo:callInfo,
                    accountInfo:accountInfo
                };
                $.ebCache.chat_win_cache[accountInfo.from_account] = {
                    callInfo:callInfo,
                    accountInfo:accountInfo,
                    uid: uid
                };
                var title = accountInfo.fInfo.name.length > 0 ? accountInfo.fInfo.name : accountInfo.from_account;
                if(title.length == 0){
                    title = accountInfo.uid;
                }
                /*五分钟后退出会话*/
                delete $.ebCache.timer_map[uid];
                var win_cache = $.ebCache.chat_win_cache[uid]
                var timer = setTimeout(function(){
                    var chat_id = win_cache.group_code || win_cache.callInfo.chat_id;
                    delete $.ebCache.chat_win_cache[uid];
                    delete $.ebTemp.cache.calling_cache[uid];

                    $.jqEBMessenger.EBCM.ebwebcm_exit(chat_id);
                }, 300000);
                $.ebCache.timer_map[uid] = timer;
                /*五分钟后退出会话*/

                var click_time = $.ebCache.user_clicltime_map[uid];



                    if($.ebCache.user_type == "2"){

                        $.ebTemp.temp_handler.show_chat_win({
                            url : eb_client_config.url,
                            face: eb_client_config.default_header,
                            title: eb_client_config.title,
                            uid:accountInfo.uid,
                            account:accountInfo.from_account,
                            call_id:callInfo.chat_id
                        });

                    }else{

                        if(click_time && new Date().getTime() - click_time < 10000) {
                            $.ebTemp.temp_handler.show_chat_win({
                                url: "javascript:;",
                                face: eb_client_config.default_header,
                                title: title,
                                uid: uid,
                                account: accountInfo.from_account,
                                call_id: callInfo.chat_id
                            });
                            $.ebCache.add_recent_call('1', uid);
                        }
                    }



                    $.ebTemp.fun.show_chat_area(uid);
                    delete $.ebCache.user_clicltime_map[accountInfo.from_account];






            }else{//群组会话


                var group_code = callInfo.group_code;
                var recall_info = $.ebCache.recall_cache[group_code];
                if(recall_info){
                    $.ebTemp.fun.push_info(group_code,"<div class='eb_info'>重新进入会话成功。</div>",function($content){
                        setTimeout(function(){
                            $content.fadeOut();
                        },2000);
                    });

                    $("[recall_account='"+group_code+"']").remove();
                    $.ebCache.recall_cache[group_code] = null;
                }
                var group_info = $.ebCache.get_group(group_code);
                $.ebCache.chat_win_cache[group_code] = group_info;


                /*五分钟后退出会话*/
                delete $.ebCache.timer_map[group_code];
                var win_cache = $.ebCache.chat_win_cache[group_code];
                var timer = setTimeout(function(){

                    delete $.ebCache.chat_win_cache[group_code];
                    delete $.ebTemp.cache.calling_cache[group_code];

                    $.jqEBMessenger.EBCM.ebwebcm_exit(group_code);
                }, 300000);
                $.ebCache.timer_map[group_code] = timer;
                /*五分钟后退出会话*/

                var click_time = $.ebCache.user_clicltime_map[group_code];

                if(click_time && new Date().getTime() - click_time < 10000){
                    $.ebTemp.temp_handler.show_chat_win({
                        url : "javascript:;",
                        face:eb_client_config.default_header,
                        title: group_info.group_name,
                        uid:group_code,
                        account:group_code,
                        call_id:group_code,
                        type:'group'
                    });
                    $.ebCache.add_recent_call('2', group_code);
                    $.ebTemp.fun.show_chat_area(group_code);
                    delete $.ebCache.user_clicltime_map[group_code];

                }

            }

            $.ebTemp.event.reopen_chat_win();

        }

        $.ebMsg.eventHandle.onJsonDataError = function(){
            $.im_state.state_handler({msg: "加载数据失败，请重新登录!"});
        }

        $.ebMsg.eventHandle.onDisconnect = function(){
            window.onbeforeunload = undefined;
            var exit_url = $.ebMsg.options.WEBIM_URL + "/client.html";
            setTimeout(function(){
                window.location.href = exit_url;
            },10000);
            layer.alert("登陆状态已失效，请重新登陆!",function(){
                window.location.href = exit_url;
            });
        }

    })(window, jQuery);


    //个人设置模块
    (function (window, $) {
        $.extend({ebSetup:{
            init: function(){

                var accountTmp = [
                    '<table id="account_table"  style="font-size: 12px;width: 80%;margin-left: 10%;margin-top: 20px;" cellspacing="10px;">',
                        '<tr>',
                            '<td>账号</td>',
                            '<td><input name="account" readonly="readonly" /></td>',
                            '<td>名称</td>',
                            '<td><input name="username" /></td>',
                        '</tr>',
                        '<tr>',
                            '<td>性别</td>',
                            '<td><select name="gender" ><option value="0"></option><option value="2">男</option><option value="3">女</option></select></td>',
                            '<td>生日</td>',
                            '<td><input name="birthday" placeholder="格式:19870213" /></td>',
                        '</tr>',
                        '<tr>',
                            '<td>手机</td>',
                            '<td><input name="mobile" /></td>',
                            '<td>电话</td>',
                            '<td><input name="tel" /></td>',
                        '</tr>',
                        '<tr>',
                            '<td>邮箱</td>',
                            '<td><input name="email"  /></td>',
                            '<td>主页</td>',
                            '<td><input name="url" /></td>',
                        '</tr>',

                        '<tr>',
                            '<td>地址</td>',
                            '<td><input name="add" /></td>',
                            '<td>邮编</td>',
                            '<td><input name="zipcode" /></td>',
                        '</tr>',
                        '<tr>',
                            '<td>备注</td>',
                            '<td colspan="3"><textarea name="desc" style="resize: none;"  cols="30" rows="5"></textarea></td>',

                        '</tr>',
                        '<tr>',
                            '<td> </td>',
                            '<td></td>',
                            '<td></td>',
                            '<td><input   type="button" value="保存" /> </td>',

                        '</tr>',
                    '</table>'
                ].join('');
                var resetpwdTmp = [
                    '<table id="resetpwd_table" style="font-size: 12px;width: 80%;margin-left: 10%;margin-top: 30px;" cellspacing="30px;">',
                        '<tr>',
                            '<td>当前密码</td>',
                            '<td><input name="currentPwd"  type="password"/></td>',

                        '</tr>',
                        '<tr>',
                            '<td>新密码</td>',
                            '<td><input name="newPass" type="password"/></td>',

                        '</tr>',
                        '<tr>',
                            '<td>确认密码</td>',
                            '<td><input name="repeatPass" type="password" /></td>',

                        '</tr>',
                        '<tr>',
                            '<td></td>',
                            '<td><input type="button" value="保存"   /></td>',

                        '</tr>',
                    '</table>'
                ].join('');
                layer.tab({
                    area: ['600px', '400px'],
                    data: [
                        {title: '账号信息', content:accountTmp},
                        {title: '修改密码', content:resetpwdTmp}
                    ]
                });
                var myInfo = $.jqEBMessenger.clientInfo;
                $("#account_table [name='account']").val(myInfo.my_account);
                $("#account_table [name='username']").val(myInfo.username);
                $("#account_table [name='gender']").val(myInfo.gender);
                $("#account_table [name='birthday']").val(myInfo.birthday);
                $("#account_table [name='mobile']").val(myInfo.mobile);
                $("#account_table [name='tel']").val(myInfo.tel);
                $("#account_table [name='email']").val(myInfo.email);
                $("#account_table [name='url']").val(myInfo.user_url);
                $("#account_table [name='add']").val(myInfo.add);
                $("#account_table [name='zipcode']").val(myInfo.zipcode);

                $("#account_table [name='desc']").val(myInfo.description);


                $("#account_table :input").css("width","95%");
                $("#account_table :input").css("height","30px");
                $("#account_table textarea").css("width","99%");
                $("#account_table textarea").css("height","40px");
                $("#account_table :button").css("width","50%");
                $("#account_table :button").css("float","right");



                $("#account_table :button").click(function(){

                    var params = {
                        user_name: $("#account_table [name='username']").val(),
                        desc:$("#account_table [name='desc']").val(),
                        add: $("#account_table [name='add']").val(),
                        url: $("#account_table [name='url']").val(),
                        gender: $("#account_table [name='gender']").val(),
                        tel: $("#account_table [name='tel']").val(),
                        mobile: $("#account_table [name='mobile']").val(),
                        email: $("#account_table [name='email']").val(),
                        birthday: $("#account_table [name='birthday']").val(),
                        zipcode: $("#account_table [name='zipcode']").val()

                    };

                    $.ebMsg.sinfo(params,function(data){
                        var code = data.code;
                        if(code == "0"){
                            alert("个人资料修改成功!");
                            myInfo.username = params.user_name;
                            myInfo.description = params.desc;
                            myInfo.add = params.add;
                            myInfo.user_url = params.url;
                            myInfo.gender = params.gender;
                            myInfo.tel = params.tel;
                            myInfo.mobile = params.mobile;
                            myInfo.email = params.email;
                            myInfo.birthday = params.birthday;
                            myInfo.zipcode = params.zipcode;
                        }else{
                            alert("个人资料修改失败: " + data.error);
                        }

                    },function(error){
                        $.im_state.state_handler(error);
                    })
                });
                $("#resetpwd_table :password").css("width","98%");
                $("#resetpwd_table :password").css("height","30px");
                $("#resetpwd_table :button").css("width","30%");
                $("#resetpwd_table :button").css("float","right");
                $("#resetpwd_table :button").css("height","30px");



                $("#resetpwd_table :button").click(function(){
                    var uid = $.jqEBMessenger.clientInfo.my_uid;
                    var cur_pwd = $.trim($("#resetpwd_table [name='currentPwd']").val());
                    var new_pwd = $.trim($("#resetpwd_table [name='newPass']").val());
                    var repeat_pwd = $.trim($("#resetpwd_table [name='repeatPass']").val());

                    if(cur_pwd.length == 0){
                        alert("请输入现在的密码");
                        return;
                    }
                    if(new_pwd.length == 0){
                        alert("请输入新密码");
                        return;
                    }
                    if(repeat_pwd.length == 0){
                        alert("请再输入一次密码");
                        return;
                    }
                    if(new_pwd != repeat_pwd){
                        alert("新密码不一致，请重新输入");
                        return;
                    }
                    cur_pwd = $.md5(uid + "" + cur_pwd).toLowerCase();
                    new_pwd = $.md5(uid + "" + new_pwd).toLowerCase();
                    var params = {
                        old_pwd: cur_pwd,
                        passwd: new_pwd

                    };
                    $.ebMsg.sinfo(params,function(data){
                        if(data.code == "0"){
                            alert("修改成功!");
                        }else{
                            alert("修改失败: " + data.error);
                        }
                        $("#resetpwd_table :password").val("");

                    },function(error){
                        $.im_state.state_handler(error);
                    })
                });

            }
        }});
    })(window, jQuery);



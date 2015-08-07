//恩布在线客服访问域名
var webimUrl="http://192.168.1.123/webim";


var getEBArgs=(function() {
    var sc=document.getElementsByTagName('script');
    var paramsArr=sc[sc.length-1].src.split('?')[1].split('&');
    var args={}, param, name, value;
    for(var i=0,len=paramsArr.length; i<len; i++) {
            param=paramsArr[i].split('=');
            name=param[0],value=param[1];
            if(typeof args[name]=="undefined") { //参数尚不存在 
                args[name]=value;
            } else if (typeof args[name]=="string") { //参数已经存在则保存为数组
                args[name]=[args[name]];
                args[name].push(value);
            } else { //已经是数组的
                args[name].push(value);
            }
    }
    return function(){return args;}; //以json格式返回获取的所有参数
})();

var eb_to_account =getEBArgs()["to_account"];

function openEB900Win(url) {
	var randomnumber=Math.floor(Math.random()*1000);
	window.open (url, ""+randomnumber, 'width=852,height=620,top=50,left=200,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
}

function openEBHOMEWin() {
	window.open ("http://www.entboost.com","恩布官方网站","width=1366,height=768,top=0,left=0,toolbar=yes,menubar=yes,scrollbars=yes, resizable=yes,location=yes, status=yes");
}

document.writeln('<link href="' + webimUrl + '/css/support_list.css" rel="stylesheet" type="text/css" />');

document.writeln('<div class="sp-container ie6fixedBR" id="eb900div">');
document.writeln('	<div class="sp-head"></div>');
document.writeln('	<div class="sp-body">');
document.writeln('		<div class="sp-close" onclick="this.parentNode.parentNode.style.display=\'none\';"></div>');
document.writeln('		<div class="sp-row">');
if( navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/) ) {
	document.writeln('      	<img onclick="openEBHOMEWin()" class="sp-logo" src="' + webimUrl + '/images2/s-logo.gif"/>');
} else {
	document.writeln('      	<img onclick="openEBHOMEWin()" class="sp-logo" src="' + webimUrl + '/images2/logo.gif"/>');
}
document.writeln('      	<div class="sp-title1 yahei"><span>恩布在线客服</span></div>');
document.writeln('		</div>');
document.writeln(' 		<div class="sp-btn yahei" onclick ="window.open(\'' + webimUrl + '/client.html?v=1&to_account=' + eb_to_account +'\');"><span>在线咨询</span></div>');
document.writeln('		<div class="sp-tel yahei"><span>客服&nbsp;400-840-1180</span></div>');
document.writeln('	</div>');
document.writeln('</div>');

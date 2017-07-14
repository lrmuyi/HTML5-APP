//打开新页面函数：url, id, top, bottom, aniShow, duration, extras
//打开网址，ID，上边距，下边距，打开方式，速度，传值（json）
function openPage(url, id, top, bottom, aniShow, duration, extras) {
	if(aniShow == null){
		aniShow = 'pop-in';
	}
	if(duration == null){
		duration == 200;
	}
	return mui.openWindow({
		url: url, //需要打开页面的url地址 
		id: id, //需要打开页面的url页面id
		styles: {
			top: top, //新页面顶部位置 
			bottom: bottom, //新页面底部位置 
			//                  width:newpage-width,//新页面宽度，默认为100% 
			//                  height:newpage-height,//新页面高度，默认为100% ...... 
		},
		extras: extras,
		show: { //控制打开页面的类型
			autoShow: true,
			//                  //页面loaded事件发生后自动显示，默认为true 
			aniShow: aniShow, //页面显示动画，默认为”slide-in-right“；  页面出现的方式 左右上下zoom-fade-out
			duration: duration //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒； 
		},
		waiting: { // 控制 弹出转圈框的信息
			autoShow: false, //自动显示等待框，默认为true 
			title: '正在加载', //等待对话框上显示的提示内容 
			options: {
				width: '150px', //等待框背景区域宽度，默认根据内容自动计算合适宽度 
				height: '150px', //等待框背景区域高度，默认根据内容自动计算合适高度 ...... 
			}
		}
	});
}

function doMove(obj,attr,min,max,speed,time,callback){
	var begin = parseFloat(getStyle(obj,attr));

	var iTimer = null;
	if(max <= begin){
		var speed = -speed;
	}else{
		var speed = speed;
	}
	clearInterval(iTimer);
	iTimer = setInterval(function(){
		var step = parseInt(getStyle(obj,attr));
		if(step+speed > max && speed > 0){
			step = max-speed;
			clearInterval(iTimer);
			callback&&callback(obj);
		}
		if(step+speed < min && speed < 0){
			step = min-speed;
			clearInterval(iTimer);
			callback&&callback(obj);
		}
		obj.style[attr] = (step + speed) + 'px';
	},time);
	
}

function doOpac(obj,start,end,step,time,callback){
	clearInterval(obj.opa);
	var op = start;
	if(start<end){
		step = -step;
	}
	obj.opa = setInterval(function(){
		op = op-step;
		
		if(op<=end&&step>0){
			op = end;
			clearInterval(obj.opa);
			//回调函数放在清除定时器下面，不然会造成回调函数时定时器仍在运行，导致无法赋值。
			callback&&callback(obj);
		}
		if(op>end&&step<0){
			op = end;
			clearInterval(obj.opa);
			callback&&callback(obj);
		}
		obj.style.opacity=op;
	},time);
}

function getStyle ( obj, attr ) { 
	if(obj.style[attr]){
		return obj.style[attr];
	}
	return obj.currentStyle?obj.currentStyle[attr] : getComputedStyle( obj )[attr]; 
}

function getTop(obj) {
    var iTop = 0;
    while(obj) {
      iTop += obj.offsetTop;
      obj = obj.offsetParent;
    }
    return iTop;
}

function getLeft(obj){
	var l=obj.offsetLeft; 
	while(obj.offsetParent != null){
		obj = obj.offsetParent;   
		l += obj.offsetLeft;   
    }
	return l;
} 

function checkLogin(goReg){
	var uname = localStorage.getItem('username');
	var uphone = localStorage.getItem('phone');
	var imei = localStorage.getItem('imei');
	var pass = localStorage.getItem('password');
	if(uname&&uphone&&pass&&imei){
		localStorage.setItem('login',1);
	}else{
		localStorage.setItem('login',0);
		if(!!goReg){
			mui.toast('请注册后再试，若已有账号请登录');
  			openPage('_www/public/register.html','register');
		}
		return false;
	}
	
	if(imei != localStorage.getItem('imei0')&&plus.device.imei == localStorage.getItem('imei0')){
		localStorage.setItem('login',-1);
		localStorage.removeItem('username');
		localStorage.removeItem('password');
		localStorage.removeItem('imei');
		mui.confirm('您的账号在其他设备登录','警告',['重新登录','取消'],function(e){
			if(e.index==0){
		        openPage('_www/public/login.html','login');                  
		    }else{
		        openPage('_www/my-nav.html');
		    }
		});
		return false;
	}
}

function loggedFire(){
	var bottomNavi = plus.webview.getWebviewById('HBuilder'); 
	var myHome = plus.webview.getWebviewById('myHome');
	var myHomeNav = plus.webview.getWebviewById('my-nav.html');
	var msgLobby = plus.webview.getWebviewById('msgLobby.html');
	//登录成功后通知所有已开页面填数据：
	mui.fire(bottomNavi,'onload');
	mui.fire(myHome,'onload');
	mui.fire(myHomeNav,'onload');
	mui.fire(msgLobby,'onload');
}
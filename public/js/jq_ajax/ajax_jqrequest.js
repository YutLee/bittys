/**
*@function:ajax 请求处理
*@author:tiger
*@copyright:ActiveNet Logics IT Co.,Ltd.
*@date:2009-07-15
*@params:reqUrl请求页面url,reqParams 请求参数,callFunction 回调方法
*        reqType 请求方法(POST(默认),GET), reqDataType 请求时所返回的数据类型(xml,script,json[默认],html)
*        queryImg 请求时要显示的图片，queryBut请求时要禁止的按钮，
*        param_enctype 发送内容的类型(application/x-www-form-urlencoded[默认], multipart/form-data,text/plain)，
*        param_timeout超时时间，param_async是否同步，param_cache是否缓存
*@example: reqAjax("friendslistAction.php","reqAct=getonlineusers_bypage",callback_getUserListToGroup);
**/
/*请求方法*/
function reqAjax(reqUrl,reqParams,callFunction,reqType,reqDataType,queryImg,queryBut,param_enctype,param_timeout,param_async,param_cache){
	if(typeof(reqParams)!="string"){
		reqParams=""
	};
	if(typeof(reqDataType)=="undefined"){
		reqDataType="json"
	};
	if(typeof(reqType)=="undefined"||reqType==""){
		reqType="POST"
	};
	if(typeof(param_enctype)=="undefined"||param_enctype==""||param_enctype==null){
		param_enctype="application/x-www-form-urlencoded"
	};
	if(typeof(param_timeout)=="undefined"||param_timeout==""){
		param_timeout=null
	};
	if(typeof(param_async)!="undefined"&&param_async!=""){
		$.ajaxSetup({
		"async":param_async
		})
	};
	if(typeof(param_cache)!="undefined"&&param_cache!=""){
		$.ajaxSetup({
		"cache":param_cache
		})
	};
	if(typeof(queryImg)=="string"){
		queryImg=$("#"+queryImg)
	};
	if(typeof(queryBut)=="string"){
		queryBut=$("#"+queryBut)
	};
	$.ajax({
	"type":reqType,"url":reqUrl,"timeout":param_timeout,"contentType":param_enctype,"dataType":reqDataType,"data":reqParams,"beforeSend":function(XMLHttpRequest){
		if(queryImg!=null&&typeof(queryImg)=="object"){
			queryImg.show()
		};
		if(queryBut!=null&&typeof(queryBut)=="object"){
			$(queryBut).attr("disabled","disabled");	
		}
	}
	,"success":function(msg,textStatus){
		if(typeof(callFunction)=="string"){
			eval(callFunction+"('"+msg+"')")
		}else if(typeof(callFunction)=="function"){
			callFunction.call(callFunction,msg)
		}
	}
	,"complete":function(XMLHttpRequest,textStatus){
		if(queryImg!=null&&typeof(queryImg)=="object"){
			queryImg.hide()
		};
		if(queryBut!=null&&typeof(queryBut)=="object"){
			$(queryBut).removeAttr("disabled");
		}
	}
	,"error":function(XMLHttpRequest,textStatus,errorThrown){if(textStatus=='abort'){return;}
		try{
			errorThrown=XMLHttpRequest.responseText;
		}catch(e){
			errorThrown="requset parse error！"
		}
		if(typeof(errorThrown)=="undefined"||$.trim(errorThrown)==""){
			errorThrown=textStatus
		};
		var json_msg;
		if(reqDataType=="json"){
			errorThrown=escape(errorThrown.toString());
			json_msg=eval("({error:\""+errorThrown+"\"})")
		}else{
			json_msg=errorThrown
		};
		if(typeof(callFunction)=="string"){
			eval(callFunction+"('"+json_msg+"')")
		}
		else if(typeof(callFunction)=="function"){
			callFunction.call(callFunction,json_msg)
		}
	}
	})
}


//表单提交(frm_id 表单id, url 提交的页面,sbut_id提交按钮id)
function submitAjax_form(frm_id,url,sbut_id){
	$("form").submit(function () { return false; });
	if(typeof(frm_id)=="undefined" || $.trim(frm_id)==""){ return false;}
	if(typeof(url)=="undefined" || $.trim(url)==""){
		url= $("#"+frm_id).attr("action") || window.location.toString();
	}
	var reqType= $("#"+frm_id).attr("method") || "GET";
	var params = $("#"+frm_id).serialize();//form序列化
	submitAjax(url,params,sbut_id,reqType);
}
//表单提交(url 提交的页面,params参数[例：'type=1&name=2'],sbut_id提交按钮id,reqType提交方式，默认POST方式)
function submitAjax(url,params,sbut_id,reqType){
	if(typeof(url)=="undefined" || $.trim(url)==""){tt.warningTip('无效URL!');return false;}
	if(typeof(params)=="undefined" || $.trim(params)==""){tt.warningTip('缺少参数!');return false;}
	if(typeof(reqType)=="undefined" || $.trim(reqType)==""){reqType="POST";}
	if(typeof(sbut_id)=="undefined"){sbut_id=null;}//showJS_LoadTips('正在提交数据');
	reqAjax(url,params,function(data){
		if(typeof(data.error) != 'undefined' && $.trim(data.error) != ''){
		    HandleError(data.error);
			return false;
		}
		if(typeof(data.info)!="undefined" && $.trim(data.info)!=""){
			tt.warningTip(data.info);
		}
		if(typeof(data.redirect_url)!="undefined" && $.trim(data.redirect_url)!=""){
			$('.close').click();
			window.location =data.redirect_url;
		}
		if(typeof(data.is_refresh)!="undefined" && $.trim(data.is_refresh)!=""){
			$('.close').click();
			$(window).hashchange();
		}
	},reqType,"json",null,sbut_id);
}
//处理错误
function HandleError(error){
    //hideJS_LoadTips();
    error=unescape(error);
	if($.trim(error)=="timeout"){
		tt.warningTip("亲,网络太慢啦,请您检查网络！");
		return false;
	}else if($.trim(error)=="error"){
		tt.warningTip('您的设备没有接通网络,请您设置接通后,再继续操作！');
		return false;
	}
	tt.warningTip(error);
	return false;
}
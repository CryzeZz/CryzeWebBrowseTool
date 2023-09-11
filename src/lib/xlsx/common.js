/*
* @Author cryze 
* @Date 2018-4-20
* @Desc 统一用户平台 封装的一些公共js  在其他界面或许也可以用到
* @Modified 2018-5-4
*/
var common={};
String.prototype.escapeJquery=function() {

    // 转义之后的结果
    var escapseResult = this;

    // javascript正则表达式中的特殊字符
    var jsSpecialChars = ["\\", "^", "$", "*", "?", ".", "+", "(", ")", "[",
        "]", "|", "{", "}"
    ];

    // jquery中的特殊字符,不是正则表达式中的特殊字符
    var jquerySpecialChars = ["~", "`", "@", "#", "%", "&", "=", "'", "\"",
        ":", ";", "<", ">", ",", "/"
    ];

    for (var i = 0; i < jsSpecialChars.length; i++) {
        escapseResult = escapseResult.replace(new RegExp("\\" +
                jsSpecialChars[i], "g"), "\\" +
            jsSpecialChars[i]);
    }

    for (var i = 0; i < jquerySpecialChars.length; i++) {
        escapseResult = escapseResult.replace(new RegExp(jquerySpecialChars[i],
            "g"), "\\" + jquerySpecialChars[i]);
    }

    return escapseResult;
}
common.getData=function(arr,prefix){
	var data={};
	for(var i=0,len=arr.length;i<len;i++){
		var item=arr[i];
		if (typeof item=="string"){
			var key=item.substring((typeof prefix =="string"?prefix.length:0));
			var $JO=$('#'+item.escapeJquery());
			if ($JO.length>0 ) data[key]=$.trim($JO.val());
		}else if(typeof item=="object"){
			var $JO=$('#'+item.id.escapeJquery());
			if (item.type && item.type=="radio"){ //radio 不指定id 为name
				var $JO=$("input[name='"+item.id+"']:checked");
			}
			if ($JO.length==0 ) continue;
			var val="";
			if (item.type ){
				if ($.fn[item.type]){
					if(item.type=="radio"){
						val=$JO.val();
					}else if(item.type=="checkbox" ||item.type=="switchbox" ){
						val=$JO[item.type]('getValue')?1:0;
					}else{
						if (item.multiple){
							val=$JO[item.type]('getValues').join(',');
						}else{
							val=$JO[item.type]('getValue');
						}
					}
					
				}else{
					val=$.trim( $JO.val() );
				}
			}else{
				val=$.trim( $JO.val() );
			}
			if (item.fn) val=item.fn(val);
			var key=item.id.substring((typeof prefix =="string"?prefix.length:0));
			data[key]=val;
		}
	}
	return data;
}
//prefix前缀名 页面html元素id 相对于data的属性多出的前缀   如页面元素TId  data.Id  前缀为T
common.setData=function(arr,prefix,data){
	var tempObj={};
	for(var i=0,len=arr.length;i<len;i++){
		var item=arr[i];
		if (typeof item=="string"){
			var key=item.substring((typeof prefix =="string"?prefix.length:0));
			var $JO=$('#'+item.escapeJquery());
			if ($JO.length>0 ) $JO.val(data[key]||"");
		}else if(typeof item=="object"){
			var key=item.id.substring((typeof prefix =="string"?prefix.length:0));
			var $JO=$('#'+item.id.escapeJquery());
			if (item.type && item.type=="radio"){ //radio 不指定id 为name
				var $JO=$("input[name='"+item.id+"'][value='"+data[key]+"']");
			}
			if ($JO.length==0 ) continue;
			var val="";

			if (item.type ){
				if ($.fn[item.type]){
					if(item.type=="radio"){
						val=$JO.radio('check');
					}else if(item.type=="checkbox" ||item.type=="switchbox" ){
						val=$JO[item.type]('setValue' ,data[key]==1)
					}else{
						if (item.multiple){
							$JO[item.type]('setValues',(data[key]||"").split(','));
						}else{
							if (item.type=="combogrid"&&item.text) {  //combogrid 特殊处理 
								tempObj[item.id]={
									onLoadSuccess:$JO.combogrid('options').onLoadSuccess,
									value:data[key]
								}
								$JO.combogrid('options').onLoadSuccess=function(){
									var thisId=$(this).attr('id');
									$(this).combogrid('setValue',tempObj[thisId].value);
									tempObj[thisId].onLoadSuccess.apply(this,arguments);
									$(this).combogrid('options').onLoadSuccess=tempObj[thisId].onLoadSuccess;
									//debugger;
								}
								var textkey=item.text.substring((typeof prefix =="string"?prefix.length:0));
								$JO.combogrid('options').keyHandler.query.call($JO[0],data[textkey]);
								//$JO.combogrid('grid').datagrid('reload',{'q':data[textkey]});
								if ($JO.combogrid('options').lazy){  //lazy的 将queryOnFirstArrowDown置为false 不要在第一次点击下拉时再查询
									$JO.combo('options').queryOnFirstArrowDown=false; 
								}
								
								
							}else{
								$JO[item.type]('setValue',data[key]||data[key]||"");
							}
						}
						
					}
					
				}else{
					$JO.val(data[key]||"");
				}
			}else{
				$JO.val(data[key]||"") ;
			}
		}
	}
}
///把原setDataByRow改为调用common.setData
common.setDataByRow=function(arr,row){
	if (arguments.length==2) common.setData(arr,"",row);
	if (arguments.length==3) common.setData(arguments[0],arguments[1],arguments[2]);
}
common.clearData=function(arr){
	for(var i=0,len=arr.length;i<len;i++){
		var item=arr[i];
		if (typeof item=="string"){
			var $JO=$('#'+item.escapeJquery());	
			if ($JO.length>0 ) $JO.val('');
		}else if(typeof item=="object"){
			var $JO=$('#'+item.id.escapeJquery());
			if (item.type && item.type=="radio"){ //radio 不指定id 为name
				var $JO=$("input[name='"+item.id+"']:checked");
			}
			if ($JO.length==0 ) continue;
			if (item.type ){
				if ($.fn[item.type]) {
					if(item.type=="radio"){
						$JO.radio('uncheck');
					}else if(item.type=="checkbox" || item.type=="switchbox"){
						$JO[item.type]('setValue',true);
					}else{
						$JO[item.type]('setValue',"");
					}
					
				}else{
					$JO.val("");
				}
			}else{
				$JO.val("");
			}
			
		}
	}
}
common.disable=function(arr,except){
	for(var i=0,len=arr.length;i<len;i++){
		var item=arr[i];
		if (typeof item=="string"){
			var $JO=$('#'+item.escapeJquery());	
			if (except && except.indexOf(item)>-1) continue;
			if ($JO.length>0 ) $JO.attr('disabled','disabled');
		}else if(typeof item=="object"){
			var $JO=$('#'+item.id.escapeJquery());
			if (item.type && item.type=="radio"){ //radio 不指定id 为name
				var $JO=$("input[name='"+item.id+"']");
			}
			if ($JO.length==0 ) continue;
			if (except && except.indexOf(item.id)>-1) continue;
			if (item.type ){
				if ($.fn[item.type]) {
					$JO[item.type]('disable');
				}else{
					$JO.attr('disabled','disabled');
				}
			}else{
				$JO.attr('disabled','disabled');
			}
			
		}
	}
}
common.enable=function(arr,except){
	for(var i=0,len=arr.length;i<len;i++){
		var item=arr[i];
		if (typeof item=="string"){
			var $JO=$('#'+item.escapeJquery());		
			if (except && except.indexOf(item)>-1) continue;
			if ($JO.length>0 ) $JO.removeAttr('disabled');
		}else if(typeof item=="object"){
			var $JO=$('#'+item.id.escapeJquery());
			if (item.type && item.type=="radio"){ //radio 不指定id 为name
				var $JO=$("input[name='"+item.id+"']");
			}
			if ($JO.length==0 ) continue;
			if (except && except.indexOf(item.id)>-1) continue;
			if (item.type ){
				if ($.fn[item.type]) {
					$JO[item.type]('enable');
				}else{
					$JO.removeAttr('disabled');
				}
			}else{
				$JO.removeAttr('disabled');
			}
			
		}
	}
}

///files 文件列表对象
///多个文件会有多次回调
///cfg {allSheet:true , callbackOnce:true} //allSheet 读取所有sheet,默认只读第一个  callbackOnce是否一起回调 默认一个文件读取完成回调一个
///fn 回调函数 经测试 读取好像是异步的
///fn (json){} name 文件名 json {"文件名":[[{},{},{}],[{},{},{}],[{},{},{}]], "文件名":[[{},{},{}],[{},{},{}],[{},{},{}]]} //每个sheet返回一个数组 多个sheet的数组在放到同一数组
///bug 日期格式转的不对 表格中是1940-4-1 转出来是4/1/49  
//方案1 自己对转出的4/1/49日期再进行处理（49只能自己判断是1949还是2049了） 
// 方案2 可将xlsx.core中 e[14] = "m/d/yy"; 改为 e[14] = "YYYY-MM-DD"; （有没有其他影响不清楚） 
common.transExcelData=function(files,cfg,fn){
	var wb,rABS = false;
	if (typeof cfg=="function") {
		fn=cfg;
		cfg={}
	}
	cfg = cfg || {};
	function setup_reader(file) {
	 var filename = file.name;
	 var reader = new FileReader();
	 ///因为IE浏览器不识别readAsBinaryString函数，所以重新书写readAsBinaryString函数
	 if (!FileReader.prototype.readAsBinaryString) {
	     FileReader.prototype.readAsBinaryString = function (f) {
	         var binary = "";
	         var pt = this;
	         var reader = new FileReader();
	         reader.onload = function (e) {
	             var bytes = new Uint8Array(reader.result);
	             var length = bytes.byteLength;
	             for (var i = 0; i < length; i++) {
	                 binary += String.fromCharCode(bytes[i]);
	             }
	             pt.content = binary;
	             $(pt).trigger('onload');
	         };
	         reader.readAsArrayBuffer(f);
	     }
	 }

	 reader.onload = function (e) {
	     //alert("onload");
	     if (reader.result) reader.content = reader.result;
	     data = reader.content;
	     if (rABS) {
	         wb = XLSX.read(btoa(fixdata(data)), { //手动转化
	             type: 'base64'
	         });
	     } else {
	         wb = XLSX.read(data, {
	             type: 'binary'
	         });
	     }
	     var sheetArr=[];
	     if (cfg.allSheet){
		     for (var j=0,len=wb.SheetNames.length;j<len;j++){
			     var sheetItem=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[j]]);
			     sheetArr.push(sheetItem);
			 }
		 }else{
			 var sheetItem=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
			 sheetArr.push(sheetItem);
		 }
		 if (cfg.callbackOnce){
			 AllJson[filename]=sheetArr;
			 completedCount++;
			 if (length==completedCount && typeof fn=="function") fn(AllJson);
		 }else{
			 if (typeof fn=="function"){
				 var json={};
				 json[filename]=sheetArr;
				 fn(json);
			 }
		 }

	    
	 };

	 if (rABS) {
	     reader.readAsArrayBuffer(file);
	 } else {
	     reader.readAsBinaryString(file);
	 }

	 function fixdata(data) { //文件流转BinaryString
	     var o = "",
	         l = 0,
	         w = 10240;
	     for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
	     o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
	     return o;
	 }
	}
	var AllJson={};
	var length=files.length,completedCount=0
	for(var i=0;i<length;i++){
		setup_reader(files[i]);
	}
}

common.isIE=function() { //ie?
	if (!!window.ActiveXObject || "ActiveXObject" in window)
		return true;
	else
		return false;
}
//2018-4-23 注释掉  使用新增的common.exportExcelByXLSX导出
///json to table
///location.href=rtn //下载下来
/////2018-4-23 表头单元格不再使用th
/* 
common.exportExcel=(function(){
	var getTHead=function(columns,showHidden){
	    var thead="<thead>"
	    for (var i = 0; i < columns.length; i++) {
	        var tr = "<tr>";
	        var cols = columns[i];
	        for (var j = 0; j < cols.length; j++) {
	            var col = cols[j];
	            var attr = "";
	            if (col.rowspan) {
	                attr += "rowspan=\"" + col.rowspan + "\" ";
	            }
	            if (col.colspan) {
	                attr += "colspan=\"" + col.colspan + "\" ";
	            }
	    
	            if ((col.hidden && !showHidden)|| !col.field) {
	                continue;
	            }else{
	                //var th = "<th " + attr + ">"+ (col.title||col.field) + "</th>";  //2018-4-23 表头单元格不再使用th
	                var th = "<td " + attr + ">"+ (col.title||col.field) + "</td>";
	                tr+=th;
	            }
	        }
	        tr+="</tr>";
	        thead+=tr;
	    }
	    thead+="</thead>";
	    return thead;
	}
	//ind 表示行索引 实际无所谓 不过为了formatter 加个吧  formatter若是return html未必好用
	var getTr=function(row,columns,ind,showHidden){
	    var tr="<tr>"
	    for (var i = 0; i < columns.length; i++) {
	        var cols = columns[i];
	        for (var j = 0; j < cols.length; j++) {
	            var col = cols[j];
	            var attr = "";
	            if (col.rowspan) {
	                attr += "rowspan=\"" + col.rowspan + "\" ";
	            }
	            if (col.colspan) {
	                attr += "colspan=\"" + col.colspan + "\" ";
	            }
	    
	            if ((col.hidden && ! showHidden )|| !col.field) {
	                continue;
	            }else{
	                if (typeof col.formatter=="function"){
	                    var content= col.formatter(row[col.field]||"",row,ind);
	                    var td = "<td " + attr + ">"+ content + "</td>";
	                }else{
	                    var td = "<td " + attr + ">"+ (row[col.field]||"") + "</td>";
	                }
	                tr+=td;
	            }
	        }
	    }
	    tr+="</tr>";
	    return tr;
	};
	var rows2Table=function(json,columns,showHidden){
		
	    var tbody="<tbody>"
	    for(var i=0,len=json.length;i<len;i++){
	        var row=json[i];
	        tbody+=getTr(row,columns,i,showHidden);
	    }
	    tbody+="</tbody>";
	    return getTHead(columns,showHidden)+tbody;
	};
	var uri = 'data:application/vnd.ms-excel;base64,',
	///防止乱码问题 meta书写utf-8
	template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
	base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
	format = function(s, c) {
	    return s.replace(/{(\w+)}/g,
	    function(m, p) { return c[p]; }) 
	};
	return function(rows, columns,cfg) {
		cfg=cfg||{};
		cfg.sheetname=cfg.sheetname || "sheet1";
		cfg.showHidden=!!cfg.showHidden;
		var html=rows2Table(rows,columns,cfg.showHidden);
		var ctx = {worksheet: cfg.sheetname || 'Worksheet', table: html}
		return uri + base64(format(template, ctx))
	}
})();*/
//指定文件名称 
//调用了common.exportExcel
//bug 此导出的表格打开后会有 文件名和扩展名不匹配 因为实际是html   而且若用common.transExcelData 解析表头也会有些问题
//    打开此文件，另存可以解决
//bug 0001 会变成1
// columns 取hisui-datagrid columns 
// cfg {sheetname:"sheet1",filename:"导出表",showHidden:false}  sheetname-sheet名字 filename-表格文件名  showHidden 是否显示隐藏列
//2018-4-23 使用新增的common.exportExcelWithName导出
/*
common.exportExcelWithName=function(rows, columns,cfg){
		cfg=cfg||{};
		cfg.sheetname=cfg.sheetname || "sheet1";
		cfg.filename=cfg.filename || "导出表";
		cfg.showHidden=!!cfg.showHidden;
		var filename=cfg.filename;
	
	function dataURLtoBlob(dataurl) {
	    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
	        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	    while(n--){
	        u8arr[n] = bstr.charCodeAt(n);
	    }
	    return new Blob([u8arr], {type:mime});
	}
	
	if (!common.isIE()){
		var url=common.exportExcel(rows,columns,cfg);
		//生成的url特别长... 直接下载下载不了 先转成Blob对象 在转成url 再下载
		var blob=dataURLtoBlob(url);
		var url=URL.createObjectURL(blob);
		var a = document.createElement("a");
		a.innerHTML="下载";
		a.download=filename;
		a.href=url;
		a.style.display="none";
		document.body.appendChild(a);
		a.click();
	}else{
		var url=common.exportExcel(rows,columns,cfg);
		var blob=dataURLtoBlob(url);
		window.navigator.msSaveBlob(blob, filename+".xls");  
		
	}
}*/
///2018-4-23 add 
///参照xlsx github
///引入 Blob.js FileSaver.js
// columns 取hisui-datagrid columns 
// cfg {sheetname:"sheet1",filename:"导出表",showHidden:false}  sheetname-sheet名字 filename-表格文件名  showHidden 是否显示隐藏列
common.exportExcelByXLSX=(function(){
	
	function transrow(row,columns,ind,showHidden){
		var newrow={};
	    for (var i = 0; i < columns.length; i++) {
	        var cols = columns[i];
	        for (var j = 0; j < cols.length; j++) {
	            var col = cols[j];
	    		console.info('col',col);
	            if ((col.hidden && ! showHidden )|| !col.field) {
	                continue;
	            }else{
		            var key=col.title||col.field;
	                if (typeof col.formatter=="function"){
						var content= col.formatter(row[col.field]||"",row,ind);
						newrow[key]=content;
	                }else{
	                    newrow[key]=row[col.field]||"";
	                }
	            }
	        }
	    }
	    return newrow;
	}
	return function(rows, columns,cfg){
		cfg=cfg||{};
		cfg.sheetname=cfg.sheetname || "sheet1";
		cfg.filename=cfg.filename || "导出表";
		cfg.showHidden=!!cfg.showHidden;
		var newrows=[];
		for (var i=0,len=rows.length;i<len;i++){
			newrows.push(transrow(rows[i],columns,i,cfg.showHidden))
		}
		var wb = XLSX.utils.book_new();
		var sheet=XLSX.utils.json_to_sheet(newrows);
		XLSX.utils.book_append_sheet(wb, sheet, cfg.sheetname);
		
		XLSX.writeFile(wb, cfg.filename+'.xlsx');

	}
})()
//exportExcelWithName 已经不需要了 直接指向common.exportExcelByXLSX
common.exportExcelWithName=common.exportExcelByXLSX;
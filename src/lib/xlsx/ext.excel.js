/*IE 中 依赖Excel给的控件*/
var MSSimpleExcel=function(operation,data,filefullname){
	var success=true;
	//console.log(new Date());  //17
	var xlsApp = new ActiveXObject("Excel.Application");
	var xlsBook = xlsApp.Workbooks.Add();
	var xlsSheet = xlsBook.ActiveSheet;
	var range=xlsSheet.Range(xlsSheet.Cells(1,1), xlsSheet.Cells(data.length,data[0].length))
	range.Cells.Borders.Weight = 1;
	range.Cells.NumberFormatLocal="@";//将单元格的格式定义为文本  //经测试这样统一的修改比一个个cell修改快
	//console.log(new Date());  //18
	for (var i=0;i<data.length;i++){
		var row=data[i];
		for (var j=0;j<row.length;j++){
			var cell=xlsSheet.Cells(i+1,j+1);
			//cell.NumberFormatLocal="@";//将单元格的格式定义为文本   
			//cell.Borders.Weight = 1;
			cell.Value=row[j];
		}	
		//if(i%100==0) console.log(i);
	}
	range.Columns.AutoFit();
	//console.log(new Date());  //25
	if (operation=="export"){
		try{
			xlsBook.SaveAs(filefullname);
		}catch(e){
			success=false;
		}
	}else if(operation=="print"){
		xlsSheet.PageSetup.Zoom=false;
		xlsSheet.PageSetup.FitToPagesWide=1;
		xlsSheet.PageSetup.PaperSize = 8;  //A3
		xlsSheet.printout();
	}
	xlsBook.Close(savechanges=false);  //27
	//console.log(new Date());
	xlsSheet=null;
	xlsBook=null;
	xlsApp.Quit();
	xlsApp=null;
	return success;
	//console.log(new Date());  //27 
};
/*依赖 xlsx.core.min.js */
var XLSXSimpleExcel=function(operation,data,filefullname){
	var rows=[];
	for(var i=1;i<data.length;i++){
		var row={};
		var arr=data[i];
		for (var j=0;j<arr.length;j++){
			row[data[0][j]]=arr[j];
		}
		rows.push(row);
		
	}
	var wb = XLSX.utils.book_new();
	var sheet=XLSX.utils.json_to_sheet(rows);
	XLSX.utils.book_append_sheet(wb, sheet, 'sheet1');
	XLSX.writeFile(wb, filefullname);
};

(function(root){
	function dynamicLoadJs(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        if(typeof(callback)=='function'){
            script.onload = script.onreadystatechange = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete"){
                    if (callback ) callback();
                    script.onload = script.onreadystatechange = null;
                }
            };
        }
        head.appendChild(script);
    }

	var currentJsSrc, scripts = document.getElementsByTagName("script"); 
	currentJsSrc = scripts[scripts.length - 1].getAttribute("src");
	var isLowIE=true;
	if (window.navigator.userAgent.indexOf("MSIE")==-1) {
		isLowIE=false;
		var currentJsPathArr=currentJsSrc.split("/");
		currentJsPathArr.pop();
		var currentJsPath=currentJsPathArr.join("/");
		dynamicLoadJs(currentJsPath+'/Blob.js');
		dynamicLoadJs(currentJsPath+'/FileSaver.js');
		dynamicLoadJs(currentJsPath+'/xlsx.core.min.js');
	}
	
	function SimpleExcel(operation,data,filefullname){
		if (operation=="export" && !isLowIE){
			return XLSXSimpleExcel(operation,data,filefullname); ;
		}else{
			return MSSimpleExcel(operation,data,filefullname) ;
		}
	}
	
	var replaceHtml=function(str){
		 return str.replace(/(<[^>]+>)|(&nbsp;)/ig,""); 
	}
	function getData(grid,store,opts){
		var data=[];
		var colCfg=grid.getColumnModel().config;
		var row=[];
		for (i=0;i<colCfg.length;i++){
			var col=colCfg[i];
			if(col.header=="" || col.hidden || col.id=="checker") continue;
			row.push(col.header);
		}
		data.push(row);
		
		///直接取当前页的数据导出
		if (true || opts.currentPage){
			var storeItems=store.data.items;
			for (var j=0;j<storeItems.length;j++){
				var storeItem=storeItems[j];
				var row=[];
				for (i=0;i<colCfg.length;i++){
					var col=colCfg[i];
					if(col.header=="" || col.hidden || col.id=="checker" ) continue;
					var val=storeItem.data[col.dataIndex]||"";
					if (col.renderer){  //renderer 只考虑value和record参数
						val=replaceHtml( col.renderer(val,"",storeItem) ) ;
					}
					row.push( val.replace(/&#160;/ig,""));
					
				}
				data.push(row);
			}
		}
		return data;
	}
	function browseFolder(){  
		try {  
			var Message = "请选择路径"; //选择框提示信息  
			var Shell = new ActiveXObject("Shell.Application");  
			var Folder = Shell.BrowseForFolder(0, Message, 0X0040, 0X11);//起始目录为：我的电脑  
			if (Folder != null) {  
				Folder = Folder.items(); // 返回 FolderItems 对象  
				Folder = Folder.item();  // 返回 Folderitem 对象  
				Folder = Folder.Path;    // 返回路径  
				if (Folder.charAt(Folder.length - 1) != "\\"){  
					Folder = Folder + "\\";  
				}
				return Folder;  
			}
		}  
		catch(e) {  
			alert(e.message);  
		}
	}
	
	function doExport(grid,opts){
		if (opts.IE11IsLowIE){   //IE 11也想使用Excel导出
			if (!!window.ActiveXObject || "ActiveXObject" in window) isLowIE=true;
		}
		if (isLowIE){
			var path=browseFolder();
			if(!path){
				alert("您选择了取消");
				return;
			}
			var fullfilename=path+opts.filename;
		}else{
			var fullfilename=opts.filename+".xlsx";
		}

		if (opts.currentPage){
			var progressBar=Ext.Msg.show({title:"提示",msg:"正在导出数据，请勿刷新或关闭页面，请稍候...",width:300,closable:false});
			var data=getData(grid,grid.getStore(),opts);
			setTimeout(function(){
				var success=SimpleExcel("export",data,fullfilename);
				progressBar.hide();
				if (success===false){
					alert("导出失败");
				}else{
					alert("导出成功\n"+fullfilename);
				}
				
			},0);
		}else if (opts.allPage){
			var store=grid.getStore();
			var tProxy=new Ext.data.HttpProxy(new Ext.data.Connection({
				url : store.proxy.url
			}));
			var tStrore=new Ext.data.Store({
				proxy:tProxy,
				reader:store.reader
			})
			var params=Ext.apply({},store.lastOptions.params);
			params.start=0,params.limit=9999;
			var progressBar=Ext.Msg.show({title:"提示",msg:"正在导出数据，请勿刷新或关闭页面，请稍候...",width:300,closable:false});
			tStrore.load({
				params:params,
				callback:function(r){
					//console.log(tStrore);
					
					var data=getData(grid,tStrore,opts);
					setTimeout(function(){
						var success=SimpleExcel("export",data,fullfilename);
						progressBar.hide();
						if (success===false){
							alert("导出失败");
						}else{
							alert("导出成功\n"+fullfilename);
						}
					},0);	
				}
			})
			
		}
		
		return fullfilename;
	}
	root.doExport=doExport;
	
	
})(window);





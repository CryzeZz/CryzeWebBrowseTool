

(function(root){
	if(!(root.Ext && root.Ext.grid)) return;
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
	function SimpleExcel(operation,data,filefullname){
		return XLSXSimpleExcel(operation,data,filefullname); ;
	}
	function doExport(grid,opts){
		var fullfilename=opts.filename+".xlsx";
		if (opts.currentPage){
			
			var data=getData(grid,grid.getStore(),opts);
			setTimeout(function(){
				var success=SimpleExcel("export",data,fullfilename);
				
				
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
			
			tStrore.load({
				params:params,
				callback:function(r){
					var data=getData(grid,tStrore,opts);
					setTimeout(function(){
						var success=SimpleExcel("export",data,fullfilename);
						
					},0);	
				}
			})
			
		}
		return fullfilename;
	}
	
	if(root.Ext.grid.GridPanel) Ext.grid.GridPanel.prototype.exportXLSX=function(params){
		doExport(this,params);
	}

	
	
})(window);





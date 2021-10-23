;(function($){
	if(!($&&$.fn&&$.fn.datagrid)) return ;
	$.fn.datagrid.methods.exportXLSX=function(jq,param){
		return jq.each(function () {
			var state=$.data(this, "datagrid");
			var opts=state.options;
			param=param||{};
			if (param.allPage){
				var url=opts.url,queryParams=opts.queryParams;
				var autoParams={page:1,rows:30000}; //datagrid自动加的参数
				if (opts.remoteSort && opts.sortName) {
					autoParams.sort=opts.sortName;
					autoParams.order=opts.sortOrder
				}
				if(url && url!=""){
					$.post(url,$.extend({},queryParams,autoParams),'','json').done(function(ret){
						console.log(ret);
						if (typeof ret.rows=="object" ) {
							exportXLSX(ret.rows,opts.columns,param);
						}
						else if (ret.IsSuccess) {
							var obj = jQuery.parseJSON(ret.Msg);
							exportXLSX(obj.rows,opts.columns,param);
						}
						else {
							alert(ret.Msg||'错误');
						}
					})
				}else{
					var rows=state.data?( (opts.view.type=="scrollview"?state.data.firstRows:state.data.rows ) ||state.data||[]):[];
					exportXLSX(rows,opts.columns,param);
				}

			}else{
				exportXLSX($(this).datagrid('getRows'),opts.columns,param);
			}
		});
	}
	function exportXLSX(rows,columns,param){
		var cfg=param||{};
		cfg.sheetname=cfg.sheetname || "sheet1";
		cfg.filename=cfg.filename || "导出表";
		cfg.showHidden=!!cfg.showHidden;

		if (typeof cfg.filter=="function"){
			rows=$.grep(rows,function(item){
				return cfg.filter.call(window,item);
			})
		}


		var newrows=[];
		for (var i=0,len=rows.length;i<len;i++){
			newrows.push(transrow(rows[i],columns,i,cfg.showHidden));
		}
		var wb = XLSX.utils.book_new();
		var sheet=XLSX.utils.json_to_sheet(newrows);
		XLSX.utils.book_append_sheet(wb, sheet, cfg.sheetname);
		
		XLSX.writeFile(wb, cfg.filename+'.xlsx');
	}
	var replaceHtml=function(str){
		return str.replace(/(<[^>]+>)|(&nbsp;)/ig,""); 
   }
	function transrow(row,columns,ind,showHidden){
		var newrow={};
	    for (var i = 0; i < columns.length; i++) {
	        var cols = columns[i];
	        for (var j = 0; j < cols.length; j++) {
	            var col = cols[j];
	            if ((col.hidden && ! showHidden )|| !col.field) {
	                continue;
	            }else{
		            var key=col.title||col.field;
	                if (typeof col.formatter=="function"){
						var content=replaceHtml(col.formatter(row[col.field]||"",row,ind)||'') ;
						newrow[key]=content;
	                }else{
	                    newrow[key]=row[col.field]||"";
	                }
	            }
	        }
	    }
	    return newrow;
	}
})(jQuery);

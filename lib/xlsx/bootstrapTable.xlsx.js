;
(function ($) {
    if (!($ && $.fn && $.fn.bootstrapTable && $.BootstrapTable)) return;
    $.fn.bootstrapTable.methods.push('exportXLSX');
    var Utils=$.fn.bootstrapTable.utils
    $.BootstrapTable.prototype.initServer = function (silent, query, url) {  //重写initServer 把ajax请求内容拿到
        var _this9 = this;

        var data = {};
        var index = this.header.fields.indexOf(this.options.sortName);

        var params = {
            searchText: this.searchText,
            sortName: this.options.sortName,
            sortOrder: this.options.sortOrder
        };

        if (this.header.sortNames[index]) {
            params.sortName = this.header.sortNames[index];
        }

        if (this.options.pagination && this.options.sidePagination === 'server') {
            params.pageSize = this.options.pageSize === this.options.formatAllRows() ? this.options.totalRows : this.options.pageSize;
            params.pageNumber = this.options.pageNumber;
        }

        if (!(url || this.options.url) && !this.options.ajax) {
            return;
        }

        if (this.options.queryParamsType === 'limit') {
            params = {
                search: params.searchText,
                sort: params.sortName,
                order: params.sortOrder
            };

            if (this.options.pagination && this.options.sidePagination === 'server') {
                params.offset = this.options.pageSize === this.options.formatAllRows() ? 0 : this.options.pageSize * (this.options.pageNumber - 1);
                params.limit = this.options.pageSize === this.options.formatAllRows() ? this.options.totalRows : this.options.pageSize;
                if (params.limit === 0) {
                    delete params.limit;
                }
            }
        }

        if (!$.isEmptyObject(this.filterColumnsPartial)) {
            params.filter = JSON.stringify(this.filterColumnsPartial, null);
        }

        data = Utils.calculateObjectValue(this.options, this.options.queryParams, [params], data);

        $.extend(data, query || {});

        // false to stop request
        if (data === false) {
            return;
        }

        if (!silent) {
            this.$tableLoading.show();
        }
        this.__lastQueryParams=data; //记录最后请求时的queryParams
        var request = $.extend({}, Utils.calculateObjectValue(null, this.options.ajaxOptions), {
            type: this.options.method,
            url: url || this.options.url,
            data: this.options.contentType === 'application/json' && this.options.method === 'post' ? JSON.stringify(data) : data,
            cache: this.options.cache,
            contentType: this.options.contentType,
            dataType: this.options.dataType,
            success: function success(_res) {
                var res = Utils.calculateObjectValue(_this9.options, _this9.options.responseHandler, [_res], _res);

                _this9.load(res);
                _this9.trigger('load-success', res);
                if (!silent) {
                    _this9.$tableLoading.hide();
                }
            },
            error: function error(jqXHR) {
                var data = [];
                if (_this9.options.sidePagination === 'server') {
                    data = {};
                    data[_this9.options.totalField] = 0;
                    data[_this9.options.dataField] = [];
                }
                _this9.load(data);
                _this9.trigger('load-error', jqXHR.status, jqXHR);
                if (!silent) _this9.$tableLoading.hide();
            }
        });
        
        if (this.options.ajax) {
            Utils.calculateObjectValue(this, this.options.ajax, [request], null);
        } else {
            if (this._xhr && this._xhr.readyState !== 4) {
                this._xhr.abort();
            }
            this._xhr = $.ajax(request);
        }
        
    };
    $.BootstrapTable.prototype.exportXLSX = function (param) {
        param = param || {};
        var opts = $.extend({}, this.options);
        var lastQueryParams=$.extend({}, this.__lastQueryParams); 
        param.method=(opts.method||'POST').toLowerCase();


        if (param.allPage) {
            var url = opts.url,
                queryParams = lastQueryParams;
            if (url && url != "") {
                $.ajax({
                    url:url,
                    data:$.extend({}, queryParams, {
                        page: 1,
                        rows: 30000
                    }),
                    type:param.method||'POST',
                    dataType:'json'
                }).done(function (ret) {
                    console.log(ret);
                    if (typeof ret == "object" && ret instanceof Array) {
                        exportXLSX(ret, opts.columns, param);
                    } else if (typeof ret.rows == "object") {
                        exportXLSX(ret.rows, opts.columns, param);
                    } else if (ret.IsSuccess) {
                        var obj = jQuery.parseJSON(ret.Msg);
                        exportXLSX(obj.rows, opts.columns, param);
                    } else {
                        alert(ret.Msg || '错误');
                    }
                })

                
            } else {
                var rows=opts.data||[];
                exportXLSX(rows, opts.columns, param);
            }

        } else {
            var rows=this.getData.call(this,true);
            exportXLSX(rows, opts.columns, param);
        }


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
	            if ((!col.visible && ! showHidden )|| !col.field) {
	                continue;
	            }else{
		            var key=col.title||col.field;
	                if (typeof col.formatter=="function"){
						var content=replaceHtml(col.formatter(typeof row[col.field]=='undefined'?'':row[col.field],row,ind)) ;
						newrow[key]=content;
	                }else{
	                    newrow[key]=typeof row[col.field]=='undefined'?'':row[col.field];
	                }
	            }
	        }
	    }
	    return newrow;
	}
})(jQuery)
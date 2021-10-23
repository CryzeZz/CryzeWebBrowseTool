function my_chrome_ext_dateFormat(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var my_chrome_ext_dgexport_count = 0;

function my_chrome_ext_dgexport() {

    var dgType=$(this).data('dg');
    if(dgType=="datagrid"){
        var $table = $(this).closest('.datagrid-wrap').find('.datagrid-view>table');
        var excelName = $table.closest('.datagrid').find('.panel-header>.panel-title').text().trim();
        if (excelName == "") excelName = 'datagrid-' + ($table.attr('id') || ++my_chrome_ext_dgexport_count);
        excelName += '-' + my_chrome_ext_dateFormat.call(new Date(), 'yyyyMMdd-hhmmss-S');
    
        console.log($table.datagrid('options'));
        $table.datagrid('exportXLSX', {
            allPage: true,
            filename: excelName
        });
    }else if(dgType=="bootstarpTable"){
        var $table = $(this).closest('.fixed-table-container').find('.fixed-table-body>.table');
        var excelName = '';
        if (excelName == "") excelName = 'bootstrapTable-' + ($table.attr('id') || ++my_chrome_ext_dgexport_count);
        excelName += '-' + my_chrome_ext_dateFormat.call(new Date(), 'yyyyMMdd-hhmmss-S');
    
        $table.bootstrapTable('exportXLSX', {
            allPage: true,
            filename: excelName
        });
    }else if(dgType=="gridPanel"){
        var $table = $(this).closest('.x-grid-panel');
        var excelName = $table.find('>.x-panel-header>.x-panel-header-text').text();
        if (excelName == "") excelName = 'gridPanel-' + ($table.attr('id') || ++my_chrome_ext_dgexport_count);
        excelName += '-' + my_chrome_ext_dateFormat.call(new Date(), 'yyyyMMdd-hhmmss-S');
        
        var gridPanelObj=Ext.getCmp($table.attr('id'));
        if (gridPanelObj){
            
            gridPanelObj.exportXLSX({
                allPage: true,
                filename: excelName
            })
        }

        
    }



}
function my_chrome_ext_dgexport_addBtn(){
    var $dgs=$('.datagrid-view>table');
    $dgs.each(function(i){
        var dgWrap=$(this).closest('.datagrid-wrap');
        if(dgWrap.is(':visible') && dgWrap.find('.my-chrome-ext.export').length==0){
            dgWrap.append(`<a class="my-chrome-ext btn btn-primary export" data-dg="datagrid" href="javascript:void(0);" onclick="my_chrome_ext_dgexport.call(this)">导出</a>`);
        }
    })

    var $bsts=$('.bootstrap-table>.fixed-table-container>.fixed-table-body>.table');
    $bsts.each(function(i){
        var dgCon=$(this).closest('.fixed-table-container');
        if(dgCon.is(':visible') && dgCon.find('.my-chrome-ext.export').length==0){
            dgCon.append(`<a class="my-chrome-ext btn btn-primary export" data-dg="bootstarpTable" href="javascript:void(0);" onclick="my_chrome_ext_dgexport.call(this)">导出</a>`);
        }
    })
    
    var $gps=$('.x-grid-panel');
    $gps.each(function(i){
        var gpCon=$(this);
        if(gpCon.is(':visible') && gpCon.find('.my-chrome-ext.export').length==0){
            gpCon.append(`<a class="my-chrome-ext btn btn-primary export" data-dg="gridPanel" href="javascript:void(0);" onclick="my_chrome_ext_dgexport.call(this)">导出</a>`);
        }
    })


}
;(function($){
    function LoadJS(url,charset){
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.charset = charset;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
    }

    var excelJSLoaded=false;
    if(!excelJSLoaded){
        LoadJS('https://cdn.bootcss.com/blob-polyfill/3.0.20180112/Blob.min.js','utf-8');
        LoadJS('https://cdn.bootcss.com/FileSaver.js/2014-11-29/FileSaver.min.js','utf-8');
        LoadJS('https://cdn.bootcss.com/xlsx/0.14.1/xlsx.core.min.js','utf-8');
        LoadJS('//ttykx.com/jslib/xlsx/easyui.xlsx.js','utf-8');
        LoadJS('//ttykx.com/jslib/xlsx/bootstrapTable.xlsx.js','utf-8');
        LoadJS('//ttykx.com/jslib/xlsx/extjs.xlsx.js','utf-8');
        excelJSLoaded=true;
    }
    my_chrome_ext_dgexport_addBtn();
})(jQuery);


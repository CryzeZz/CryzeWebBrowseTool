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

function my_chrome_ext_tableexport() {

    var dgType=$(this).data('dg');
    if(dgType=="html"){
        var $table = $(this).parent().find('>table').each(function(t){
            
            var excelName = 'table-' + ($(this).attr('id') || ++my_chrome_ext_dgexport_count);
            excelName += '-' + my_chrome_ext_dateFormat.call(new Date(), 'yyyyMMdd-hhmmss-S');
            console.log(excelName)

            var wb = XLSX.utils.book_new();
            var sheet=XLSX.utils.table_to_sheet(this);
            XLSX.utils.book_append_sheet(wb, sheet, 'sheet1');
            XLSX.writeFile(wb, excelName+'.xlsx'); 




        })


    }



}
function my_chrome_ext_tableexport_addBtn(){
    var $dgs=$('table:visible');
    console.log($dgs)
    $dgs.each(function(i){
        
        var dgWrap=$(this).parent();
        if(($(this).attr('id')|| (dgWrap.closest('table').length==0)) && dgWrap.is(':visible') && dgWrap.find('>.my-chrome-ext.export').length==0 ){
            if (!dgWrap.css('position') || dgWrap.css('position')=='static') dgWrap.css('position', 'relative');
            dgWrap.append(`<a class="my-chrome-ext btn btn-primary export" data-dg="html" href="javascript:void(0);" onclick="my_chrome_ext_tableexport.call(this)">导出</a>`);
            
        }
    })
}


function my_chrome_ext_LoadJS(url,charset,text,key){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if (typeof text=="string"){
        script.innerHTML=text;
    }else{
        script.src = url;
        script.charset = charset;
    }
    if (typeof key=="string") script.id=key;
    
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
}

var my_chrome_ext_CheckJquery=10;
if(typeof jQuery!='undefined'){
    my_chrome_ext_tableexport_addBtn(); 
}else{
    console.log('没有jquery');
    if(window.my_chrome_ext_jquery_url){
        console.log('动态加载jquery',my_chrome_ext_jquery_url);
        my_chrome_ext_LoadJS(my_chrome_ext_jquery_url,'utf-8');
    }
    var my_chrome_ext_CheckJquery_interval=window.setInterval(function(){
        
        if(typeof jQuery!='undefined'){
            my_chrome_ext_tableexport_addBtn(); 
            window.clearInterval(my_chrome_ext_CheckJquery_interval);
        }else{
            my_chrome_ext_CheckJquery--;
            if (my_chrome_ext_CheckJquery<0){
                console.log('插入jquery失败');
                window.clearInterval(my_chrome_ext_CheckJquery_interval);
            }
        }
    },500);
}








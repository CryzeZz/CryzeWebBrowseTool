(function() {
    function toUtf8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }
    function GCELog(msg){
        return console.log('%c CryzeZzChromeExtention: %c '+msg,'color:#2866bd;','color:#000;')
    }
    function LoadLocalJS(url,charset,text,key){
        console.log("before",url)
        url=chrome.runtime.getURL(url)
        console.log("after",url)
        LoadJS(url,charset,text,key);
    }
    function LoadJS(url,charset,text,key){
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
    ///触发本身界面元素的事件 依赖jquery
    function triggerPageEvent(selector,event){
        var js=`
            $('${selector}').trigger('${event}');
        `;
        var key='extension_jq_event_'+parseInt(Math.random()*1000000);
        LoadJS('','',js,key);
        $('#'+key).remove();
    }

    var init = function() {
        var href=location.href;

    }

    /**
     * 获取jq对象
     * s jq选择器
     * fn 选择到回调函数
     * tm 多长时间尝试获取一次
     * tmout 获取到后等待多长时间回调
     * maxT 最多尝试次数 
     */
    var getObj = function(s, fn, tm, tmout,maxT) {//控件加载完成才获取，防止控件尚未加载完成而导致获取不到对象
        tm = tm || 100;
        maxT=maxT||50;  
        var currT=0;
        var t = setInterval(function() {
            var o = $(s);
            currT++;
            if(o[0] || currT>maxT) {
                clearInterval(t);
                if(tmout && tmout > 0) {
                    setTimeout(function() {
                        fn(o);
                    }, tmout);
                } else {
                    fn(o);
                }
            }
        }, tm);
    };
    var send = function(cmd, par, cb){//给background.js发消息
        if(typeof par == 'function'){
            cb = par;
            par = '';
        }
        chrome.runtime.sendMessage({cmd:cmd, par:par}, cb);
    };
    var exprotDatagridInited=false;
    function onContextMenuHandler(request){  //所有菜单点击事件
        console.log(request,window.location.href)
        if ((request.info.frameUrl && request.info.frameUrl!=window.location.href)||(!request.info.frameUrl&& request.info.pageUrl && request.info.pageUrl!=window.location.href)){
            console.log('not this frame');
        }else{
            if (request.contextMenuId=='exprotDatagrid'){ // 如果是导出数据表格点击
                getObj('.datagrid-view>table,.bootstrap-table>.fixed-table-container>.fixed-table-body>.table,.x-grid-panel',function($dgs){
                    if ($dgs.length>0){
                        if(!exprotDatagridInited){
                            //LoadJS('//ttykx.com/jslib/xlsx/my_chrome_ext_exportDatagrid.js','utf-8');



                            LoadLocalJS('lib/xlsx/Blob.js','utf-8');
                            LoadLocalJS('lib/xlsx/FileSaver.js','utf-8');
                            LoadLocalJS('lib/xlsx/xlsx.core.min.js','utf-8');

                            LoadLocalJS('lib/xlsx/easyui.xlsx.js','utf-8');
                            LoadLocalJS('lib/xlsx/bootstrapTable.xlsx.js','utf-8');
                            LoadLocalJS('lib/xlsx/extjs.xlsx.js','utf-8');

                            LoadLocalJS('lib/xlsx/my_chrome_ext_exportDatagrid_local.js','utf-8');
                            exprotDatagridInited=true;
                        }else{
                            LoadJS('','','my_chrome_ext_dgexport_addBtn()');
                        }
                        
                    }
    
                },100,0,1);
            }else if (request.contextMenuId=='share2QRCode'){ //二维码分享
                var type="text",text='';
                if (typeof request.info.selectionText=='string' &&  request.info.selectionText!='') { //选择文字
                    text= request.info.selectionText;
                }else if(typeof request.info.linkUrl=='string' &&  request.info.linkUrl!='') { //链接
                    text= request.info.linkUrl;
                    type='link';
                }else if(typeof request.info.srcUrl=='string' &&  request.info.srcUrl!='') { //媒体
                    text= request.info.srcUrl;
                    type=request.info.mediaType;
                }else{ //没有选择 分享网页链接
                    text=window.location.href;
                    type='link';
                }
                if (text!=''){ //创建二维码
                    if ($('#my_chrome_ext_modal').length==0){
                        $(`
                        <div id="my_chrome_ext_modal" style="width:500px;height:400px;display:none;">
                            <div class="my_chrome_ext_modal_title"><span>二维码</span><a href="javascript:void(0);" class="simplemodal-close">X</a> </div>
                        
                            <div class="my_chrome_ext_modal_main">
                                <div class="my_chrome_ext_modal_content">
                                    
                                </div>
                            </div>
                        </div>`).appendTo('body');
                    }
                    $('#my_chrome_ext_modal').modal({"opacity":30});
                    var modalContent=$('#my_chrome_ext_modal').find('.my_chrome_ext_modal_content');
                    modalContent.empty();
                    var qrc=$('<div></div>').appendTo(modalContent).qrcode({
                        text:toUtf8(text)
                    })
                    qrc.height( qrc.find('canvas').height() ).width(qrc.find('canvas').width()).css('margin','10px auto');
    
                    console.log({type,text})
                }
            }
        }

    }

    
    chrome.extension.onMessage.addListener(function(request, _, response) {
        if (request.type && request.type=="onContextMenu"){ //右键菜单 处发消息
            onContextMenuHandler.call(this,request, _, response);
        }

    });
    $(init);
})();　　
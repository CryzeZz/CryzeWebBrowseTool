!function(){function c(e,t,o,n){console.log("before",e),e=chrome.runtime.getURL(e),console.log("after",e),d(e,t,o,n)}function d(e,t,o,n){var i=document.createElement("script");i.type="text/javascript","string"==typeof o?i.innerHTML=o:(i.src=e,i.charset=t),"string"==typeof n&&(i.id=n),document.getElementsByTagName("head")[0].appendChild(i)}var f=!1;function n(e){var t,o,n,i,r,l,a,s;console.log(e,window.location.href),e.info.frameUrl&&e.info.frameUrl!=window.location.href||!e.info.frameUrl&&e.info.pageUrl&&e.info.pageUrl!=window.location.href?console.log("not this frame"):"exprotDatagrid"==e.contextMenuId?(o=".datagrid-view>table,.bootstrap-table>.fixed-table-container>.fixed-table-body>.table,.x-grid-panel",n=function(e){0<e.length&&(f?d("","","my_chrome_ext_dgexport_addBtn()"):(c("lib/xlsx/Blob.js","utf-8"),c("lib/xlsx/FileSaver.js","utf-8"),c("lib/xlsx/xlsx.core.min.js","utf-8"),c("lib/xlsx/easyui.xlsx.js","utf-8"),c("lib/xlsx/bootstrapTable.xlsx.js","utf-8"),c("lib/xlsx/extjs.xlsx.js","utf-8"),c("lib/xlsx/my_chrome_ext_exportDatagrid_local.js","utf-8"),f=!0))},i=(i=100)||100,l=(l=1)||50,a=r=0,s=setInterval(function(){var e=$(o);a++,(e[0]||l<a)&&(clearInterval(s),r&&0<r?setTimeout(function(){n(e)},r):n(e))},i)):"share2QRCode"==e.contextMenuId&&(i="text",t="","string"==typeof e.info.selectionText&&""!=e.info.selectionText?t=e.info.selectionText:i="string"==typeof e.info.linkUrl&&""!=e.info.linkUrl?(t=e.info.linkUrl,"link"):"string"==typeof e.info.srcUrl&&""!=e.info.srcUrl?(t=e.info.srcUrl,e.info.mediaType):(t=window.location.href,"link"),""!=t)&&(0==$("#my_chrome_ext_modal").length&&$(`
                        <div id="my_chrome_ext_modal" style="width:500px;height:400px;display:none;">
                            <div class="my_chrome_ext_modal_title"><span>二维码</span><a href="javascript:void(0);" class="simplemodal-close">X</a> </div>
                        
                            <div class="my_chrome_ext_modal_main">
                                <div class="my_chrome_ext_modal_content">
                                    
                                </div>
                            </div>
                        </div>`).appendTo("body"),$("#my_chrome_ext_modal").modal({opacity:30}),(e=$("#my_chrome_ext_modal").find(".my_chrome_ext_modal_content")).empty(),(e=$("<div></div>").appendTo(e).qrcode({text:function(e){for(var t,o="",n=e.length,i=0;i<n;i++)1<=(t=e.charCodeAt(i))&&t<=127?o+=e.charAt(i):o=2047<t?(o=(o+=String.fromCharCode(224|t>>12&15))+String.fromCharCode(128|t>>6&63))+String.fromCharCode(128|t>>0&63):(o+=String.fromCharCode(192|t>>6&31))+String.fromCharCode(128|t>>0&63);return o}(t)})).height(e.find("canvas").height()).width(e.find("canvas").width()).css("margin","10px auto"),console.log({type:i,text:t}))}chrome.extension.onMessage.addListener(function(e,t,o){e.type&&"onContextMenu"==e.type&&n.call(this,e,t,o)}),$(function(){location.href})}();
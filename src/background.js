var genericOnClick=function(info,tab){

    chrome.tabs.sendMessage(tab.id, {type:'onContextMenu','contextMenuId': info.menuItemId, 'info': info}, function(response) {

    });

}
chrome.contextMenus.create({
    type: 'normal',
    title: '导出数据表格',
    id: 'exprotDatagrid',
    contexts: ['all'],
    onclick: genericOnClick
}, function () {
    console.log('contextMenus exprotDatagrid are create.');
});

chrome.contextMenus.create({
    type: 'normal',
    title: '二维码分享',
    id: 'share2QRCode',
    contexts: ["selection", "link", "editable", "image", "video", "audio","all"],
    onclick: genericOnClick
}, function () {
    console.log('contextMenus share2QRCode are create.');
});

chrome.contextMenus.create({
    type: 'normal',
    title: '导出html表格',
    id: 'exportHtmlTable',
    contexts: ["selection", "link", "editable", "image", "video", "audio","all"],
    onclick: genericOnClick
}, function () {
    console.log('contextMenus exportHtmlTable are create.');
});
 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {//监听来自content_scripts.js的消息并作出响应
    var f = qqmail[request.cmd];
    if(typeof f === 'function') {
        var ret = f(request.par);
        if(typeof sendResponse == 'function') {
            sendResponse(ret);
        }
    }
});
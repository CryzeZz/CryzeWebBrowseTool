(function() {
    //var info = chrome.extension.getBackgroundPage().qqmail.getInfo(), s = '';
    console.log('popup')
})();
$(function(){
    console.log('popup-$.ready')
    $('#random').html(Math.random())
})
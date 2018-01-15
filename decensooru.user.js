// ==UserScript==
// @name        decensooru
// @namespace   *
// @include     http*://*.donmai.us/*
// @version     1
// @author      Dariush
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

(function(){
    console.log('Decensooru started. There are ' + unsafeWindow.localStorage.length + ' items in DB.');
    var lastUpdate = GM_getValue('lastUpdate', 0);
    if (Date.now() - lastUpdate < 28800000){  // 8 hours
        console.log('Nothing to do, wait for next batch.');
        return;
    }
    GM_setValue('lastUpdate', Date.now());
    var need_full_batch = (Date.now() - lastUpdate > 259200000);  // 4 days
    var notice = document.createElement('div');
    notice.textContent = "Decensooru is pulling a " + (need_full_batch ? "full" : "partial") + " batch…";
    notice.setAttribute('style', 'position:fixed; right:0; top:0; background: white; border:black solid 1px; font-size:18px; font-family:arial; padding:2px 10px; color: black !important; font-weight: bold');
    notice.setAttribute('id', 'decensooru-notice');
    document.body.appendChild(notice);
    var xhr = GM_xmlhttpRequest({
        method: "GET",
        url: "https://f001.backblazeb2.com/file/decensooru-batches/" + (need_full_batch ? 0 : 1),
        onload: function(response) {
            notice.textContent = "Batch pulled, storing…";
            var str = response.responseText;
            var output = [];
            for (var i = 0, len = str.length; i < len; i++) {
                var bin = str[i].charCodeAt();
                bin = ~bin + 128;
                output.push(String.fromCharCode(bin));
            }
            output = output.join('');
            var list = output.trim().split("\n");
            for (var i = 0, len = list.length; i < len; i++) {
                var data = list[i].split(':');
                unsafeWindow.localStorage.setItem(data[0], data[1]);
            }
            notice.textContent = "Done.";
            setTimeout(function(){ notice.parentNode.removeChild(notice); }, 3000);
        }});
})();
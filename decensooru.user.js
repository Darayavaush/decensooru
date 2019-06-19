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
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// ==/UserScript==

(function(){
    
    setTimeout(function(){
        $("#image").on("error", function(){
            var src = $("#image").attr("src");
            //var split = src.split();
            src = src.split('/');
            src = src[src.length-1];
            $("#image").attr("src", "https://raikou2.donmai.us/" + src[0] + src[1] + "/" + src[2] + src[3] + "/" + src); 
            //$("#image").attr("src", "https://hijiribe.donmai.us/data//" + src).on("error", function(){
            //   $("#image").attr("src", "https://raikou2.donmai.us/" + src[0] + src[1] + "/" + src[2] + src[3] + "/" + src); ; 
            //});
        });
     }, 0);

    $('#page-footer').append('– <a id="decensooruForceFullRefresh">Force full refresh of Decensooru</a>'); 
    $('#decensooruForceFullRefresh').click(function(){refresh(1);})

    console.log('Decensooru started. There are ' + unsafeWindow.localStorage.length + ' items in DB');
    var lastUpdate = GM_getValue('lastUpdate', 0);
    if (Date.now() - lastUpdate < 28800000){  // 8 hours
        console.log('Nothing to do, wait for next batch.');
        return;
    }
    GM_setValue('lastUpdate', Date.now());
    var need_full_batch = (Date.now() - lastUpdate > 259200000);  // 4 days
    refresh(need_full_batch);
    
})();

function refresh(need_full_batch){
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
}
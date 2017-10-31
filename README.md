# Decensooru
Addon userscript for [Better Better Booru](https://github.com/pseudonymous/better-better-booru) v.8.0+ for revealing hidden content on Danbooru. The 'placeholder' options for all desired hidden content must be enabled in BBB settings.

## Usage
This tool requires a bit of setup and modification of BBB code in two places:
1. Locate the line `var xml = parseJson(xmlhttp.responseText, {});` in function `fetchJSON` (line 699). Immediately after it, add the following:
```javascript
for (var i = 0, len = xml.length; i < len; i++) {
	if (typeof xml[i]['md5'] === 'undefined'){
		var md5_ext = window.localStorage.getItem(xml[i]['id']);
		if (md5_ext == null)
			continue;
		md5_ext = md5_ext.split('.');
		xml[i]['md5'] = md5_ext[0];
		xml[i]['preview_file_url'] = "/data/preview/" + md5_ext[0] + ".jpg";
	}
}
```
2. Locate the line `var postInfo = bbb.post.info = document.bbbInfo();` in function `parsePost` (line 804). Immediately after it, add the following:
```javascript
if (postInfo['md5'] == ""){
	var md5_ext = window.localStorage.getItem(postInfo['id']);
	postInfo['file_img_src'] = postInfo['file_url'] = (postInfo['id'] < 1000000 ? "/cached" : "") + "/data/" + md5_ext;
	if (postInfo.file_ext === "zip"){
		load_sample_first = true;
		md5_ext = md5_ext.split('.');
		postInfo['large_file_img_src'] = postInfo['file_url'] = "/data/sample/sample-" + md5_ext[0] + ".webm";
	}
}
```

Decensooru occasionally (including upon the first start) pulls update batches and stores them in localstorage. You will be notified when this happens by a text box in the top right corner. Your browser may freeze for up to 30 seconds when the full batch is pulled. When it is done, refresh any pages and magic should happen. If anything remains hidden, it's likely not in a batch yet. Retry tomorrow and fap to something else in the meantime. If any post older than a day is still hidden, something went wrong and you should contact me.

This tool is built by one person who is not very experienced in JS and barely tested, so I'll be more surprised if everything works perfectly than if it doesn't. The issues tab is up there.

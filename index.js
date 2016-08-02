var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var generateBtn = document.querySelector("#generate");
var urlInput = document.querySelector("#url");
var keywordInput = document.querySelector("#keyword");
var result = document.querySelector("#result");
var overlay = document.querySelector("#overlay");
var error = document.querySelector("#error");

generateBtn.addEventListener("click", generateHandler);
keywordInput.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
        generateBtn.click();
    }
});

function generateHandler() {
    var url = urlInput.value;
    var keyword = keywordInput.value;
    if (!url || !keyword) {
        result.value = '请输入正确信息';
    } else {
        result.value = '获取中…';
        var pattern = new RegExp("(pic\.lvmama\.com.*" + keyword + ")|(s\\d\.lvjs\.com\.cn.*" + keyword + ")");
        var urlArray = [];

        request(url, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                var $ = cheerio.load(body);
                var $resources = $('link[rel="stylesheet"], script');
                $resources.each(function(index, ele) {
                    var url = $(ele).attr('href') ? $(ele).attr('href') : $(ele).attr('src');
                    if (pattern.test(url)) {
                        urlArray.push(url);
                    }
                });
                // fs.writeFile('./result.txt', toText(urlArray), function(err) {
                //     console.log('finished');
                // });
                result.value = urlArray.length ? toText(urlArray) : '未找到对应信息';
            }
        });
    }

    function toText(arr) {
        var text = '';
        for (var i = 0; i < arr.length; i++) {
            text += generateAllUrls(arr[i]);
        }
        return text;
    }

    function generateAllUrls(url) {
        var allUrls = url.replace(/(pic\.lvmama\.com)|(s\d\.lvjs\.com\.cn)/, "pic.lvmama.com");
        allUrls = allUrls + '\n' + allUrls.replace(/pic.lvmama.com/, "s1.lvjs.com.cn") + '\n' + allUrls.replace(/pic.lvmama.com/, "s2.lvjs.com.cn") + '\n' + allUrls.replace(/pic.lvmama.com/, "s3.lvjs.com.cn") + '\n';
        return allUrls + '\n';
    }
}

function showError() {
    // overlay.style.display="block";
    error.style.visibility = "visible";
    setTimeout(function() {
        hideError();
    }, 3000);
}

function hideError() {
    // overlay.style.display="none";
    error.style.visibility = "hidden";
}
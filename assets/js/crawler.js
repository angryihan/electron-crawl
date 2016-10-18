var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var channelUrl = require('./channelUrl.js');
var option = {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
    }
}

module.exports = {
    getLinks: function(urlString, keyword, cb) {
        var linkArray = [];
        var pattern = new RegExp("(pic\.lvmama\.com.*" + keyword + ")|(s\\d\.lvjs\.com\.cn.*" + keyword + ")");
        var urlArray = urlString ? urlString.split(',') : channelUrl.channelUrlArray;
        async.eachSeries(urlArray, crawlLinks, function(err) {
            if (err) {
                console.log(err);
            } else {
                cb(linkArray.length ? toText(linkArray) : '未找到对应信息');
            }
        });

        function crawlLinks(url, callback) {
            option.url = url;
            request(option, function(error, res, body) {
                if (!error && res.statusCode == 200) {
                    var $ = cheerio.load(body);
                    var $resources = $('link[rel="stylesheet"], script');
                    $resources.each(function(index, ele) {
                        var link = $(ele).attr('href') ? $(ele).attr('href') : $(ele).attr('src');
                        if (pattern.test(link)) {
                            linkArray.push(link);
                        }
                    });
                    callback(null);
                } else {
                    callback(null);
                }
            });
        }
    }
}

function toText(arr) {
    var text = '';
    for (var i = 0; i < arr.length; i++) {
        text += generateAllLinks(arr[i]);
    }
    return text;
}

function generateAllLinks(url) {
    var allLinks = url.replace(/(pic\.lvmama\.com)|(s\d\.lvjs\.com\.cn)/, "pic.lvmama.com");
    allLinks = allLinks + '\n' + allLinks.replace(/pic.lvmama.com/, "s1.lvjs.com.cn") + '\n' + allLinks.replace(/pic.lvmama.com/, "s2.lvjs.com.cn") + '\n' + allLinks.replace(/pic.lvmama.com/, "s3.lvjs.com.cn") + '\n';
    return allLinks + '\n';
}

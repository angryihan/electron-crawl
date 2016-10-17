var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var option = {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
    }
}

var channelUrlArray = [
    'http://www.lvmama.com/',
    'http://www.lvmama.com/abroad/',
    'http://www.lvmama.com/destroute/',
    'http://www.lvmama.com/zhoubianyou/',
    'http://ticket.lvmama.com/',
    'http://hotels.lvmama.com/hotel/',
    'http://zijia.lvmama.com/',
    'http://lvyue.lvmama.com/',
    'http://youlun.lvmama.com/',
    'http://flight.lvmama.com/',
    'http://train.lvmama.com/',
    'http://www.lvmama.com/tuangou',
    'http://www.lvmama.com/company',
    'http://www.lvmama.com/lvyou/',
    'http://www.lvmama.com/localfun/',
    'http://www.lvmama.com/visa/',
    'http://www.lvmama.com/wifi/',
    'http://www.lvmama.com/intcar/',
    'http://fit.lvmama.com/',
    'http://www.lvmama.com/around/',
    'http://www.lvmama.com/freetour/',
    'http://zijia.lvmama.com/changxian',
    'http://www.lvmama.com/guide/',
    'http://www.lvmama.com/trip/',
    'http://www.lvmama.com/trip/lvyoubao',
    'http://www.lvmama.com/comment/',
    'http://www.lvmama.com/info/'
];

module.exports = {
    getLinks: function(urlString, keyword, cb) {
        var linkArray = [];
        var pattern = new RegExp("(pic\.lvmama\.com.*" + keyword + ")|(s\\d\.lvjs\.com\.cn.*" + keyword + ")");
        var urlArray = urlString ? urlString.split(',') : channelUrlArray;
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

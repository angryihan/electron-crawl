const async = require('async');
const request = require('request');
const cheerio = require('cheerio');
const channelUrl = require('./channelUrl.js');
let option = {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
    }
};

module.exports = {
    getLinks: function (urlString, keyword, cb) {
        let linkArray = [];
        let pattern = new RegExp("(.*pic\.lvmama\.com.*" + keyword + ")|(.*\.lvjs\.com\.cn.*" + keyword + ")");
        let urlArray = urlString ? urlString.split(',') : channelUrl.channelUrlArray;
        async.eachSeries(urlArray, crawlLinks, function (err) {
            if (err) {
                console.log(err);
            } else {
                cb(linkArray.length ? toText(linkArray) : '未找到对应信息');
            }
        });

        function crawlLinks(url, callback) {
            option.url = url;
            request(option, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    let $ = cheerio.load(body);
                    let $resources = $('link[rel="stylesheet"], script');
                    $resources.each(function (index, ele) {
                        let link = $(ele).attr('href') ? $(ele).attr('href') : $(ele).attr('src');
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
};

function toText(arr) {
    let text = '';
    for (let i = 0; i < arr.length; i++) {
        text += generateAllLinks(arr[i]);
    }
    return text;
}

function generateAllLinks(url) {
    let allLinks = url.replace(/(.*pic\.lvmama\.com)|(.*\.lvjs\.com\.cn)/, "http://pic.lvmama.com");
    let allLinkArr = [];
    allLinkArr.push(allLinks + '\n');
    allLinkArr.push(allLinks.replace(/.*pic.lvmama.com/, "http://s1.lvjs.com.cn") + '\n');
    allLinkArr.push(allLinks.replace(/.*pic.lvmama.com/, "http://s2.lvjs.com.cn") + '\n');
    allLinkArr.push(allLinks.replace(/.*pic.lvmama.com/, "http://s3.lvjs.com.cn") + '\n');
    allLinkArr.push(allLinks.replace(/.*pic.lvmama.com/, "https://pics.lvjs.com.cn") + '\n');
    return allLinkArr.join('') + '\n';
}

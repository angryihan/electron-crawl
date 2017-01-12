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
        let linkSet = new Set();
        let pattern = new RegExp("(.*pic\.lvmama\.com.*" + keyword + ")|(.*\.lvjs\.com\.cn.*" + keyword + ")");
        let urlArray = urlString ? urlString.split(',') : channelUrl.channelUrlArray;
        async.eachSeries(urlArray, crawlLinks, function (err) {
            if (err) {
                console.log(err);
            } else {
                cb(linkSet.size ? toText(linkSet) : '未找到对应信息');
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
                            linkSet.add(link.replace(/(.*pic\.lvmama\.com)|(.*\.lvjs\.com\.cn)/, "http://pic.lvmama.com"));
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

function toText(linkSet) {
    let text = '';
    for (let link of linkSet) {
        text += generateAllLinks(link);
    }
    return text;
}

function generateAllLinks(url) {
    let allLinksArr = [];
    allLinksArr.push(url + '\n');
    allLinksArr.push(url.replace(/.*pic.lvmama.com/, "http://s1.lvjs.com.cn") + '\n');
    allLinksArr.push(url.replace(/.*pic.lvmama.com/, "http://s2.lvjs.com.cn") + '\n');
    allLinksArr.push(url.replace(/.*pic.lvmama.com/, "http://s3.lvjs.com.cn") + '\n');
    allLinksArr.push(url.replace(/.*pic.lvmama.com/, "https://pics.lvjs.com.cn") + '\n');
    return allLinksArr.join('') + '\n';
}

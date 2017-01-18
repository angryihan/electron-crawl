const async = require('async');
const request = require('request');
const cheerio = require('cheerio');
const urlVariable = require('./urlVariable.js');
let option = {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
    }
};

module.exports = {
    getLinks: function (urlString, keyword, cb) {
        let linkSet = new Set();
        let pattern = new RegExp("(.*pic\.lvmama\.com.*" + keyword + ")|(.*\.lvjs\.com\.cn.*" + keyword + ")");
        let urlArray = urlString ? urlString.split(',') : urlVariable.channelUrlArray;
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
                            linkSet.add(link.replace(/(.*pic\.lvmama\.com)|(.*\.lvjs\.com\.cn)/, urlVariable.picPathArray[0]));
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
    for (let picPath of urlVariable.picPathArray) {
        allLinksArr.push(url.replace(/.*pic.lvmama.com/, picPath) + '\n');
    }
    return allLinksArr.join('') + '\n';
}

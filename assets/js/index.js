var crawler = require('./crawler.js');

var generateBtn = document.querySelector("#generate");
var urlInput = document.querySelector("#url");
var keywordInput = document.querySelector("#keyword");
var result = document.querySelector("#result");
// var channelCheckBox = document.querySelector("#isChannel");

generateBtn.addEventListener("click", generateHandler);
keywordInput.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
        generateBtn.click();
    }
});

function generateHandler() {
    var urlString = urlInput.value;
    var keyword = keywordInput.value;
    // var isChannel = channelCheckBox.checked;
    if (!url || !keyword) {
        result.value = '请输入正确信息';
    } else {
        result.value = '获取中，请稍候……';
        crawler.getLinks(urlString, keyword, function(res){
            result.value = res;
        });
    }
}

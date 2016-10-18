var clipboard = require('electron').clipboard;
var crawler = require('./crawler.js');

var generateBtn = document.querySelector("#generate");
var copyBtn = document.querySelector("#copy");
var urlInput = document.querySelector("#url");
var keywordInput = document.querySelector("#keyword");
var result = document.querySelector("#result");
var inputList = document.querySelectorAll(".JS-input");

// var channelCheckBox = document.querySelector("#isChannel");

var lvmamaCrawler = {
    init: function() {
        result.value = '提示：\n1.网址输入框支持多网址，以逗号分隔\n2.网址输入框为空表示搜索全站频道页';
        this.bindEvents();
    },
    bindEvents: function() {
        var self = this;
        generateBtn.addEventListener("click", self.generateHandler);
        copyBtn.addEventListener("click", self.copyHandler);
        inputList.forEach(function(input) {
            input.addEventListener("keydown", function(event) {
                if (event.keyCode == 13) {
                    self.generateHandler();
                }
            });
        });
    },
    generateHandler: function() {
        var urlString = urlInput.value;
        var keyword = keywordInput.value;
        // var isChannel = channelCheckBox.checked;
        if (!keyword) {
            result.value = '请输入关键词';
        } else {
            result.value = '获取中，请稍候……';
            crawler.getLinks(urlString, keyword, function(resultText) {
                result.value = resultText;
            });
        }
    },
    copyHandler: function() {
        clipboard.writeText(result.value);
    }
}

lvmamaCrawler.init();

const clipboard = require('electron').clipboard;
const crawler = require('./crawler.js');

const generateBtn = document.querySelector("#generate");
const copyBtn = document.querySelector("#copy");
const urlInput = document.querySelector("#url");
const keywordInput = document.querySelector("#keyword");
const result = document.querySelector("#result");
const inputList = document.querySelectorAll(".JS-input");
// const channelCheckBox = document.querySelector("#isChannel");

const lvmamaCrawler = {
    init: function() {
        result.value = '提示：\n1.网址输入框支持多网址，以逗号分隔\n2.网址输入框为空表示搜索全站频道页';
        this.bindEvents();
    },
    bindEvents: function() {
        let self = this;
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
        generateBtn.blur();
        let urlString = urlInput.value;
        let keyword = keywordInput.value;
        // var isChannel = channelCheckBox.checked;
        if (!keyword) {
            result.value = '请输入关键词';
            keywordInput.focus();
        } else {
            result.value = '获取中，请稍候……';
            crawler.getLinks(urlString, keyword, function(resultText) {
                result.value = resultText;
            });
        }
    },
    copyHandler: function() {
        copyBtn.blur();
        clipboard.writeText(result.value);
    }
}

lvmamaCrawler.init();

const clipboard = require('electron').clipboard;
const crawler = require('./crawler.js');

let generateBtn = document.querySelector("#generate");
let copyBtn = document.querySelector("#copy");
let urlInput = document.querySelector("#url");
let keywordInput = document.querySelector("#keyword");
let result = document.querySelector("#result");
let inputList = document.querySelectorAll(".JS-input");
// var channelCheckBox = document.querySelector("#isChannel");

let lvmamaCrawler = {
    init: function () {
        result.value = '提示：\n1.网址输入框支持多网址，以逗号分隔\n2.网址输入框为空表示搜索全站频道页';
        this.bindEvents();
    },
    bindEvents: function () {
        let self = this;
        generateBtn.addEventListener("click", self.generateHandler);
        copyBtn.addEventListener("click", self.copyHandler);
        inputList.forEach(function (input) {
            input.addEventListener("keydown", function (event) {
                if (event.keyCode == 13) {
                    self.generateHandler();
                }
            });
        });
    },
    generateHandler: function () {
        generateBtn.blur();
        let urlString = urlInput.value;
        let keyword = keywordInput.value;
        // var isChannel = channelCheckBox.checked;
        if (!keyword) {
            result.value = '请输入关键词';
            keywordInput.focus();
        } else {
            result.value = '获取中，请稍候……';
            crawler.getLinks(urlString, keyword, function (resultText) {
                result.value = resultText;
            });
        }
    },
    copyHandler: function () {
        copyBtn.blur();
        clipboard.writeText(result.value);
    }
};

lvmamaCrawler.init();

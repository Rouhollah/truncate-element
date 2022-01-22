"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.TruncateElement = void 0;
var TruncateElement = /** @class */ (function (_super) {
    __extends(TruncateElement, _super);
    function TruncateElement() {
        var _this = _super.call(this) || this;
        _this._highlightQuery = [];
        _this.config = {
            number: 0,
            more: "",
            less: "",
            completeWord: false,
            hashtag: false,
            hasLiteral: false,
            highlightCondition: 'exactly',
            highlightList: [{ name: '', color: '' }],
            text: ""
        };
        _this.number = 0;
        _this.more = "";
        _this.less = "";
        _this.completeWord = false;
        _this.hashtag = false;
        _this.hasLiteral = false;
        _this.highlightCondition = 'exactly';
        _this.highlightList = [{ name: '', color: '' }];
        _this.text = "";
        _this.replace = false;
        return _this;
    }
    TruncateElement.prototype.instanceOfHighlighQuery = function (object) {
        return typeof object === 'string' ? false : 'name' in object;
    };
    TruncateElement.prototype.connectedCallback = function () {
        var _this = this;
        setTimeout(function () {
            _this._highlightQuery.sort(function (a, b) {
                if (_this.instanceOfHighlighQuery(a) && _this.instanceOfHighlighQuery(b))
                    return a.name.length - b.name.length;
                else if (typeof a === 'string' && _this.instanceOfHighlighQuery(b))
                    return a.length - b.name.length;
                else if (_this.instanceOfHighlighQuery(b) && typeof a === 'string')
                    return a.length - b.name.length;
                else if (typeof b === 'string' && typeof a === 'string') {
                    return a.length - b.length;
                }
                else
                    return 0;
            });
            //console.log(this._highlightQuery);  
            _this.fill(_this.innerHTML);
        }, 0);
        var conf = this.getAttribute('config');
        if (conf === null || conf === void 0 ? void 0 : conf.length) {
            this.config = JSON.parse(conf);
            this.number = this.config.number;
            this.more = this.config.more;
            this.less = this.config.less;
            this._highlightQuery = this.config.highlightList;
            this.highlightCondition = this.config.highlightCondition;
            this.completeWord = this.config.completeWord;
            this.hashtag = this.config.hashtag;
            this.hasLiteral = this.config.hasLiteral;
        }
        else
            return;
    };
    TruncateElement.prototype.fill = function (text) {
        var _this = this;
        //console.log(text);
        if (!this.hasLiteral)
            text = text.replace(/(\r\n\t|\n|\r\t)/gm, ' ');
        this.text = text;
        var remainText = "";
        if (text.length > this.number) {
            remainText = this.applyCondition(text, this.number, this.completeWord, this.hashtag);
            remainText = this.highlight(remainText, this.highlightCondition, this._highlightQuery);
            // برای نمایش ادامه یا پنهان
            this.replace = true;
            this.innerHTML = remainText + ' ... ';
            var span = document.createElement('span');
            span.innerHTML = this.more;
            span.style.color = '#ff00ff';
            span.style.cursor = 'pointer';
            span.classList.add("toggleText");
            this.innerHTML = remainText + "... ";
            span.addEventListener('click', function (event) { return _this.replace === true ? _this.showFullText(event) : _this.hideSomeText(event); });
            this.appendChild(span);
        }
        else {
            text = this.hashtag ? this.findHashtag(text) : text;
            text = this.highlight(text, this.highlightCondition, this._highlightQuery);
            this.innerHTML = text;
        }
        //اعمال شود این کلاس قرار داده می شود  html در \n برای اینکه کاراکتر های
        if (this.hasLiteral)
            this.style.whiteSpace = 'pre-line';
    };
    /*
     * نمایش کامل متن
     * @param mouseDown {mousedown} mouse event
     */
    TruncateElement.prototype.showFullText = function (mouseDown) {
        var _this = this;
        var span = document.createElement('span');
        span.innerHTML = " " + this.less;
        span.style.color = '#ff00ff';
        span.style.cursor = 'pointer';
        span.classList.add("toggleText");
        var fullText = this.hashtag ? this.findHashtag(this.text) : this.text;
        this.innerHTML = this.highlight(fullText, this.highlightCondition, this._highlightQuery);
        //اعمال شود این کلاس قرار داده می شود  html در \n برای اینکه کاراکتر های
        if (this.hasLiteral)
            this.style.whiteSpace = 'pre-line';
        span.addEventListener('click', function (event) { return _this.hideSomeText(event); });
        this.appendChild(span);
        // جلوگیری از کلیک روی عنصر پدر
        mouseDown.stopPropagation();
        this.replace = false;
    };
    /*
     * نمایش قسمتی از متن بر اساس تعداد کاراکتر خواسته شده
     * @param mouseDown {mousedown} mouse event
     */
    TruncateElement.prototype.hideSomeText = function (mouseDown) {
        var _this = this;
        var temp = this.applyCondition(this.text, this.number, this.completeWord, this.hashtag);
        var remainText = this.highlight(temp, this.highlightCondition, this._highlightQuery);
        var span = document.createElement('span');
        span.style.color = '#ff00ff';
        span.classList.add("toggleText");
        span.innerHTML = this.more;
        this.innerHTML = remainText + ' ... ';
        //اعمال شود این کلاس قرار داده میشود  html در  n \برای اینکه کاراکتر های
        if (this.hasLiteral)
            this.style.whiteSpace = 'pre-line';
        span.addEventListener('click', function (event) { return _this.showFullText(event); });
        this.appendChild(span);
        // جلوگیری از کلیک روی عنصر پدر
        mouseDown.stopPropagation();
        this.replace = true;
    };
    /**
     * رنگ کردن کلمات داده شده در متن
     * @param content
     */
    TruncateElement.prototype.highlight = function (content, highlightCondition, highlightQuery) {
        if (highlightCondition === void 0) { highlightCondition = ""; }
        //روی دایرکتیو تعریف نشود خود متن را بر می کرداند highlightList اگر ورودی
        if (!highlightQuery.length) {
            return content;
        }
        // دقیقا یافت می شود  highlightList روی دایرکتیو تعریف نشود کلمات داده شده در highlightCondition اگر ورودی
        if (highlightCondition == "exactly") {
            var _loop_1 = function (q) {
                var pattern = '';
                //به صورت آبجکت باشند highlightList اگر کلمات داده شده در
                if (q.hasOwnProperty('name')) {
                    pattern = "(^|(?<!\\p{L}))(" + q.name + ")(?!(\\p{L}))";
                    content = content.replace(new RegExp(pattern, 'gmu'), function (match) {
                        return "<span style=\"background:".concat(q.color, "\">").concat(match, "</span>");
                    });
                }
                //به صورت رشته باشند highlightList اگر کلمات داده شده در
                else {
                    pattern = "(^|(?<!\\p{L}))(" + q + ")(?!(\\p{L}))";
                    content = content.replace(new RegExp(pattern, 'gmu'), function (match) {
                        return "<span style=\"background:yellow\">".concat(match, "</span>");
                    });
                }
            };
            for (var _i = 0, highlightQuery_1 = highlightQuery; _i < highlightQuery_1.length; _i++) {
                var q = highlightQuery_1[_i];
                _loop_1(q);
            }
            return content;
        }
        //هر مشابهی از کلمات در متن پیدا شده و رنگ می شوند
        else {
            for (var _a = 0, highlightQuery_2 = highlightQuery; _a < highlightQuery_2.length; _a++) {
                var q = highlightQuery_2[_a];
                //به صورت آبجکت باشند highlightList اگر کلمات داده شده در
                if (q.hasOwnProperty('name')) {
                    var words = content.match(new RegExp(q.name, "gmi"));
                    if (words)
                        for (var _b = 0, words_1 = words; _b < words_1.length; _b++) {
                            var word = words_1[_b];
                            content = content.replace(new RegExp(q.name, "gmi"), "<span style=\"background-color:".concat(q.color, "\">").concat(word, "</span>"));
                        }
                }
                //به صورت رشته باشند highlightList اگر کلمات داده شده در
                else {
                    if (typeof q === 'string') {
                        var words = content.match(new RegExp(q, "gmi"));
                        if (words)
                            for (var _c = 0, words_2 = words; _c < words_2.length; _c++) {
                                var word = words_2[_c];
                                content = content.replace(new RegExp(q, "gmi"), "<span style=\"background-color:yellow\">".concat(word, "</span>"));
                            }
                    }
                }
            }
            return content;
        }
    };
    /** check the word cut */
    TruncateElement.prototype.checkWordCut = function (number, text) {
        var i = 0;
        for (i = number; i < text.length; i++) {
            if (text[i] == ' ')
                break;
        }
        return text.substring(0, i);
    };
    /** find hashtag from text */
    TruncateElement.prototype.findHashtag = function (text) {
        var pattern = "^|[s](#[p{Pc}p{N}p{L}\u200C\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8(_)]+)";
        text = text.replace(new RegExp(pattern, 'ugmi'), function (match) {
            //text = text.replace(/(^|\s)(#[\p{Pc}\p{N}\p{L}\u200cÀ-ÖØ-öø-ʸ(_)]+)/ugmi, (match) => {
            return "<span class=\"hashtag\" style=\"color:#1b95e0\">".concat(match, "</span>");
        });
        return text;
    };
    /** check conditions and return text with them */
    TruncateElement.prototype.applyCondition = function (text, number, completeWord, hashtag) {
        if (completeWord === void 0) { completeWord = false; }
        if (hashtag === void 0) { hashtag = false; }
        var manipulatedText = "";
        if (completeWord && hashtag) {
            var temp = this.checkWordCut(number, text);
            manipulatedText = this.findHashtag(temp);
        }
        else if (completeWord) {
            manipulatedText = this.checkWordCut(number, text);
        }
        else if (hashtag) {
            var temp = text.substring(0, number);
            manipulatedText = this.findHashtag(temp);
        }
        else {
            manipulatedText = text.substring(0, number);
        }
        return manipulatedText;
    };
    return TruncateElement;
}(HTMLElement));
exports.TruncateElement = TruncateElement;
customElements.define('truncate-element', TruncateElement);

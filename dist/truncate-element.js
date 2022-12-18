(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("truncate-element", [], factory);
	else if(typeof exports === 'object')
		exports["truncate-element"] = factory();
	else
		root["truncate-element"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Hashtag": () => (/* reexport */ Hashtag),
  "Highlight": () => (/* reexport */ Highlight),
  "Link": () => (/* reexport */ Link),
  "Mention": () => (/* reexport */ Mention),
  "NullModel": () => (/* reexport */ NullModel),
  "ProccessModel": () => (/* reexport */ ProccessModel),
  "TruncateElement": () => (/* reexport */ TruncateElement),
  "WordCut": () => (/* reexport */ WordCut),
  "WordModel": () => (/* reexport */ WordModel)
});

;// CONCATENATED MODULE: ./src/services.ts
class ProccessModel {
    constructor(_config) { }
}
class WordModel {
    constructor(word) {
        this.word = "";
        this.length = 0;
        this.type = "simple";
        this.html = "";
        this.word = word;
        this.length = word.length;
    }
}
class WordCut {
    /**
     * create an instance of WordCut with desired number
     * @param num number
     */
    constructor(num) {
        this.Number = num;
    }
    /**
     * truncate the string to the desired number
     * @param text string
     * @returns string
     */
    cut(text) {
        let i = 0;
        for (i = this.Number; i < text.length; i++) {
            if (text[i] == ' ')
                break;
        }
        return text.substring(0, i);
    }
}
class Link extends ProccessModel {
    constructor(_config) {
        super(_config);
        this.LinkCount = 0;
        this.LinkList = [];
        if (_config.identifyLink)
            this.IdentifyLink = _config.identifyLink;
        else
            this.IdentifyLink = {
                enabled: false
            };
    }
    ;
    /**
     * process model for identifying links
     * @param model WordModel class
     * @returns WordModel
     */
    process(model) {
        // main regex
        // regex = /(^|[ ])(ftp:\/\/|(https?:)\/\/(www\\.)?|www\.)[0-9a-zA-Z]([-.\w]+)(((\:|\/|\?){1}\S*)*|\w+)+/gm
        let regex;
        let protocolRegex = "(ftp:\\/\\/|(https?:)\\/\\/(www\\.)?|www\\.)";
        let domainRegex = "";
        let queryString = "\\w+";
        const afterDomain = "(((\\:|\\/|\\?){1}\\S*)*|\\w+)+";
        if (this.IdentifyLink.protocol && this.IdentifyLink.protocol.length > 0)
            protocolRegex = this.recognizingProtocol();
        if (this.IdentifyLink.domain && this.IdentifyLink.domain.length > 0)
            domainRegex = this.recongnizingDomain();
        if (this.IdentifyLink.hasQueryString)
            queryString = afterDomain;
        regex = new RegExp(`(^|[ ])${protocolRegex}[0-9a-zA-Z]([-.\\w]+)${domainRegex}${queryString}`, 'gm');
        let m;
        while ((m = regex.exec(model.word)) !== null) {
            this.LinkList.push(m[0]);
            let protocol = m[0];
            if (m[0].substring(0, 3) === 'www') {
                protocol = 'http://' + m[0];
            }
            model.html = `<a href=${protocol} ${this.IdentifyLink.target ? "target=" + this.IdentifyLink.target : ''} ${this.IdentifyLink.title ? "title=" + this.IdentifyLink.title : ''} ${this.IdentifyLink.class ? "class=" + '"' + this.IdentifyLink.class + '"' : ''} ${this.IdentifyLink.style ? "style=" + this.IdentifyLink.style : ''}>${model.html ? model.html : model.word}</a>`;
            model.type += ' link';
        }
        return model;
    }
    /** create regex for prefix | protocol
     * @returns {string} regex
     */
    recognizingProtocol() {
        if (this.IdentifyLink.protocol && this.IdentifyLink.protocol.length > 0) {
            this.IdentifyLink.protocol = this.IdentifyLink.protocol.sort();
            let protocol = [];
            if (this.IdentifyLink.protocol.find(p => p === 'ftp')) {
                protocol.push("ftp:\\/\\/");
            }
            if (this.IdentifyLink.protocol.find(p => p === 'http')) {
                protocol.push(`http:\\/\\/(www\\.)?`);
            }
            if (this.IdentifyLink.protocol.find(p => p === 'https')) {
                protocol.push(`https:\\/\\/(www\\.)?`);
            }
            if (this.IdentifyLink.protocol.find(p => p === 'www')) {
                protocol.push("www\\.?");
            }
            return "(" + protocol.join('|') + ")";
        }
        return "";
    }
    /** create regex for domain
     * @returns {string} regex
     */
    recongnizingDomain() {
        return this.IdentifyLink.domain ? "(" + this.IdentifyLink.domain.join('|') + ")" : "";
    }
}
class Mention extends ProccessModel {
    /**
     * process model for identifying mentions
     * @param model {class} WordModel
     * @returns WordModel
     */
    process(model) {
        const pattern = /(^|\s)(@[^\d\.\s](\w{1,30}|\.)+)$/gmi;
        if (pattern.test(model.word)) {
            model.type += ' mention';
            model.html = `<span class=mention style=color:#0095f6>${model.html ? model.html : model.word}</span>`;
        }
        return model;
    }
}
class Hashtag extends ProccessModel {
    /**
     * process model for identifying hashtags
     * @param model {class} WordModel
     * @returns WordModel
     */
    process(model) {
        const pattern = /(^|\s)(#[\p{Pc}\p{N}\p{L}\u200cÀ-ÖØ-öø-ʸ(_)]+)$/gmui;
        if (pattern.test(model.word)) {
            model.html = `<span class=hashtag style=color:#1b95e0>${model.html ? model.html : model.word}</span>`;
            model.type += ' hashtag';
        }
        return model;
    }
}
class Highlight extends ProccessModel {
    constructor(_config) {
        super(_config);
        this.highlightQuery = [];
        this.highlightCondition = '';
        this.nestedHighlightArray = [];
        this.checkedNestedHighlight = false;
        window.highlight = this;
        if (_config.highlightList) {
            this.highlightQuery = _config.highlightList.map((h) => {
                let high = {};
                if (this.instanceOfHighlighQuery(h)) {
                    high.name = h.name;
                    high.color = h.color;
                }
                else {
                    high.name = h;
                    high.color = 'yellow';
                }
                high.tag = '';
                high.index = 0;
                high.existInAnotherQuery = false;
                high.parent = '';
                high.parentTag = '';
                high.content = '';
                return high;
            });
        }
        else {
            this.highlightQuery = [];
        }
        this.highlightCondition = _config.highlightCondition;
        if (this.highlightQuery.length) {
            this.highlightQuery.sort((a, b) => {
                return a.name.length - b.name.length;
            });
        }
        if (!this.checkedNestedHighlight)
            this.nestedHighlightArray = this.findHighlightInAnother();
        else
            this.nestedHighlightArray = [];
    }
    /**
    * finds words in highlightQuery array and color them
    * @returns Array<Sible>
    */
    findHighlightInAnother() {
        const firstElement = this.highlightQuery[0];
        firstElement.tag = this.createTag(firstElement.color, firstElement.name);
        firstElement.existInAnotherQuery = false;
        firstElement.content = '';
        firstElement.parent = '';
        firstElement.parentTag = '';
        for (let i = 1; i < this.highlightQuery.length; i++) {
            const currentElement = this.highlightQuery[i];
            const perviousElement = this.highlightQuery[i - 1];
            if (currentElement.name.includes(perviousElement.name)) {
                this.transform(currentElement, perviousElement);
                continue;
            }
            else {
                let j = i;
                while (j >= 1) {
                    let pervious = this.highlightQuery[j - 1];
                    if (currentElement.name.includes(pervious.name)) {
                        this.transform(currentElement, pervious);
                        break;
                    }
                    else if (j == 1) {
                        currentElement.tag = this.createTag(currentElement.color, currentElement.name);
                        currentElement.content = '';
                        currentElement.parent = '';
                        currentElement.parentTag = '';
                    }
                    j--;
                }
            }
        }
        const nestedArray = this.highlightQuery.filter(m => m.existInAnotherQuery);
        this.highlightQuery = this.highlightQuery.filter(m => !m.existInAnotherQuery);
        //console.log('highlightQuery=>', this.highlightQuery, 'nestedArray=>', nestedArray);
        this.checkedNestedHighlight = true;
        return nestedArray;
    }
    transform(current, pervious) {
        // name of current object is parent for pervious object
        pervious.parent = current.name;
        current.content = current.name.replace(pervious.name, pervious.tag);
        pervious.parentTag = this.createTag(current.color, current.content);
        current.tag = pervious.parentTag;
        pervious.existInAnotherQuery = true;
        current.existInAnotherQuery = false;
    }
    /** is object instance of HighlighQuery
     * @param {object}  object to check
     * @returns {boolean} true or false
    */
    instanceOfHighlighQuery(object) {
        return typeof object === 'string' ? false : 'name' in object;
    }
    /**
        * process model for highlighting
        * @param model WordModel class
        * @returns WordModel
        */
    process(model) {
        if (!this.highlightQuery || !this.highlightQuery.length) {
            return model;
        }
        if (this.highlightCondition == "exactly") {
            for (let q of this.highlightQuery) {
                if (q.name.length > model.length)
                    continue;
                const pattern = "(^|(?<!\\p{L}))(" + q.name + ")(?!(\\p{L}))";
                const regex = new RegExp(pattern, 'gmu');
                if (regex.test(model.word)) {
                    regex.lastIndex = 0;
                    model.html = this.createTag(q.color, q.name);
                    model.type = model.type.concat(' highlight');
                }
                return model;
            }
            return model;
        }
        else {
            if (this.nestedHighlightArray.length) {
                for (let i = this.nestedHighlightArray.length; i--; i == 0) {
                    const nested = this.nestedHighlightArray[i];
                    const regex = new RegExp(nested.name, 'gmi');
                    if (regex.test(model.word)) {
                        regex.lastIndex = 0;
                        model.html = model.word.replace(new RegExp(nested.name, 'gm'), nested.tag);
                        // return model;
                        break;
                    }
                }
            }
            if (this.highlightQuery.length) {
                for (const q of this.highlightQuery) {
                    const regex = new RegExp(q.name, 'gmi');
                    if (regex.test(model.word)) {
                        regex.lastIndex = 0;
                        if (model.html && model.html.split(q.name).length == 1) {
                            model.html = model.word.replace(new RegExp(q.name, 'gmu'), q.tag);
                        }
                        else if (model.html) {
                            let tag = model.html.split(q.name);
                            for (let index = 0; index < tag.length; index++) {
                                if (index == tag.length - 1)
                                    break;
                                tag[index] = tag[index] + q.tag;
                            }
                            model.html = tag.join('');
                        }
                        else {
                            model.html = model.word.replace(new RegExp(q.name, 'gmu'), match => {
                                return `<span style="background:${q.color}">${match}</span>`;
                            });
                        }
                    }
                }
            }
            return model;
        }
    }
    /**
     * create span tag with favorite color
     * @param color
     * @param word
     * @returns string
     */
    createTag(color, word) {
        return `<span style="background:${color}">${word}</span>`;
    }
}
class NullModel extends ProccessModel {
    /**
     * get string and convert to WordModel
     * @param model WordModel class
     * @returns WordModel
     */
    process(word) {
        return new WordModel(word);
    }
}

;// CONCATENATED MODULE: ./src/truncate-element.ts

class TruncateElement extends HTMLElement {
    constructor() {
        super();
        this._highlightQuery = [];
        this.config = {
            number: 0,
            more: "",
            less: "",
            completeWord: false,
            hashtag: false,
            hasLiteral: false,
            highlightCondition: 'exactly',
            highlightList: [{ name: '', color: '' }],
            mention: false,
        };
        this.number = 100;
        this.more = "show";
        this.less = "hide";
        this.completeWord = false;
        this.hashtag = false;
        this.hasLiteral = false;
        this.highlightCondition = 'exactly';
        this.highlightList = [{ name: '', color: '' }];
        this.text = "";
        /** to display show or hide button*/
        this.truncated = false;
        this.mention = false;
        this.identifyLink = {
            hasQueryString: false,
            title: "",
            class: "",
            style: "text-decoration:none;color:blue;",
            domain: [],
            protocol: [],
            target: "_blank",
            enabled: false
        };
        this.userModels = [];
        this.linkList = [];
        this.linkCount = 0;
        this.hashtagCount = 0;
        this.mentionCount = 0;
        this.connectedLoaded = false;
        this.dataLoaded = false;
        this.tempHtml = "";
        this.wordArray = [];
        this.remainText = "";
        this.fullText = "";
        this.truncatedWord = { model: new WordModel(''), index: 0 };
        this.processModels = [];
        window.trun = this;
        const observer = new MutationObserver(() => {
            if (this.connectedLoaded && !this.dataLoaded) {
                this.initialValues();
            }
        });
        // call 'observe' on that MutationObserver instance, 
        // passing it the element to observe, and the options object
        observer.observe(this, { characterData: false, childList: true, attributes: false });
    }
    addUserModel(...userModel) {
        this.userModels.push(...userModel.map(f => ({ model: f })));
    }
    connectedCallback() {
        setTimeout(() => {
            this.initialValues();
        }, 0);
        this.connectedLoaded = true;
    }
    attributeChangedCallback(attrName, _oldVal, _newVal) {
        if (this.connectedLoaded) {
            this.initialValues(attrName);
        }
    }
    static get observedAttributes() {
        return ['config'];
    }
    /** initial values */
    initialValues(attrName = "config") {
        if (!this.innerHTML) {
            return;
        }
        if (!this.tempHtml) {
            this.tempHtml = this.innerHTML;
        }
        const conf = this.getAttribute(attrName);
        if (conf === null || conf === void 0 ? void 0 : conf.length) {
            this.config = JSON.parse(conf);
            this.number = this.config.number ? this.config.number : this.number;
            this.more = this.config.more ? this.config.more : this.more;
            this.less = this.config.less ? this.config.less : this.less;
            this._highlightQuery = this.config.highlightList ? this.config.highlightList : this._highlightQuery;
            this.highlightCondition = this.config.highlightCondition ? this.config.highlightCondition : this.highlightCondition;
            this.completeWord = this.config.completeWord ? this.config.completeWord : this.completeWord;
            this.hashtag = this.config.hashtag ? this.config.hashtag : this.hashtag;
            this.hasLiteral = this.config.hasLiteral ? this.config.hasLiteral : this.hasLiteral;
            this.mention = this.config.mention ? this.config.mention : this.mention;
            if (this.config.identifyLink) {
                this.identifyLink.enabled = this.config.identifyLink.enabled;
                this.identifyLink.title = this.config.identifyLink.title ? this.config.identifyLink.title : this.identifyLink.title;
                this.identifyLink.class = this.config.identifyLink.class ? this.config.identifyLink.class : this.identifyLink.class;
                this.identifyLink.style = this.config.identifyLink.style ? this.config.identifyLink.style : this.identifyLink.style;
                this.identifyLink.domain = this.config.identifyLink.domain ? this.config.identifyLink.domain : this.identifyLink.domain;
                this.identifyLink.protocol = this.config.identifyLink.protocol ? this.config.identifyLink.protocol : this.identifyLink.protocol;
                this.identifyLink.target = this.config.identifyLink.target ? this.config.identifyLink.target : this.identifyLink.target;
                this.identifyLink.hasQueryString = this.config.identifyLink.hasQueryString ? this.config.identifyLink.hasQueryString : this.identifyLink.hasQueryString;
            }
        }
        else
            return;
        this.main(this.tempHtml);
        this.dataLoaded = true;
    }
    /** main method, start working
    * @param text {string}
    */
    main(text) {
        if (!this.hasLiteral)
            text = text.replace(/(\r\n\t|\r\n|\n|\r\t)/gm, ' ');
        this.text = text;
        if (text.length > this.number) {
            this.truncated = true;
            const wordCut = new WordCut(this.number);
            if (this.completeWord)
                text = wordCut.cut(text);
            else {
                text = text.substring(0, this.number);
                const last = this.text.split(" ")[text.split(" ").length - 1];
                this.truncatedWord.model = this.reviewTruncatedWordHasLink(last);
                this.truncatedWord.index = text.split(" ").length - 1;
            }
        }
        // all necessary classes
        this.processModels = this.generateModels();
        // just once calling each class
        const instances = this.callOnceClasses();
        const cuttedArray = text.split(" ");
        const fullArray = this.text.split(" ");
        const _cuttedwords = this.createWordModelFromString(cuttedArray);
        const _fullwords = this.createWordModelFromString(fullArray);
        //process all attributes of config and user models defined for each word
        const remain = this.proccessOnWordModels(_cuttedwords, instances);
        const full = this.proccessOnWordModels(_fullwords, instances);
        if (remain.length) {
            this.remainText = remain.map(m => m.html ? m.html : m.word).join(" ") + " ... ";
            if (!this.completeWord) {
                const l = remain.pop();
                if (l && this.truncatedWord.model.type.includes('link')) {
                    const replacement = this.truncatedWord.model.word;
                    this.remainText = this.remainText.replace(new RegExp(`<a href=${l.word} `), `<a href=${replacement} `);
                }
            }
        }
        else {
            this.remainText = text + " ... ";
        }
        if (full.length)
            [
                this.fullText = full.map(m => m.html ? m.html : m.word).join(" ")
            ];
        else {
            this.fullText = this.text;
        }
        this.truncated ? this.initialText(this.remainText, this.more) : this.initialText(this.fullText);
        //This class is placed in order to apply \n characters in html
        if (this.hasLiteral)
            this.style.whiteSpace = 'pre-line';
    }
    /**
     * once calling each class
     * @returns
     */
    callOnceClasses() {
        const instances = [];
        for (const gm of this.processModels) {
            instances.push(new gm.model(this.config));
        }
        return instances;
    }
    /**
     * review if the word is truncated has link or not
     * @param word string
     * @returns WordModel
     */
    reviewTruncatedWordHasLink(word) {
        const link = new Link(this.config);
        return link.process(new WordModel(word));
    }
    /**
     * finally process all attributes of config and user models defined for each word
     * @param _words WordModel[]
     * @param instances ProccessModel[]
     * @returns WordModel[]
     */
    proccessOnWordModels(_words, instances) {
        for (let word of _words) {
            for (const gm of instances) {
                if (word.length == 0)
                    continue;
                word = gm.process(word);
            }
        }
        return _words;
    }
    /**
     * create WordModel class of each wrod
     * @param array {string[]}
     * @returns string[]
     */
    createWordModelFromString(array) {
        const _words = [];
        const nullModel = new NullModel(this.config);
        for (const word of array) {
            _words.push(nullModel.process(word));
        }
        return _words;
    }
    /**
     * generate necessary classes for each word
     * @returns GeneralModel[]
     */
    generateModels() {
        var _a, _b, _c;
        const generalModels = [];
        if ((_a = this.config.highlightList) === null || _a === void 0 ? void 0 : _a.length)
            generalModels.push({ model: Highlight });
        if ((_b = this.config.identifyLink) === null || _b === void 0 ? void 0 : _b.enabled)
            generalModels.push({ model: Link });
        if (this.config.hashtag)
            generalModels.push({ model: Hashtag });
        if (this.config.mention)
            generalModels.push({ model: Mention });
        if ((_c = this.userModels) === null || _c === void 0 ? void 0 : _c.length) {
            this.userModels.forEach(user => {
                generalModels.push(user);
            });
        }
        return generalModels;
    }
    /**
     * display text in first time
     * @param text
     * @param toggle
     */
    initialText(text, toggle) {
        if (toggle) {
            const span = this.createSpan(toggle);
            this.innerHTML = text;
            this.appendChild(span);
        }
        else
            this.innerHTML = text;
    }
    /**
     * display string after click on toggle text
     * @param text string
     * @param mouseDown mouse event
     */
    showText(text, mouseDown) {
        this.truncated = !this.truncated;
        const span = this.createSpan(this.truncated ? this.more : this.less);
        this.innerHTML = text;
        if (this.hasLiteral)
            this.style.whiteSpace = 'pre-line';
        mouseDown.stopPropagation();
        this.appendChild(span);
    }
    /**
     * create span for toggling
     * @param toggle custom word for toggle
     * @returns
     */
    createSpan(toggle) {
        const span = document.createElement('span');
        span.innerHTML = ' ' + toggle;
        span.style.color = '#ff00ff';
        span.style.cursor = 'pointer';
        span.classList.add("toggleText");
        span.addEventListener('click', (event) => this.showText(this.truncated ? this.fullText : this.remainText, event));
        return span;
    }
}
if (!customElements.get('truncate-element')) {
    customElements.define('truncate-element', TruncateElement);
}

;// CONCATENATED MODULE: ./src/index.ts




/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=truncate-element.js.map
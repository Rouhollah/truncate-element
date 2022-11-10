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
        this.nestedHighlightArray = this.findHighlightInAnother();
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
            if (this.nestedHighlightArray.length || this.highlightQuery.length) {
                for (const nested of this.nestedHighlightArray) {
                    const regex = new RegExp(nested.parent, 'gmi');
                    if (regex.test(model.word)) {
                        regex.lastIndex = 0;
                        model.html = model.word.replace(new RegExp(nested.parent, 'gm'), nested.parentTag);
                    }
                    this.highlightQuery = this.highlightQuery.filter((h) => !h.existInAnotherQuery).filter((h) => h.name != nested.parent);
                }
                for (const q of this.highlightQuery) {
                    const regex = new RegExp(q.name, 'gmi');
                    if (regex.test(model.word)) {
                        regex.lastIndex = 0;
                        if (model.html) {
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
                if (model.html) {
                    model.type = model.type.concat(' highlight');
                    return model;
                }
                return model;
            }
            else
                return model;
        }
    }
    /** is object instance of HighlighQuery
     * @param {object}  object to check
     * @returns {boolean} true or false
    */
    instanceOfHighlighQuery(object) {
        return typeof object === 'string' ? false : 'name' in object;
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
    /**
     * finds words in highlightQuery array and color them
     * @returns Array<Sible>
     */
    findHighlightInAnother() {
        const sibling = [];
        this.highlightQuery.forEach((q) => {
            for (let i = 0; i < this.highlightQuery.length; i++) {
                const element = this.highlightQuery[i];
                if (q.name.length >= element.name.length) {
                    q.tag = this.createTag(q.color, q.name);
                    q.existInAnotherQuery = false;
                    continue;
                }
                if (element.name.includes(q.name)) {
                    q.existInAnotherQuery = true;
                    const s = sibling.find((s) => s.parent == element.name);
                    if (s) {
                        q.tag = this.createTag(q.color, q.name);
                        q.index = element.name.indexOf(q.name);
                        s.children.push(q);
                    }
                    else {
                        const obj = {
                            parent: '',
                            parentTag: '',
                            children: []
                        };
                        obj.parent = element.name;
                        q.tag = this.createTag(q.color, q.name);
                        q.index = element.name.indexOf(q.name);
                        obj.children.push(q);
                        sibling.push(obj);
                    }
                }
            }
        });
        sibling.forEach((element) => {
            let parent = element.parent;
            element.children.sort((a, b) => a.index - b.index).forEach((child, i) => {
                const pattern = new RegExp(child.name, 'gm');
                const from = i == 0 ? parent.indexOf(child.name) : element.children[i - 1].tag.length;
                parent = this.replaceAfterIndex(parent, pattern, child.tag, from);
            });
            element.parentTag = this.createTag(this.highlightQuery.find((h) => h.name == element.parent).color, parent);
        });
        return sibling;
    }
    /**
     * replace words after specific index
     * @param text string
     * @param regex search
     * @param string replace
     * @param number from
     * @returns string
     */
    replaceAfterIndex(text, search, replace, from) {
        if (text.length > from) {
            return text.slice(0, from) + text.slice(from).replace(search, replace);
        }
        return text;
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
        this.replaceString = "***";
        this.connectedLoaded = false;
        this.dataLoaded = false;
        this.tempHtml = "";
        this.wordArray = [];
        this.remainText = "";
        this.fullText = "";
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
        var _a, _b, _c;
        if (!this.hasLiteral)
            text = text.replace(/(\r\n\t|\r\n|\n|\r\t)/gm, ' ');
        this.text = text;
        this.wordArray = text.split(" ").filter(f => this.hasLiteral ? true : f.length > 0);
        const processModels = [];
        const _words = [];
        const nullModel = new NullModel(this.config);
        for (const word of this.wordArray) {
            _words.push(nullModel.process(word));
        }
        if ((_a = this.config.highlightList) === null || _a === void 0 ? void 0 : _a.length) {
            processModels.push({ model: Highlight });
        }
        if ((_b = this.config.identifyLink) === null || _b === void 0 ? void 0 : _b.enabled)
            processModels.push({ model: Link });
        if (this.config.hashtag)
            processModels.push({ model: Hashtag });
        if (this.config.mention)
            processModels.push({ model: Mention });
        if ((_c = this.userModels) === null || _c === void 0 ? void 0 : _c.length) {
            this.userModels.forEach(user => {
                processModels.push(user);
            });
        }
        for (let model of _words) {
            for (const gm of processModels) {
                const wm = new gm.model(this.config);
                if (model.length == 0)
                    continue;
                model = wm.process(model);
            }
        }
        if (text.length > this.number) {
            this.truncated = true;
            const wordCut = new WordCut(this.number);
            text = this.completeWord ? wordCut.cut(text) : text.substring(0, this.number);
        }
        if (_words.length) {
            this.remainText = _words.slice(0, text.split(" ").length).map(m => m.html ? m.html : m.word).join(" ") + " ... ";
            this.fullText = _words.map(m => m.html ? m.html : m.word).join(" ");
        }
        else {
            this.remainText = text + " ... ";
            this.fullText = this.text;
        }
        this.truncated ? this.initialText(this.remainText, this.more) : this.initialText(this.fullText);
        //اعمال شود این کلاس قرار داده می شود  html در \n برای اینکه کاراکتر های
        if (this.hasLiteral)
            this.style.whiteSpace = 'pre-line';
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
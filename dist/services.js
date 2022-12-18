export class ProccessModel {
    constructor(_config) { }
}
export class WordModel {
    constructor(word) {
        this.word = "";
        this.length = 0;
        this.type = "simple";
        this.html = "";
        this.word = word;
        this.length = word.length;
    }
}
export class WordCut {
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
export class Link extends ProccessModel {
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
export class Mention extends ProccessModel {
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
export class Hashtag extends ProccessModel {
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
export class Highlight extends ProccessModel {
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
export class NullModel extends ProccessModel {
    /**
     * get string and convert to WordModel
     * @param model WordModel class
     * @returns WordModel
     */
    process(word) {
        return new WordModel(word);
    }
}
//# sourceMappingURL=services.js.map
import { HighlighQuery, Config, IdentifyLink } from "./interfaces";
export { Config, HighlighQuery, IdentifyLink } from "./interfaces"

export class TruncateElement extends HTMLElement {
    _highlightQuery: Array<HighlighQuery | string> = [];

    config: Config = {
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
    number: number = 100;
    more: string = "show";
    less: string = "hide";
    completeWord: boolean = false;
    hashtag: boolean = false;
    hasLiteral: boolean = false;
    highlightCondition: string = 'exactly';
    highlightList: HighlighQuery[] = [{ name: '', color: '' }];
    text: string = "";
    /** to display show or hide button*/
    replace: boolean = false;
    mention: boolean = false;
    identifyLink: IdentifyLink = {
        hasQueryString: false,
        title: "",
        class: "",
        style: "text-decoration:none;color:blue;",
        domain: [],
        protocol: [],
        target: "_blank",
        enabled: false
    };
    linkList: Array<string> = [];
    linkCount: number = 0;
    hashtagCount: number = 0;
    mentionCount: number = 0;
    replaceString = "***";
    connectedLoaded = false;
    dataLoaded = false;
    tempHtml = "";

    constructor() {
        super();
        (<any>window).trun = this;
        const observer = new MutationObserver(() => {
            if (this.connectedLoaded && !this.dataLoaded) {
                this.initialValues();
            }
        });
        // call 'observe' on that MutationObserver instance, 
        // passing it the element to observe, and the options object
        observer.observe(this, { characterData: false, childList: true, attributes: false });
    }

    /** is object instanse of HighlighQuery / آیا آبجکت نمونه ای از HighlighQuery است 
     * @param {object}  object to check
     * @returns {boolean}
    */
    private instanceOfHighlighQuery(object: any): object is HighlighQuery {
        return typeof object === 'string' ? false : 'name' in object;
    }

    connectedCallback() {
        this.initialValues();
        this.connectedLoaded = true;
    }

    attributeChangedCallback(attrName: string, _oldVal: any, _newVal: any) {
        if (this.connectedLoaded) {
            this.initialValues(attrName);
        }
    }

    static get observedAttributes() {
        return ['config'];
    }
    /** inital values / مقدار دهی اولیه */
    private initialValues(attrName: string = "config") {

        if (!this.innerHTML) {
            return;
        }
        if (!this.tempHtml) {
            this.tempHtml = this.innerHTML;
        }

        const conf = this.getAttribute(attrName);
        if (conf?.length) {
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

        // sort highlight query
        if (this._highlightQuery && this._highlightQuery.length)
            this._highlightQuery.sort((a: HighlighQuery | string, b: HighlighQuery | string): number => {
                if (this.instanceOfHighlighQuery(a) && this.instanceOfHighlighQuery(b)) {
                    if (a.name && b.name)
                        return a.name.length - b.name.length;
                }
                else if (typeof a === 'string' && this.instanceOfHighlighQuery(b)) {
                    if (b.name)
                        return a.length - b.name.length;
                }
                else if (this.instanceOfHighlighQuery(b) && typeof a === 'string') {
                    if (b.name)
                        return a.length - b.name.length;
                }
                else if (typeof b === 'string' && typeof a === 'string') {
                    return a.length - b.length
                }
                else
                    return 0;
                return 0;
            });
        this.main(this.tempHtml);
        this.dataLoaded = true;
    }

    /** main method, start working 
    * @param text {string}
    */
    private main(text: string): void {
        if (!this.hasLiteral) text = text.replace(/(\r\n\t|\n|\r\t)/gm, ' ');
        this.text = text;
        let remainText = "";
        if (text.length > this.number) {
            remainText = this.cutFindHighlight(this.completeWord, this.hashtag, this.mention, text, this.highlightCondition, this._highlightQuery, this.number);
            this.replace = true;
            this.innerHTML = remainText + ' ... ';
            const span = document.createElement('span');
            span.innerHTML = this.more;
            span.style.color = '#ff00ff';
            span.style.cursor = 'pointer';
            span.classList.add("toggleText");
            this.innerHTML = remainText + "... ";

            span.addEventListener('click', (event) => this.replace === true ? this.showFullText(event) : this.hideSomeText(event));
            this.appendChild(span);
        }
        else {
            text = this.cutFindHighlight(this.completeWord, this.hashtag, this.mention, text, this.highlightCondition, this._highlightQuery);
            this.innerHTML = text;
        }
        //اعمال شود این کلاس قرار داده می شود  html در \n برای اینکه کاراکتر های
        if (this.hasLiteral)
            this.style.whiteSpace = 'pre-line';
    }



    /** show full text / نمایش کامل متن
     * @param mouseDown {mousedown} mouse event
     */
    private showFullText(mouseDown: MouseEvent): void {
        const span = document.createElement('span');
        span.innerHTML = " " + this.less;
        span.style.color = '#ff00ff';
        span.style.cursor = 'pointer';
        span.classList.add("toggleText");
        this.innerHTML = this.cutFindHighlight(this.completeWord, this.hashtag, this.mention, this.text, this.highlightCondition, this._highlightQuery);
        //اعمال شود این کلاس قرار داده می شود  html در \n برای اینکه کاراکتر های
        if (this.hasLiteral)
            this.style.whiteSpace = 'pre-line';

        span.addEventListener('click', (event) => this.hideSomeText(event));
        this.appendChild(span);
        // prevent from click on parent element
        mouseDown.stopPropagation();
        this.replace = false;
    }
    /** Display part of the text based on the number of characters requested / نمایش قسمتی از متن بر اساس تعداد کاراکتر خواسته شده
     * @param mouseDown {mousedown} mouse event
     */
    private hideSomeText(mouseDown: MouseEvent): void {
        const remainText = this.cutFindHighlight(this.completeWord, this.hashtag, this.mention, this.text, this.highlightCondition, this._highlightQuery, this.number);
        const span = document.createElement('span');
        span.style.color = '#ff00ff';
        span.classList.add("toggleText")

        span.innerHTML = this.more;
        this.innerHTML = remainText + ' ... ';
        //اعمال شود این کلاس قرار داده میشود  html در  n \برای اینکه کاراکتر های
        if (this.hasLiteral)
            this.style.whiteSpace = 'pre-line';

        span.addEventListener('click', (event) => this.showFullText(event));
        this.appendChild(span);
        // prevent from click on parent element
        mouseDown.stopPropagation();
        this.replace = true;
    }

    /** cut text, find hashtag , mention , highlight and urls / کوتاه کردن متن ، پیدا کردن هشتگ ، منشن ، هایلایت و یو آر ال ها
     * @param completeWord {boolean} condition to cut
     * @param hashtag {boolean} condition to find hashtag
     * @param mention {boolean} condition to find mentiong
     * @param text {string} text to cut
     * @param highlightCondition {string} condition to highlight
     * @param highlightQuery {string} query to highlight
     * @returns {string} cutted text
    */
    private cutFindHighlight(completeWord: boolean, hashtag: boolean, mention: boolean, text: string, highlightCondition = 'exactly', highlightQuery: Array<HighlighQuery | string> = [], number?: number) {
        if (number)
            text = completeWord ? this.checkWordCut(number, text) : text.substring(0, number);
        if (this.identifyLink.enabled) {
            text = this.linkIdentify(text);
        }
        text = hashtag ? this.findHashtag(text) : text;
        text = mention ? this.findMention(text) : text;
        text = this.highlight(text, highlightCondition, highlightQuery);

        if (this.linkList.length > 0) {
            text = this.linkList.reduce((text, link, currentIndex) => {
                const href = link.includes('http') ? link.trimStart() : 'https://' + link.trimStart();
                const target = this.identifyLink.target ? this.identifyLink.target : '_blank';
                const title = this.identifyLink.title ? this.identifyLink.title : '';
                const klass = this.identifyLink.class ? this.identifyLink.class : '';
                const style = this.identifyLink.style ? this.identifyLink.style : '';
                return text.replace(`${this.replaceString}${currentIndex}${this.replaceString}`, `<a href="${href}" target="${target}" title="${title}" style="${style}" class="${klass}">${link}</a>`);
            }, text);
        }
        this.linkCount = 0;
        this.linkList = [];
        return text;
    }


    /**
     * find url in text and add to linkList
     * @param text {string} text to find url
     * @returns {string} text with url
     */
    private linkIdentify(text: string): string {
        // main regex
        // regex = /(^|[ ])(ftp:\/\/|(https?:)\/\/(www\\.)?|www\.)([\w\-\.]+)(((\:|\/|\?){1}\S*)*|\w+)+/gm
        let regex;
        let protocolRegex = "(ftp:\\/\\/|(https?:)\\/\\/(www\\.)?|www\\.)";
        let domainRegex = "";
        let queryString = "\\w+";
        const afterDomain = "(((\\:|\\/|\\?){1}\\S*)*|\\w+)+";
        if (this.identifyLink.protocol && this.identifyLink.protocol.length > 0)
            protocolRegex = this.recognizingProtocol();
        if (this.identifyLink.domain && this.identifyLink.domain.length > 0)
            domainRegex = this.recongnizingDomain();
        if (this.identifyLink.hasQueryString)
            queryString = afterDomain;

        regex = new RegExp(`(^|[ ])${protocolRegex}([\\w\\-\\.]+)${domainRegex}${queryString}`, 'gm');

        let m;
        while ((m = regex.exec(text)) !== null) {
            this.linkList.push(m[0]);
            text = text.replace(m[0], this.replaceString + this.linkCount + this.replaceString);
            this.linkCount++;
        }
        return text;
    }
    /** create regex for prefix | protocol
     * @returns {string} regex
     */
    private recognizingProtocol(): string {
        if (this.identifyLink.protocol && this.identifyLink.protocol.length > 0) {
            
            this.identifyLink.protocol = this.identifyLink.protocol.sort();
            let protocol = [];
            if (this.identifyLink.protocol.find(p => p === 'ftp')) {
                protocol.push("ftp:\\/\\/");
            }
            if (this.identifyLink.protocol.find(p => p === 'http')) {
                protocol.push(`http:\\/\\/(www\\.)?`);
            }
            if (this.identifyLink.protocol.find(p => p === 'https')) {
                protocol.push(`https:\\/\\/(www\\.)?`);
            }
            if (this.identifyLink.protocol.find(p => p === 'www')) {
                protocol.push("www\\.?");
            }
            return "(" + protocol.join('|') + ")";
        }
        return "";
    }
    /**
     * create regex for domain
     * @returns {string} regex
     */
    private recongnizingDomain(): string {
        return this.identifyLink.domain ? "(" + this.identifyLink.domain.join('|') + ")" : "";
    }

    /**
     * Highlight the given words in the text / رنگ کردن کلمات داده شده در متن
     * @param content {string} text to highlight
     * @param highlightCondition {string} condition to highlight
     * @param highlightQuery {Array<HighlighQuery | string>} 
     * @returns {string} highlighted text
     */
    private highlight(content: string, highlightCondition = "", highlightQuery: Array<HighlighQuery | string>): string {
        //روی دایرکتیو تعریف نشود خود متن را بر می کرداند highlightList اگر ورودی
        if (!highlightQuery || !highlightQuery.length) {
            return content;
        }
        // دقیقا یافت می شود  highlightList روی دایرکتیو تعریف نشود کلمات داده شده در highlightCondition اگر ورودی
        if (highlightCondition == "exactly") {
            for (let q of highlightQuery) {
                let pattern = '';
                //به صورت آبجکت باشند highlightList اگر کلمات داده شده در
                if (typeof q !== 'string') {
                    pattern = "(^|(?<!\\p{L}))(" + q.name + ")(?!(\\p{L}))";
                    const color = q.color ? q.color : 'yellow';
                    content = content.replace(new RegExp(pattern, 'gmu'), match => {
                        return `<span style="background:${color}">${match}</span>`;
                    });
                }
                //به صورت رشته باشند highlightList اگر کلمات داده شده در
                else {
                    pattern = "(^|(?<!\\p{L}))(" + q + ")(?!(\\p{L}))";
                    content = content.replace(new RegExp(pattern, 'gmu'), match => {
                        return `<span style="background:yellow">${match}</span>`;
                    });
                }
            }
            return content;
        }
        //هر مشابهی از کلمات در متن پیدا شده و رنگ می شوند
        else {
            for (let q of highlightQuery) {
                //به صورت آبجکت باشند highlightList اگر کلمات داده شده در
                if (typeof q !== 'string' && q.name) {
                    let words = content.match(new RegExp(q.name, "gmi"));
                    words = [...new Set(words)];
                    if (words)
                        for (const word of words) {
                            const color = q.color ? q.color : 'yellow';
                            content = content.replace(new RegExp(q.name, "gm"), `<span style="background-color:${color}">${word}</span>`);
                        }
                }
                //به صورت رشته باشند highlightList اگر کلمات داده شده در
                else {
                    if (typeof q === 'string') {
                        let words = content.match(new RegExp(q, "gmi"));
                        words = [...new Set(words)];
                        if (words)
                            for (const word of words) {
                                content = content.replace(new RegExp(word, "gm"), `<span style="background-color:yellow">${word}</span>`);
                            }
                    }
                }
            }
            return content;
        }
    }

    /** check the word cut / بررسی کلمات برش شده
     * @param number {number}
     * @param text {string}
     * @returns {string}
     */
    private checkWordCut(number: number, text: string): string {
        let i = 0;
        for (i = number; i < text.length; i++) {
            if (text[i] == ' ') break;
        }
        return text.substring(0, i);
    }

    /** find hashtags in text / یافتن هشتگ در متن
     * @param text {string}
     * @returns {string}
     */
    private findHashtag(text: string): string {
        text = text.replace(/(^|\s)(#[\p{Pc}\p{N}\p{L}\u200cÀ-ÖØ-öø-ʸ(_)]+)/ugmi, (match) => {
            return `<span class="hashtag" style="color:#1b95e0">${match}</span>`;
        });
        return text;
    }

    /** find mentions in text / یافتن منشن در متن
     * @param text {string}
     * @returns {string}
    */
    private findMention(text: string): string {
        text = text.replace(/(^|\s)(@[^0-9|\.](\w{1,30}|\.)+)/gmi, (match) => {
            return `<span class="mention" style="color:#0095f6">${match}</span>`;
        });
        return text;
    }

}
customElements.define('truncate-element', TruncateElement);


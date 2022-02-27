import { HighlighQuery, Config } from "./interfaces";
export { Config, HighlighQuery } from "./interfaces"

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
        mention: false
    };
    number: number = 100;
    more: string = "show";
    less: string = "hide";
    completeWord: boolean = false;
    hashtag: boolean = false;
    hasLiteral: boolean = false;
    highlightCondition: string = 'exactly';
    highlightList: HighlighQuery[] = [{ name: '', color: '' }];
    text: string = ""
    replace: boolean = false;
    mention: boolean = false;

    connectedLoaded = false;
    dataLoaded = false;
    tempHtml = "";

    constructor() {
        super();

        const observer = new MutationObserver(() => {
            if (this.connectedLoaded && !this.dataLoaded) {
                this.initialValues();
            }
        });
        // call 'observe' on that MutationObserver instance, 
        // passing it the element to observe, and the options object
        observer.observe(this, { characterData: false, childList: true, attributes: false });
    }

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
        }
        else
            return;

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
        this.fill(this.tempHtml);
        this.dataLoaded = true;
    }

    fill(text: string) {
        if (!this.hasLiteral) text = text.replace(/(\r\n\t|\n|\r\t)/gm, ' ');
        this.text = text;
        let remainText = "";
        if (text.length > this.number) {
            remainText = this.cutFindHighlight(this.completeWord, this.hashtag, this.mention, text, this.highlightCondition, this._highlightQuery, this.number);
            // برای نمایش ادامه یا پنهان
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



    /*
     * نمایش کامل متن
     * @param mouseDown {mousedown} mouse event
     */
    showFullText(mouseDown: MouseEvent) {
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
        // جلوگیری از کلیک روی عنصر پدر
        mouseDown.stopPropagation();
        this.replace = false;
    }
    /*
     * نمایش قسمتی از متن بر اساس تعداد کاراکتر خواسته شده
     * @param mouseDown {mousedown} mouse event
     */
    hideSomeText(mouseDown: MouseEvent) {
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
        // جلوگیری از کلیک روی عنصر پدر
        mouseDown.stopPropagation();
        this.replace = true;
    }

    /** implement cut text, find hashtag and mention and highlight 
     * @param completeWord {boolean} condition to cut
     * @param hashtag {boolean} condition to find hashtag
     * @param mention {boolean} condition to find mentiong
     * @param text {string} text to cut
     * @param highlightCondition {string} condition to highlight
     * @param highlightQuery {string} query to highlight
     * @returns {string} cutted text
    */
    cutFindHighlight(completeWord: boolean, hashtag: boolean, mention: boolean, text: string, highlightCondition = 'exactly', highlightQuery: Array<HighlighQuery | string> = [], number?: number) {
        if (number)
            text = completeWord ? this.checkWordCut(number, text) : text.substring(0, number);
        text = hashtag ? this.findHashtag(text) : text;
        text = mention ? this.findMention(text) : text;
        text = this.highlight(text, highlightCondition, highlightQuery);
        return text;
    }


    /**
     * رنگ کردن کلمات داده شده در متن
     * @param content
     */
    highlight(content: string, highlightCondition = "", highlightQuery: Array<HighlighQuery | string>): string {
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
                    if (words)
                        for (const word of words) {
                            const color = q.color ? q.color : 'yellow';
                            content = content.replace(new RegExp(q.name, "gmi"), `<span style="background-color:${color}">${word}</span>`);
                        }
                }
                //به صورت رشته باشند highlightList اگر کلمات داده شده در
                else {
                    if (typeof q === 'string') {
                        let words = content.match(new RegExp(q, "gmi"));
                        if (words)
                            for (const word of words) {
                                content = content.replace(new RegExp(q, "gmi"), `<span style="background-color:yellow">${word}</span>`);
                            }
                    }
                }
            }
            return content;
        }
    }

    /** check the word cut */
    checkWordCut(number: number, text: string) {
        let i = 0
        for (i = number; i < text.length; i++) {
            if (text[i] == ' ') break;
        }
        return text.substring(0, i);
    }

    /** find hashtag from text */
    findHashtag(text: string) {
        text = text.replace(/(^|\s)(#[\p{Pc}\p{N}\p{L}\u200cÀ-ÖØ-öø-ʸ(_)]+)/ugmi, (match) => {
            return `<span class="hashtag" style="color:#1b95e0">${match}</span>`;
        });
        return text;
    }

    /** find mention from text */
    findMention(text: string) {
        text = text.replace(/(^|\s)(@[^0-9|\.](\w{1,30}|\.)+)/gmi, (match) => {
            return `<span class="mention" style="color:#0095f6">${match}</span>`;
        });
        return text;
    }

}
customElements.define('truncate-element', TruncateElement);


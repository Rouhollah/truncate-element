import { ProccessModel, WordModel } from "./base";
import { HighlighQuery, Config, IdentifyLink, GeneralModel, Type } from "./interfaces";
import { WordCut, Link, Hashtag, Mention, Highlight, NullModel } from "./services";
export { Config, HighlighQuery, IdentifyLink } from "./interfaces";
export { ProccessModel, WordModel } from "./base"

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
    truncated: boolean = false;
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
    userModels: Array<GeneralModel> = [];
    linkList: Array<string> = [];
    linkCount: number = 0;
    hashtagCount: number = 0;
    mentionCount: number = 0;
    replaceString = "***";
    connectedLoaded = false;
    dataLoaded = false;
    tempHtml = "";
    wordArray: Array<string> = [];
    remainText: string = "";
    fullText: string = "";
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

    addUserModel(...userModel: Array<Type<ProccessModel>>) {
        this.userModels.push(...userModel.map(f => ({ model: f } as GeneralModel)));
    }

    connectedCallback() {
        setTimeout(() => {
            this.initialValues();
        }, 0)

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
    /** initial values */
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

        this.main(this.tempHtml);
        this.dataLoaded = true;
    }

    /** main method, start working 
    * @param text {string}
    */
    private main(text: string): void {
        if (!this.hasLiteral) text = text.replace(/(\r\n\t|\r\n|\n|\r\t)/gm, ' ');

        this.text = text;
        this.wordArray = text.split(" ").filter(f => this.hasLiteral ? true : f.length > 0);

        const processModels: Array<GeneralModel> = [];

        const _words: WordModel[] = [];
        const nullModel = new NullModel(this.config);
        for (const word of this.wordArray) {
            _words.push(nullModel.process(word));

        }

        if (this.config.highlightList?.length) {
            processModels.push({ model: Highlight });
        }

        if (this.config.identifyLink?.enabled)
            processModels.push({ model: Link });

        if (this.config.hashtag)
            processModels.push({ model: Hashtag });

        if (this.config.mention)
            processModels.push({ model: Mention });

        if (this.userModels?.length) {
            this.userModels.forEach(user => {
                processModels.push(user);
            });
        }

        for (let model of _words) {
            for (const gm of processModels) {
                const wm = new gm.model(this.config);
                if (model.length == 0) continue;
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
    private initialText(text: string, toggle?: string): void {
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
    private showText(text: string, mouseDown: MouseEvent): void {
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
    private createSpan(toggle: string): HTMLSpanElement {
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



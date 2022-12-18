import { HighlighQuery, Config, IdentifyLink } from "./interfaces";
import { WordCut, Link, Hashtag, Mention, Highlight, NullModel, GeneralModel, ProccessModel, Type, WordModel } from "./services";

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
    connectedLoaded = false;
    dataLoaded = false;
    tempHtml = "";
    wordArray: Array<string> = [];
    remainText: string = "";
    fullText: string = "";
    truncatedWord = { model: new WordModel(''), index: 0 };
    processModels: Array<GeneralModel> = [];
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
        if (!this.hasLiteral)
            text = text.replace(/(\r\n\t|\r\n|\n|\r\t)/gm, ' ');

        this.text = text;
        if (text.length > this.number) {
            this.truncated = true;
            const wordCut = new WordCut(this.number);
            if (this.completeWord)
                text = wordCut.cut(text)
            else {
                text = text.substring(0, this.number);
                const last = this.text.split(" ")[text.split(" ").length - 1]
                this.truncatedWord.model = this.reviewTruncatedWordHasLink(last);
                this.truncatedWord.index = text.split(" ").length - 1;
            }
        }
        // all necessary classes
        this.processModels = this.generateModels();

        // just once calling each class
        const instances = this.callOnceClasses()

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
                    this.remainText = this.remainText.replace(new RegExp(`<a href=${l.word} `), `<a href=${replacement} `)
                }
            }
        }
        else {
            this.remainText = text + " ... ";
        }

        if (full.length) [
            this.fullText = full.map(m => m.html ? m.html : m.word).join(" ")
        ]
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
    private callOnceClasses() {
        const instances: Array<ProccessModel> = [];
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
    private reviewTruncatedWordHasLink(word: string): WordModel {
        const link = new Link(this.config);
        return link.process(new WordModel(word));
    }

    /**
     * finally process all attributes of config and user models defined for each word
     * @param _words WordModel[]
     * @param instances ProccessModel[]
     * @returns WordModel[]
     */
    private proccessOnWordModels(_words: Array<WordModel>, instances: Array<ProccessModel>): Array<WordModel> {
        for (let word of _words) {
            for (const gm of instances) {
                if (word.length == 0) continue;
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
    private createWordModelFromString(array: Array<string>) {
        const _words: WordModel[] = [];
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
    private generateModels(): Array<GeneralModel> {
        const generalModels: Array<GeneralModel> = [];

        if (this.config.highlightList?.length)
            generalModels.push({ model: Highlight });

        if (this.config.identifyLink?.enabled)
            generalModels.push({ model: Link });

        if (this.config.hashtag)
            generalModels.push({ model: Hashtag });

        if (this.config.mention)
            generalModels.push({ model: Mention });

        if (this.userModels?.length) {
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



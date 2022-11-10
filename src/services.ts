import { Config, HighlighQuery, IdentifyLink, MyHighLightQuery, Sible } from "./interfaces";

export abstract class ProccessModel {
    constructor(_config: any) { }
    abstract process(word: string | WordModel): WordModel;
}
export class WordModel {
    word: string = "";
    length: number = 0;
    type: string = "simple";
    html?: string = "";

    constructor(word: string) {
        this.word = word;
        this.length = word.length;
    }

}
export interface Type<T> extends Function {
    new(...args: any[]): T;
}

export interface GeneralModel {
    model: Type<ProccessModel>
}


export class WordCut {
    Number: number;

    /**
     * create an instance of WordCut with desired number
     * @param num number
     */
    constructor(num: number) {
        this.Number = num;
    }

    /**
     * truncate the string to the desired number 
     * @param text string
     * @returns string
     */
    cut(text: string): string {
        let i = 0;
        for (i = this.Number; i < text.length; i++) {
            if (text[i] == ' ') break;
        }
        return text.substring(0, i);
    }
}

export class Link extends ProccessModel {
    IdentifyLink: IdentifyLink;;
    LinkCount: number = 0;
    LinkList: Array<string> = [];
    constructor(_config: Config) {
        super(_config);
        if (_config.identifyLink)
            this.IdentifyLink = _config.identifyLink;
        else
            this.IdentifyLink = {
                enabled: false
            }
    }

    /**
     * process model for identifying links
     * @param model WordModel class
     * @returns WordModel
     */
    process(model: WordModel): WordModel {
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
    private recognizingProtocol(): string {
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
    private recongnizingDomain(): string {
        return this.IdentifyLink.domain ? "(" + this.IdentifyLink.domain.join('|') + ")" : "";
    }
}

export class Mention extends ProccessModel {

    /**
     * process model for identifying mentions
     * @param model {class} WordModel
     * @returns WordModel
     */
    process(model: WordModel): WordModel {
        const pattern = /(^|\s)(@[^\d\.\s](\w{1,30}|\.)+)$/gmi;
        if (pattern.test(model.word)) {
            model.type += ' mention';
            model.html = `<span class=mention style=color:#0095f6>${model.html ? model.html : model.word}</span>`
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
    process(model: WordModel): WordModel {
        const pattern = /(^|\s)(#[\p{Pc}\p{N}\p{L}\u200cÀ-ÖØ-öø-ʸ(_)]+)$/gmui;
        if (pattern.test(model.word)) {
            model.html = `<span class=hashtag style=color:#1b95e0>${model.html ? model.html : model.word}</span>`;
            model.type += ' hashtag';
        }
        return model;
    }
}

export class Highlight extends ProccessModel {
    highlightQuery: Array<MyHighLightQuery>;
    highlightCondition: string;
    nestedHighlightArray: Array<Sible>;
    constructor(_config: Config) {
        super(_config);
        (<any>window).highlight = this;
        if (_config.highlightList) {
            this.highlightQuery = _config.highlightList.map((h: HighlighQuery | string) => {
                let high: Partial<MyHighLightQuery> = {};
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
                return high as MyHighLightQuery;
            });
        }
        else {
            this.highlightQuery = [];
        }

        this.highlightCondition = _config.highlightCondition;
        if (this.highlightQuery.length) {
            this.highlightQuery.sort((a: MyHighLightQuery, b: MyHighLightQuery): number => {
                return a.name.length - b.name.length;
            })
        }

        this.nestedHighlightArray = this.findHighlightInAnother();
    }

    /**
     * process model for highlighting
     * @param model WordModel class
     * @returns WordModel
     */
    process(model: WordModel): WordModel {
        if (!this.highlightQuery || !this.highlightQuery.length) {
            return model;
        }
        if (this.highlightCondition == "exactly") {
            for (let q of this.highlightQuery) {
                if (q.name.length > model.length) continue;
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
                    this.highlightQuery = this.highlightQuery.filter((h: MyHighLightQuery) => !h.existInAnotherQuery).filter((h: MyHighLightQuery) => h.name != nested.parent);
                }

                for (const q of this.highlightQuery) {
                    const regex = new RegExp(q.name, 'gmi');
                    if (regex.test(model.word)) {
                        regex.lastIndex = 0;
                        if (model.html) {
                            let tag = model.html.split(q.name)
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
    private instanceOfHighlighQuery(object: any): object is HighlighQuery {
        return typeof object === 'string' ? false : 'name' in object;
    }

    /**
     * create span tag with favorite color
     * @param color 
     * @param word 
     * @returns string
     */
    private createTag(color: string, word: string) {
        return `<span style="background:${color}">${word}</span>`;
    }

    /**
     * finds words in highlightQuery array and color them
     * @returns Array<Sible>
     */
    private findHighlightInAnother(): Array<Sible> {
        const sibling: Array<Sible> = [];
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
                    const s = sibling.find((s: Sible) => s.parent == element.name);
                    if (s) {
                        q.tag = this.createTag(q.color, q.name);
                        q.index = element.name.indexOf(q.name);
                        s.children.push(q);
                    }
                    else {
                        const obj: Sible = {
                            parent: '',
                            parentTag: '',
                            children: []
                        }
                        obj.parent = element.name;
                        q.tag = this.createTag(q.color, q.name);
                        q.index = element.name.indexOf(q.name);
                        obj.children.push(q);
                        sibling.push(obj);
                    }
                }
            }
        });
        sibling.forEach((element: Sible) => {
            let parent = element.parent;
            element.children.sort((a, b) => a.index - b.index).forEach((child: MyHighLightQuery, i: number) => {
                const pattern = new RegExp(child.name, 'gm');
                const from = i == 0 ? parent.indexOf(child.name) : element.children[i - 1].tag.length;
                parent = this.replaceAfterIndex(parent, pattern, child.tag, from);
            })
            element.parentTag = this.createTag(this.highlightQuery.find((h: MyHighLightQuery) => h.name == element.parent)!.color, parent);
        })
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
    private replaceAfterIndex(text: string, search: RegExp, replace: string, from: number): string {
        if (text.length > from) {
            return text.slice(0, from) + text.slice(from).replace(search, replace);
        }
        return text;
    }
}

export class NullModel extends ProccessModel {

    /**
     * get string and convert to WordModel
     * @param model WordModel class
     * @returns WordModel
     */
    process(word: string): WordModel {
        return new WordModel(word);
    }
}


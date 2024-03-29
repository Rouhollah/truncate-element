import { Config, IdentifyLink, MyHighLightQuery } from "./interfaces";
export declare abstract class ProccessModel {
    constructor(_config: any);
    abstract process(word: string | WordModel): WordModel;
}
export declare class WordModel {
    word: string;
    length: number;
    type: string;
    html?: string;
    constructor(word: string);
}
export interface Type<T> extends Function {
    new (...args: any[]): T;
}
export interface GeneralModel {
    model: Type<ProccessModel>;
}
export declare class WordCut {
    Number: number;
    /**
     * create an instance of WordCut with desired number
     * @param num number
     */
    constructor(num: number);
    /**
     * truncate the string to the desired number
     * @param text string
     * @returns string
     */
    cut(text: string): string;
}
export declare class Link extends ProccessModel {
    IdentifyLink: IdentifyLink;
    LinkCount: number;
    LinkList: Array<string>;
    constructor(_config: Config);
    /**
     * process model for identifying links
     * @param model WordModel class
     * @returns WordModel
     */
    process(model: WordModel): WordModel;
    /** create regex for prefix | protocol
     * @returns {string} regex
     */
    private recognizingProtocol;
    /** create regex for domain
     * @returns {string} regex
     */
    private recongnizingDomain;
}
export declare class Mention extends ProccessModel {
    /**
     * process model for identifying mentions
     * @param model {class} WordModel
     * @returns WordModel
     */
    process(model: WordModel): WordModel;
}
export declare class Hashtag extends ProccessModel {
    /**
     * process model for identifying hashtags
     * @param model {class} WordModel
     * @returns WordModel
     */
    process(model: WordModel): WordModel;
}
export declare class Highlight extends ProccessModel {
    highlightQuery: Array<MyHighLightQuery>;
    highlightCondition: string;
    nestedHighlightArray: Array<MyHighLightQuery>;
    checkedNestedHighlight: boolean;
    constructor(_config: Config);
    /**
    * finds words in highlightQuery array and color them
    * @returns Array<Sible>
    */
    private findHighlightInAnother;
    private transform;
    /** is object instance of HighlighQuery
     * @param {object}  object to check
     * @returns {boolean} true or false
    */
    private instanceOfHighlighQuery;
    /**
        * process model for highlighting
        * @param model WordModel class
        * @returns WordModel
        */
    process(model: WordModel): WordModel;
    /**
     * create span tag with favorite color
     * @param color
     * @param word
     * @returns string
     */
    private createTag;
}
export declare class NullModel extends ProccessModel {
    /**
     * get string and convert to WordModel
     * @param model WordModel class
     * @returns WordModel
     */
    process(word: string): WordModel;
}

import { ProccessModel, WordModel } from "./base";
import { Config, IdentifyLink, MyHighLightQuery, Sible } from "./interfaces";
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
    nestedHighlightArray: Array<Sible>;
    constructor(_config: Config);
    /**
     * process model for highlighting
     * @param model WordModel class
     * @returns WordModel
     */
    process(model: WordModel): WordModel;
    /** is object instance of HighlighQuery
     * @param {object}  object to check
     * @returns {boolean} true or false
    */
    private instanceOfHighlighQuery;
    /**
     * create span tag with favorite color
     * @param color
     * @param word
     * @returns string
     */
    private createTag;
    /**
     * finds words in highlightQuery array and color them
     * @returns Array<Sible>
     */
    private findHighlightInAnother;
    /**
     * replace words after specific index
     * @param text string
     * @param regex search
     * @param string replace
     * @param number from
     * @returns string
     */
    private replaceAfterIndex;
}
export declare class NullModel extends ProccessModel {
    /**
     * get string and convert to WordModel
     * @param model WordModel class
     * @returns WordModel
     */
    process(word: string): WordModel;
}

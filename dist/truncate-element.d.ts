import { HighlighQuery, Config, IdentifyLink } from "./interfaces";
import { GeneralModel, ProccessModel, Type, WordModel } from "./services";
export declare class TruncateElement extends HTMLElement {
    _highlightQuery: Array<HighlighQuery | string>;
    config: Config;
    number: number;
    more: string;
    less: string;
    completeWord: boolean;
    hashtag: boolean;
    hasLiteral: boolean;
    highlightCondition: string;
    highlightList: HighlighQuery[];
    text: string;
    /** to display show or hide button*/
    truncated: boolean;
    mention: boolean;
    identifyLink: IdentifyLink;
    userModels: Array<GeneralModel>;
    linkList: Array<string>;
    linkCount: number;
    hashtagCount: number;
    mentionCount: number;
    connectedLoaded: boolean;
    dataLoaded: boolean;
    tempHtml: string;
    wordArray: Array<string>;
    remainText: string;
    fullText: string;
    truncatedWord: {
        model: WordModel;
        index: number;
    };
    processModels: Array<GeneralModel>;
    constructor();
    addUserModel(...userModel: Array<Type<ProccessModel>>): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, _oldVal: any, _newVal: any): void;
    static get observedAttributes(): string[];
    /** initial values */
    private initialValues;
    /** main method, start working
    * @param text {string}
    */
    private main;
    /**
     * once calling each class
     * @returns
     */
    private callOnceClasses;
    /**
     * review if the word is truncated has link or not
     * @param word string
     * @returns WordModel
     */
    private reviewTruncatedWordHasLink;
    /**
     * finally process all attributes of config and user models defined for each word
     * @param _words WordModel[]
     * @param instances ProccessModel[]
     * @returns WordModel[]
     */
    private proccessOnWordModels;
    /**
     * create WordModel class of each wrod
     * @param array {string[]}
     * @returns string[]
     */
    private createWordModelFromString;
    /**
     * generate necessary classes for each word
     * @returns GeneralModel[]
     */
    private generateModels;
    /**
     * display text in first time
     * @param text
     * @param toggle
     */
    private initialText;
    /**
     * display string after click on toggle text
     * @param text string
     * @param mouseDown mouse event
     */
    private showText;
    /**
     * create span for toggling
     * @param toggle custom word for toggle
     * @returns
     */
    private createSpan;
}

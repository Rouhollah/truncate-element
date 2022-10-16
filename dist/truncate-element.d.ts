import { ProccessModel } from "./base";
import { HighlighQuery, Config, IdentifyLink, GeneralModel, Type } from "./interfaces";
export { Config, HighlighQuery, IdentifyLink } from "./interfaces";
export { ProccessModel, WordModel } from "./base";
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
    replaceString: string;
    connectedLoaded: boolean;
    dataLoaded: boolean;
    tempHtml: string;
    wordArray: Array<string>;
    remainText: string;
    fullText: string;
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

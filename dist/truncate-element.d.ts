import { HighlighQuery, Config } from "./interfaces";
export { Config, HighlighQuery } from "./interfaces";
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
    replace: boolean;
    connectedLoaded: boolean;
    dataLoaded: boolean;
    tempHtml: string;
    constructor();
    private instanceOfHighlighQuery;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, _oldVal: any, _newVal: any): void;
    static get observedAttributes(): string[];
    private initialValues;
    fill(text: string): void;
    showFullText(mouseDown: MouseEvent): void;
    hideSomeText(mouseDown: MouseEvent): void;
    highlight(content: string, highlightCondition: string | undefined, highlightQuery: Array<HighlighQuery | string>): string;
    checkWordCut(number: number, text: string): string;
    findHashtag(text: string): string;
    applyCondition(text: string, number: number, completeWord?: boolean, hashtag?: boolean): string;
}
export interface HighlighQuery {
    name?: string;
    color?: string;
}
export interface Config {
    more: string;
    less: string;
    number: number;
    completeWord: boolean;
    hashtag: boolean;
    highlightCondition: string;
    hasLiteral: boolean;
    highlightList: Array<HighlighQuery | string>;
}

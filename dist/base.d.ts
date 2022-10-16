import { Config } from "./interfaces";
export declare abstract class ProccessModel {
    constructor(_config: Config);
    abstract process(word: string | WordModel): WordModel;
}
export declare class WordModel {
    word: string;
    length: number;
    type: string;
    html?: string;
    constructor(word: string);
}

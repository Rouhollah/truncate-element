import { Config } from "./interfaces";

export abstract class ProccessModel {
    constructor(_config: Config) { }
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
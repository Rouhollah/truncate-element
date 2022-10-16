import { ProccessModel } from "./base";


export interface HighlighQuery {
  name?: string,
  color?: string
}

export interface FinalHighlighQuery {
  name: string,
  tag: string
}

export interface MyHighLightQuery {
  name: string,
  color: string,
  tag: string,
  index: number,
  existInAnotherQuery: boolean
}

export interface IdentifyLink {
  enabled: boolean,
  hasQueryString?: boolean,
  title?: string,
  class?: string,
  style?: string,
  domain?: Array<string>,
  protocol?: Array<string>,
  target?: string
}

export interface Config {
  more: string,
  less: string,
  number: number,
  completeWord: boolean,
  hashtag?: boolean,
  highlightCondition: string,
  hasLiteral: boolean,
  highlightList: Array<HighlighQuery | string>,
  mention?: boolean,
  identifyLink?: IdentifyLink,
}


export interface Sible {
  parent: string,
  parentTag: string,
  children: Array<MyHighLightQuery>,
}

export interface Type<T> extends Function {
  new(...args: any[]): T;
}

export interface GeneralModel {
  model: Type<ProccessModel>
}


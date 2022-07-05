export enum Language {
  uk = 'uk',
  en = 'en',
}

export type Translation = {
  [key in Language]: string;
};

export type Cases = number[] | string[] | Translation[];

export interface IAttribute {
  category: string;
  key: string;
  cases: Cases;
}

export interface AttributeByCategory {
  [key: string]: Cases;
}

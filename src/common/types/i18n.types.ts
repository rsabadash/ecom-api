export type TranslationRequired = {
  uk: string;
};

export type TranslationsOptional = {
  en?: null | string;
};

export type Translations = TranslationRequired & TranslationsOptional;

export type TranslationsAllRequired = Required<Translations>;

export type Language = keyof Translations;

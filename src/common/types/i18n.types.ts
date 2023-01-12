export type TranslationRequired = {
  uk: string;
};

export type TranslationsOptional = {
  en?: string | null;
};

export type Translations = TranslationRequired & TranslationsOptional;

export type TranslationsAllRequired = Required<Translations>;

export type Language = keyof Translations;

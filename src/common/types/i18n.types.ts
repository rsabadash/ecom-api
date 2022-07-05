export type Translation = {
  uk: string;
  en: string;
};

export type Translatable<T = undefined> = T extends undefined
  ? string
  : Translation;

export type Language = keyof Translation;

export interface TranslationSystem {
  translate(texts: Array<string>, targetLanguage: string): Promise<Array<string>>;
}

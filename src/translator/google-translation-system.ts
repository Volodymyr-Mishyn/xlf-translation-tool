import { TranslationSystem } from '../_models/translation-system';
const { Translate } = require('@google-cloud/translate').v2;

export class GoogleTranslationSystem implements TranslationSystem {
  private _translate;
  constructor(apiKey: string) {
    this._translate = new Translate({ key: apiKey });
  }

  async translate(texts: Array<string>, targetLanguage: string): Promise<Array<string>> {
    const [translations] = await this._translate.translate(texts, targetLanguage);
    return translations;
  }
}

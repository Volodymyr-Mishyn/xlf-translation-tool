import fs from 'fs';
import { cloneDeep } from 'lodash';
import { TranslationConfiguration } from '../_models/translation-configuration';
import { TranslationSystem } from '../_models/translation-system';
import { Builder, parseStringPromise } from 'xml2js';
import { XlfFile } from './_models/xlf-file';
import { TransUnit } from './_models/trans-unit';

export class TranslatorService {
  constructor(
    private _translationSystem: TranslationSystem,
    private _configuration: TranslationConfiguration,
  ) {}

  private async _readFile(): Promise<XlfFile> {
    const fileContent = fs.readFileSync(this._configuration.sourceFile, 'utf8');
    const file = await parseStringPromise(fileContent);
    return file;
  }

  private _saveFile(file: XlfFile, targetLanguage: string): void {
    if (!fs.existsSync(this._configuration.targetFileDirectory)) {
      fs.mkdirSync(this._configuration.targetFileDirectory, { recursive: true });
    }
    const builder = new Builder();
    const updatedXml = builder.buildObject(file);
    fs.writeFileSync(this._configuration.targetFileDirectory + `/messages.${targetLanguage}.xlf`, updatedXml);
  }

  private _extractTextsToTranslate(transUnits: Array<TransUnit>): Array<string> {
    return transUnits.map((unit: TransUnit) => {
      if (typeof unit.source[0] === 'string') {
        return unit.source[0];
      }
      return '';
    });
  }

  private async _translateFile(file: XlfFile, targetLanguage: string): Promise<XlfFile> {
    const fileCopy = cloneDeep(file);
    const transUnits = fileCopy.xliff.file[0].body[0]['trans-unit'];
    const textsToTranslate = this._extractTextsToTranslate(transUnits);
    const chunkSize = 50;

    for (let i = 0; i < textsToTranslate.length; i += chunkSize) {
      const chunk = textsToTranslate.slice(i, i + chunkSize);
      const chunkTranslations = await this._translationSystem.translate(chunk, targetLanguage);
      chunkTranslations.forEach((translatedText: any, index: number) => {
        transUnits[i + index].target = [translatedText];
      });
    }
    return fileCopy;
  }

  async translate(): Promise<void> {
    try {
      const sourceFile = await this._readFile();
      const targetLanguages = this._configuration.targetLanguages;
      for (const targetLanguage of targetLanguages) {
        const translatedFile = await this._translateFile(sourceFile, targetLanguage);
        this._saveFile(translatedFile, targetLanguage);
        console.log(`File translated to ${targetLanguage} and saved to output directory`);
      }
    } catch (e) {
      console.log('Error translating file: ', e);
      return;
    }
  }
}

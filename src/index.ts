import { TranslationConfiguration } from './_models/translation-configuration';

const config = require('config');
require('dotenv').config();

import { GoogleTranslationSystem } from './translator/google-translation-system';
import { TranslatorService } from './translator/translator-service';
async function translate() {
  const translationConfig = config as TranslationConfiguration;
  if (!translationConfig) {
    throw new Error('No translation config found');
  }
  const googleAPIKey = process.env.GOOGLE_APPLICATION_API_KEY;
  if (!googleAPIKey) {
    throw new Error('No Google API key found');
  }
  const googleTranslation = new GoogleTranslationSystem(googleAPIKey);
  const translatorService = new TranslatorService(googleTranslation, translationConfig);
  await translatorService.translate();
}

translate();

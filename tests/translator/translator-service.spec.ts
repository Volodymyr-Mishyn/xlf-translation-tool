import { TranslatorService } from 'src/translator/translator-service';

const fs = require('fs');
const { parseStringPromise, Builder } = require('xml2js'); // Ensure these are imported if used in your service

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

jest.mock('xml2js', () => ({
  parseStringPromise: jest.fn(),
  Builder: jest.requireActual('xml2js').Builder,
}));

const mockTranslationSystem = {
  translate: jest.fn(),
};

const mockConfiguration = {
  sourceLanguage: 'en',
  targetLanguages: ['uk', 'fr'],
  sourceFile: 'input/messages.xlf',
  targetFileDirectory: 'output',
};

const mockedInputStrings = ['text1', 'text2'];

const mockedInputFile = {
  xliff: {
    file: [
      {
        body: [
          {
            'trans-unit': mockedInputStrings.map((text) => ({ source: [text] })),
          },
        ],
      },
    ],
  },
};

function createExpectedTranslationFile(targetLanguage: string): string {
  return `<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>
<xliff>
  <file>
    <body>
      <trans-unit>
        <source>text1</source>
        <target>text1 translated to ${targetLanguage}</target>
      </trans-unit>
      <trans-unit>
        <source>text2</source>
        <target>text2 translated to ${targetLanguage}</target>
      </trans-unit>
    </body>
  </file>
</xliff>`;
}

const ukExpectedFile = createExpectedTranslationFile('uk');
const frExpectedFile = createExpectedTranslationFile('fr');

const mockedResultFiles: Record<string, string> = {
  uk: ukExpectedFile,
  fr: frExpectedFile,
};

describe('TranslatorService', () => {
  let service: TranslatorService;

  beforeEach(() => {
    service = new TranslatorService(mockTranslationSystem, mockConfiguration);
    fs.readFileSync.mockImplementation(() => 'mockFileContent');
    fs.existsSync.mockReturnValue(true);

    // Mock parseStringPromise to return a structured file
    parseStringPromise.mockResolvedValue(mockedInputFile);

    mockTranslationSystem.translate.mockImplementation((texts: Array<string>, targetLanguage: string) =>
      Promise.resolve(texts.map((text: string) => `${text} translated to ${targetLanguage}`)),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should read, translate, and save files for each target language', async () => {
    await service.translate();

    expect(fs.readFileSync).toHaveBeenCalledWith(mockConfiguration.sourceFile, 'utf8');
    expect(parseStringPromise).toHaveBeenCalledWith('mockFileContent');
    expect(mockTranslationSystem.translate).toHaveBeenCalledWith(['text1', 'text2'], 'uk');
    expect(mockTranslationSystem.translate).toHaveBeenCalledWith(['text1', 'text2'], 'fr');

    mockConfiguration.targetLanguages.forEach((lang) => {
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `${mockConfiguration.targetFileDirectory}/messages.${lang}.xlf`,
        mockedResultFiles[lang],
      );
    });
  });
});

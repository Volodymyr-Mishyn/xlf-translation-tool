import { TransUnit } from './trans-unit';

interface BodyUnit {
  'trans-unit': Array<TransUnit>;
  [key: string]: unknown;
}

interface FileUnit {
  body: Array<BodyUnit>;
}

export interface XlfFile {
  xliff: {
    file: Array<FileUnit>;
  };
  [key: string]: unknown;
}

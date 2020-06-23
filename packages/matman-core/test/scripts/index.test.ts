import 'mocha';
import {expect} from 'chai';

import * as matmanCore from '../../src/index';

describe('./index.ts', () => {
  it('export should be correct', () => {
    expect(matmanCore).to.have.all.keys(
      'CoverageConfig',
      'DeviceConfig',
      'MATMAN_CONFIG_FILE',
      'MatmanConfig',
      'MatmanResultConfig',
      'ScreenshotConfig',
      'findMatmanConfig',
      'getAbsolutePath',
      'requireAsync',
      'requireSync',
      'searchFilePath',
    );
  });
});

import 'mocha';
import {expect} from 'chai';

import * as matmanCore from '../../src/index';

describe('./index.ts', () => {
  it('export should be correct', () => {
    expect(matmanCore).to.have.all.keys(
      'CoverageConfig',
      'CookieConfig',
      'DeviceConfig',
      'isURLMatch',
      'MATMAN_CONFIG_FILE',
      'RUNNER_NAME',
      'MatmanResult',
      'MatmanConfig',
      'MockstarConfig',
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

import 'mocha';
import {expect} from 'chai';

import * as matmanCore from '../../src/index';

describe('./index.ts', () => {
  it('export should be correct', () => {
    expect(matmanCore).to.have.all.keys(
      'MATMAN_CONFIG_FILE',
      'MatmanConfig',
      'findMatmanConfig',
      'getAbsolutePath',
      'requireAsync',
      'requireSync',
      'searchFilePath',
    );
  });
});
